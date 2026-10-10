/* Fetches the public OHS-SF community ICS feed, resolves each event's next
 * upcoming occurrence (recurring events included), and returns a small
 * categorized JSON payload for community.html to render. Runs server-side
 * because Google's ICS endpoint sends no CORS headers. */

const ICS_URL =
  'https://calendar.google.com/calendar/ical/c_8fa26c30a3127c46beb1ec99fbae3fecd895dc436e6a998d3068f75855e5218b%40group.calendar.google.com/public/basic.ics';

const WEEKDAYS = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];
const DAY_MS = 24 * 60 * 60 * 1000;
const SEARCH_WINDOW_DAYS = 100; // how far ahead to look for the next occurrence

/* ─── ICS parsing ────────────────────────────────────────────────────── */

function unfold(text) {
  return text.replace(/\r\n/g, '\n').replace(/\n[ \t]/g, '');
}

function unescapeText(v) {
  return v
    .replace(/\\n/gi, '\n')
    .replace(/\\,/g, ',')
    .replace(/\\;/g, ';')
    .replace(/\\\\/g, '\\');
}

function parseProperty(line) {
  const colon = line.indexOf(':');
  if (colon === -1) return null;
  const head = line.slice(0, colon);
  const value = line.slice(colon + 1);
  const [name, ...paramParts] = head.split(';');
  const params = {};
  paramParts.forEach((p) => {
    const eq = p.indexOf('=');
    if (eq !== -1) params[p.slice(0, eq)] = p.slice(eq + 1).replace(/^"(.*)"$/, '$1'); // TZID="Europe/London" → Europe/London
  });
  return { name: name.toUpperCase(), params, value };
}

function parseVEvent(block) {
  const props = { EXDATE: [] };
  block.split('\n').forEach((line) => {
    if (!line.trim()) return;
    const prop = parseProperty(line);
    if (!prop) return;
    // EXDATE (cancelled occurrences) can repeat; for everything else the
    // first occurrence wins.
    if (prop.name === 'EXDATE') props.EXDATE.push(prop);
    else if (!(prop.name in props)) props[prop.name] = prop;
  });
  return props;
}

function extractVEvents(ics) {
  const blocks = ics.split('BEGIN:VEVENT').slice(1);
  return blocks.map((b) => parseVEvent(b.split('END:VEVENT')[0]));
}

/* ─── Date/time helpers ──────────────────────────────────────────────── */

function parseDateValue(prop) {
  if (!prop) return null;
  const v = prop.value;
  const tzid = prop.params.TZID;
  const isUtc = /Z$/.test(v);
  const m = /^(\d{4})(\d{2})(\d{2})(?:T(\d{2})(\d{2})(\d{2}))?/.exec(v);
  if (!m) return null;
  const year = +m[1], month = +m[2], day = +m[3];
  const hour = +(m[4] || 0), minute = +(m[5] || 0), second = +(m[6] || 0);
  if (isUtc || !tzid) return new Date(Date.UTC(year, month - 1, day, hour, minute, second));
  return zonedTimeToUtc(year, month - 1, day, hour, minute, second, tzid);
}

// Wall-clock components (no timezone resolution yet) — needed by the
// recurrence expander, which must re-resolve the UTC offset per occurrence
// date rather than reuse DTSTART's own offset (DST changes across weeks).
function parseWallClock(prop) {
  if (!prop) return null;
  const v = prop.value;
  const tzid = prop.params.TZID || null;
  const isUtc = /Z$/.test(v);
  const m = /^(\d{4})(\d{2})(\d{2})(?:T(\d{2})(\d{2})(\d{2}))?/.exec(v);
  if (!m) return null;
  return {
    year: +m[1], month: +m[2], day: +m[3],
    hour: +(m[4] || 0), minute: +(m[5] || 0), second: +(m[6] || 0),
    tzid, isUtc
  };
}

function wallClockToUtc(wc) {
  if (wc.isUtc || !wc.tzid) return new Date(Date.UTC(wc.year, wc.month - 1, wc.day, wc.hour, wc.minute, wc.second));
  return zonedTimeToUtc(wc.year, wc.month - 1, wc.day, wc.hour, wc.minute, wc.second, wc.tzid);
}

