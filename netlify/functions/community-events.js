/* Fetches the public OHS-SF community ICS feed, resolves each event's next
 * upcoming occurrence (recurring events included), and returns a small
 * categorized JSON payload for community.html to render. Runs server-side
 * because Google's ICS endpoint sends no CORS headers. */

const ICS_URL =
  'https://calendar.google.com/calendar/ical/c_8fa26c30a3127c46beb1ec99fbae3fecd895dc436e6a998d3068f75855e5218b%40group.calendar.google.com/public/basic.ics';

const WEEKDAYS = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];
const DAY_MS = 24 * 60 * 60 * 1000;
const SEARCH_WINDOW_DAYS = 60;

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
    if (eq !== -1) params[p.slice(0, eq)] = p.slice(eq + 1);
  });
  return { name: name.toUpperCase(), params, value };
}

function parseVEvent(block) {
  const ev = { props: {} };
  block.split('\n').forEach((line) => {
    if (!line.trim()) return;
    const prop = parseProperty(line);
    if (!prop) return;
    // First occurrence wins for repeated keys (DESCRIPTION only appears once anyway).
    if (!(prop.name in ev.props)) ev.props[prop.name] = prop;
  });
  return ev.props;
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
  const utcGuess = Date.UTC(year, monthIdx, day, hour, minute, second);
  let parts;
  try {
    parts = new Intl.DateTimeFormat('en-US', {
      timeZone: tzid,
      hourCycle: 'h23',
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', second: '2-digit'
    }).formatToParts(new Date(utcGuess));
  } catch (e) {
    return new Date(utcGuess); // Unknown TZID — fall back to UTC.
  }
  const map = {};
  parts.forEach((p) => { map[p.type] = p.value; });
  const asIfUtc = Date.UTC(+map.year, +map.month - 1, +map.day, +map.hour, +map.minute, +map.second);
  const offset = asIfUtc - utcGuess;
  return new Date(utcGuess - offset);
}

function dateOnlyUtc(d) {
  return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
}

/* ─── RRULE (FREQ=WEEKLY only — the only frequency this calendar uses) ── */

function parseRRule(prop) {
  if (!prop) return null;
  const rule = {};
  prop.value.split(';').forEach((part) => {
    const [k, v] = part.split('=');
    rule[k] = v;
  });
  return rule;
}

function nextWeeklyOccurrence(dtstartProp, rule, notBefore) {
  const wc = parseWallClock(dtstartProp);
  if (!wc) return null;

  const interval = rule.INTERVAL ? parseInt(rule.INTERVAL, 10) : 1;
  const wkst = WEEKDAYS.indexOf(rule.WKST || 'MO');
  const dtstartDay = Date.UTC(wc.year, wc.month - 1, wc.day); // date-only anchor from DTSTART's own wall-clock date
  const dtstartWeekday = new Date(dtstartDay).getUTCDay();
  const byday = (rule.BYDAY || WEEKDAYS[dtstartWeekday])
    .split(',')
    .map((code) => WEEKDAYS.indexOf(code.replace(/^[+-]?\d+/, '')));

  const until = rule.UNTIL ? parseDateValue({ value: rule.UNTIL, params: {} }) : null;
  const dtstartWeekStart = dtstartDay - (((dtstartWeekday - wkst + 7) % 7)) * DAY_MS;

  const searchStart = Math.max(dtstartDay, dateOnlyUtc(notBefore));
  for (let offset = 0; offset <= SEARCH_WINDOW_DAYS; offset++) {
    const candidateDay = searchStart + offset * DAY_MS;
    if (candidateDay < dtstartDay) continue;
    const weekday = new Date(candidateDay).getUTCDay();
    if (!byday.includes(weekday)) continue;
    const candidateWeekStart = candidateDay - (((weekday - wkst + 7) % 7)) * DAY_MS;
    const weeksSince = Math.round((candidateWeekStart - dtstartWeekStart) / (7 * DAY_MS));
    if (weeksSince < 0 || weeksSince % interval !== 0) continue;

    // Keep DTSTART's wall-clock time-of-day, but re-resolve the UTC offset
    // for THIS candidate date so DST transitions between occurrences are honored.
    const cd = new Date(candidateDay);
    const occurrence = wallClockToUtc({
      year: cd.getUTCFullYear(), month: cd.getUTCMonth() + 1, day: cd.getUTCDate(),
      hour: wc.hour, minute: wc.minute, second: wc.second,
      tzid: wc.tzid, isUtc: wc.isUtc
    });
    if (until && occurrence > until) return null;
    if (occurrence.getTime() >= notBefore.getTime()) return occurrence;
  }
  return null;
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

/* ─── Main ────────────────────────────────────────────────────────────── */

function buildEvent(props, now) {
  const summaryProp = props.SUMMARY;
  const dtstartProp = props.DTSTART;
  if (!summaryProp || !dtstartProp) return null;

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
    if (rrule.FREQ !== 'WEEKLY') return null; // Only weekly/biweekly rules appear on this calendar.
    start = nextWeeklyOccurrence(dtstartProp, rrule, now);
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

    const events = extractVEvents(ics)
      .map((props) => buildEvent(props, now))
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