function zonedTimeToUtc(year, monthIdx, day, hour, minute, second, tzid) {
  const wallAsUtc = Date.UTC(year, monthIdx, day, hour, minute, second);
  let fmt;
  try {
    fmt = new Intl.DateTimeFormat('en-US', {
      timeZone: tzid,
      hourCycle: 'h23',
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', second: '2-digit'
    });
  } catch (e) {
    return new Date(wallAsUtc); // Unknown TZID — fall back to UTC.
  }
  // UTC offset of the zone at instant t (ms).
  const offsetAt = (t) => {
    const map = {};
    fmt.formatToParts(new Date(t)).forEach((p) => { map[p.type] = p.value; });
    return Date.UTC(+map.year, +map.month - 1, +map.day, +map.hour, +map.minute, +map.second) - t;
  };
  // Two passes, so times shortly after a DST switch use the right offset.
  const first = wallAsUtc - offsetAt(wallAsUtc);
  return new Date(wallAsUtc - offsetAt(first));
}

/* ─── Recurrence (RRULE) ─────────────────────────────────────────────
 * Supports what Google Calendar produces for meeting series:
 *   FREQ=WEEKLY  with INTERVAL, BYDAY, WKST, UNTIL, COUNT
 *   FREQ=MONTHLY with INTERVAL, BYDAY (e.g. 2TH, -1FR), BYMONTHDAY, BYSETPOS,
 *                UNTIL, COUNT
 * plus EXDATE (cancelled occurrences) and RECURRENCE-ID overrides
 * (single occurrences that were moved or edited). */

function parseRRule(prop) {
  if (!prop) return null;
  const rule = {};
  prop.value.split(';').forEach((part) => {
    const [k, v] = part.split('=');
    rule[k] = v;
  });
  return rule;
}

// Max days to walk (a safety bound only; COUNT rules walk from DTSTART).
const MAX_WALK_DAYS = 4000;

function parseByDay(rule, fallbackWeekday) {
  return (rule.BYDAY || WEEKDAYS[fallbackWeekday]).split(',').map((code) => {
    const m = /^([+-]?\d+)?([A-Z]{2})$/.exec(code.trim());
    return m ? { ord: m[1] ? parseInt(m[1], 10) : 0, wd: WEEKDAYS.indexOf(m[2]) } : null;
  }).filter(Boolean);
}

function daysInMonth(y, m) { return new Date(Date.UTC(y, m + 1, 0)).getUTCDate(); }

// Does this calendar day (UTC midnight of the wall-clock date) belong to the series?
function dayMatches(rule, day, start) {
  const d = new Date(day);
  const interval = rule.INTERVAL ? parseInt(rule.INTERVAL, 10) : 1;
  const weekday = d.getUTCDay();

  if (rule.FREQ === 'WEEKLY') {
    const wkst = WEEKDAYS.indexOf(rule.WKST || 'MO');
    const byday = parseByDay(rule, start.weekday).map((b) => b.wd);
    if (!byday.includes(weekday)) return false;
    const weekStart = (t, wd) => t - ((wd - wkst + 7) % 7) * DAY_MS;
    const weeks = Math.round((weekStart(day, weekday) - weekStart(start.day, start.weekday)) / (7 * DAY_MS));
    return weeks >= 0 && weeks % interval === 0;
  }

  if (rule.FREQ === 'MONTHLY') {
    const months = (d.getUTCFullYear() - start.year) * 12 + (d.getUTCMonth() - (start.month - 1));
    if (months < 0 || months % interval !== 0) return false;
    if (rule.BYSETPOS) {
      // e.g. BYDAY=TH;BYSETPOS=2 → the 2nd matching day of the month (-1 = last)
      const y = d.getUTCFullYear(), m = d.getUTCMonth();
      const matches = [];
      for (let i = 1; i <= daysInMonth(y, m); i++) {
        const t = Date.UTC(y, m, i);
        if (monthlyDayMatches(rule, t, start)) matches.push(t);
      }
      return rule.BYSETPOS.split(',').some((v) => {
        const n = parseInt(v, 10);
        return matches[n > 0 ? n - 1 : matches.length + n] === day;
      });
    }
    return monthlyDayMatches(rule, day, start);
  }

  return false;
}

// MONTHLY rule match for one day, ignoring INTERVAL and BYSETPOS.
function monthlyDayMatches(rule, day, start) {
  const d = new Date(day);
  const weekday = d.getUTCDay();
  const dom = d.getUTCDate();
  const dim = daysInMonth(d.getUTCFullYear(), d.getUTCMonth());
  if (rule.BYMONTHDAY) {
    return rule.BYMONTHDAY.split(',').some((v) => {
      const n = parseInt(v, 10);
      return n > 0 ? dom === n : dom === dim + n + 1;
    });
  }
  if (rule.BYDAY) {
    return parseByDay(rule, start.weekday).some((b) => {
      if (b.wd !== weekday) return false;
      if (b.ord === 0) return true;
      return b.ord > 0 ? Math.ceil(dom / 7) === b.ord : Math.ceil((dim - dom + 1) / 7) === -b.ord;
    });
  }
  return dom === start.dom;
}

// Start of the current or next occurrence (as a UTC Date) — i.e. the first one
// that hasn't ended by `notBefore`, so a call in progress still shows —
// skipping cancelled (EXDATE) and overridden (RECURRENCE-ID) occurrences.
// Returns null if none within the search window.
function nextOccurrence(dtstartProp, rule, notBefore, skip, durationMs) {
  const wc = parseWallClock(dtstartProp);
  if (!wc) return null;
  const startDay = Date.UTC(wc.year, wc.month - 1, wc.day);
  const start = { day: startDay, weekday: new Date(startDay).getUTCDay(), year: wc.year, month: wc.month, dom: wc.day };
  const until = rule.UNTIL ? parseDateValue({ value: rule.UNTIL, params: {} }) : null;
  const count = rule.COUNT ? parseInt(rule.COUNT, 10) : Infinity;
  const horizon = notBefore.getTime() + SEARCH_WINDOW_DAYS * DAY_MS;

  // Matching is computed relative to DTSTART, so without COUNT we can start
  // walking just before `notBefore` instead of from DTSTART.
  const today = Date.UTC(notBefore.getUTCFullYear(), notBefore.getUTCMonth(), notBefore.getUTCDate());
  const walkFrom = rule.COUNT ? startDay : Math.max(startDay, today - 2 * DAY_MS);

  let seen = 0;
  for (let i = 0; i <= MAX_WALK_DAYS; i++) {
    const day = walkFrom + i * DAY_MS;
    if (day > horizon) return null;
    if (!dayMatches(rule, day, start)) continue;
    seen++;
    if (seen > count) return null;

    // Keep DTSTART's wall-clock time-of-day, but resolve the UTC offset for
    // THIS date so DST transitions between occurrences are honoured.
    const cd = new Date(day);
    const occurrence = wallClockToUtc({
      year: cd.getUTCFullYear(), month: cd.getUTCMonth() + 1, day: cd.getUTCDate(),
      hour: wc.hour, minute: wc.minute, second: wc.second,
      tzid: wc.tzid, isUtc: wc.isUtc
    });
    if (until && occurrence > until) return null;
    if (skip.has(occurrence.getTime())) continue;
    if (occurrence.getTime() + (durationMs || 0) > notBefore.getTime()) return occurrence;
  }
  return null;
}

// All EXDATE values of an event, as UTC milliseconds.
function exdates(props) {
  const out = new Set();
  props.EXDATE.forEach((prop) => {
    prop.value.split(',').forEach((v) => {
      const d = parseDateValue({ value: v.trim(), params: prop.params });
      if (d) out.add(d.getTime());
    });
  });
  return out;
}

/* ─── Categorization ─────────────────────────────────────────────────── */

const VIDEO_DOMAIN = /(meet\.google\.com|zoom\.us|teams\.microsoft\.com|webex\.com|discord\.gg|discord\.com)/i;

// Meeting links (particularly Discord ones) are often wrapped in a Google
// Calendar click-tracking redirect — e.g. https://www.google.com/url?q=
// https://discord.gg/xyz&sa=D&... — so search for the bare known-domain
// pattern anywhere in the text and rebuild a clean link, rather than trusting
// whatever URL the text starts with.
const JOIN_LINK_PATTERNS = [
  /meet\.google\.com\/[a-z-]+/i,
  /zoom\.us\/j\/[\w?=-]+/i,
  /teams\.microsoft\.com\/[^\s"'<>&]+/i,
  /webex\.com\/[^\s"'<>&]+/i,
  /discord\.gg\/[A-Za-z0-9]+/i,
  /discord\.com\/invite\/[A-Za-z0-9]+/i
];

function extractJoinLink(text) {
  if (!text) return null;
  for (const pattern of JOIN_LINK_PATTERNS) {
    const m = pattern.exec(text);
    if (m) return 'https://' + m[0];
  }
  return null;
}

// LOCATION is sometimes a full URL, sometimes a bare "meet.google.com/xyz"
// with no protocol, sometimes absent entirely (link only lives in
// DESCRIPTION), and sometimes wrapped in a redirect. Normalize all cases
// into a clean, clickable join URL, or null.
function resolveJoinUrl(location, description) {
  if (location) {
    const l = location.trim();
    if (/^https?:\/\//i.test(l) && !VIDEO_DOMAIN.test(l)) return l; // full URL, not a known video domain we can clean up
    const fromLocation = extractJoinLink(l);
    if (fromLocation) return fromLocation;
  }
  return extractJoinLink(description);
}

// Absence of a recognized online link is NOT evidence of an in-person event
// (e.g. Discord-based calls have no LOCATION at all) — only a LOCATION that
// itself doesn't look like a link/video domain counts as a physical venue.
function locationLooksPhysical(location) {
  if (!location) return false;
  const l = location.trim();
  if (/^https?:\/\//i.test(l)) return false;
  if (VIDEO_DOMAIN.test(l)) return false;
  return true;
}

function categorize(title, location) {
  if (/community call/i.test(title)) return 'community';
  return locationLooksPhysical(location) ? 'in-person' : 'working-group';
}

// Occurrences that were moved/edited appear as separate VEVENTs carrying
// RECURRENCE-ID; the series must skip those slots. Map of UID → [UTC ms].
function overriddenOccurrences(vevents) {
  const overridden = new Map();
  vevents.forEach((p) => {
    if (!p['RECURRENCE-ID'] || !p.UID) return;
    const t = parseDateValue(p['RECURRENCE-ID']);
    if (!t) return;
    const list = overridden.get(p.UID.value) || [];
    list.push(t.getTime());
    overridden.set(p.UID.value, list);
  });
  return overridden;
}

/* ─── Main ────────────────────────────────────────────────────────────── */

function buildEvent(props, now, overridden) {
  const summaryProp = props.SUMMARY;
  const dtstartProp = props.DTSTART;
  if (!summaryProp || !dtstartProp) return null;
  if (props.STATUS && /CANCELLED/i.test(props.STATUS.value)) return null;

  const title = unescapeText(summaryProp.value);
  const dtstart = parseDateValue(dtstartProp);
  const dtend = parseDateValue(props.DTEND);
  const rrule = parseRRule(props.RRULE);
  const location = props.LOCATION ? unescapeText(props.LOCATION.value) : null;
  const description = props.DESCRIPTION ? unescapeText(props.DESCRIPTION.value) : '';

  const durationMs = dtend && dtstart ? dtend.getTime() - dtstart.getTime() : 60 * 60 * 1000;

  let start;
  const recurring = !!rrule;
  if (recurring) {
    if (rrule.FREQ !== 'WEEKLY' && rrule.FREQ !== 'MONTHLY') return null;
    const skip = exdates(props);
    (overridden.get(props.UID ? props.UID.value : '') || []).forEach((t) => skip.add(t));
    start = nextOccurrence(dtstartProp, rrule, now, skip, durationMs);
    if (!start) return null;
  } else {
    start = dtstart;
    const end = dtend || new Date(start.getTime() + durationMs);
    if (end.getTime() < now.getTime()) return null; // Fully in the past, not recurring.
  }

  const dialInMatch = /https?:\/\/tel\.meet\/[^\s"<]+/.exec(description);
  const joinUrl = resolveJoinUrl(location, description);
  const isOnline = !!joinUrl || !!dialInMatch;

  return {
    uid: props.UID ? props.UID.value : title,
    title,
    category: categorize(title, location),
    start: start.toISOString(),
    end: new Date(start.getTime() + durationMs).toISOString(),
    recurring,
    location: isOnline ? null : location,
    joinUrl,
    isOnline,
    dialInUrl: dialInMatch ? dialInMatch[0] : null
  };
}

exports.handler = async () => {
  try {
    const res = await fetch(ICS_URL);
    if (!res.ok) throw new Error('ICS fetch failed: ' + res.status);
    const ics = unfold(await res.text());
    const now = new Date();

    const vevents = extractVEvents(ics);
    const overridden = overriddenOccurrences(vevents);

    const events = vevents
      .map((props) => buildEvent(props, now, overridden))
      .filter(Boolean)
      .sort((a, b) => a.start.localeCompare(b.start));

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=600, s-maxage=600'
      },
      body: JSON.stringify({ generatedAt: now.toISOString(), events })
    };
  } catch (err) {
    return {
      statusCode: 502,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Could not load community events', detail: String(err) })
    };
  }
};

// Exposed for tests (tests/community-events.test.js).
exports._internal = { extractVEvents, unfold, buildEvent, overriddenOccurrences, zonedTimeToUtc };
