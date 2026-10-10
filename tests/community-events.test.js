// Tests for the community-events Netlify function's ICS handling.
// Run with:  node --test tests/
const test = require('node:test');
const assert = require('node:assert');
const { _internal: ev } = require('../netlify/functions/community-events.js');

function ics(...events) {
  return ev.unfold(['BEGIN:VCALENDAR', ...events.flatMap((e) => ['BEGIN:VEVENT', ...e, 'END:VEVENT']), 'END:VCALENDAR'].join('\r\n'));
}
function run(icsText, nowIso) {
  const now = new Date(nowIso);
  const vevents = ev.extractVEvents(icsText);
  const overridden = new Map();
  vevents.forEach((p) => {
    if (!p['RECURRENCE-ID']) return;
    const t = new Date(p['RECURRENCE-ID'].value.replace(/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z$/, '$1-$2-$3T$4:$5:$6Z'));
    overridden.set(p.UID.value, [...(overridden.get(p.UID.value) || []), t.getTime()]);
  });
  return vevents.map((p) => ev.buildEvent(p, now, overridden)).filter(Boolean).sort((a, b) => a.start.localeCompare(b.start));
}

test('weekly series returns the next occurrence', () => {
  const out = run(ics(['UID:w1', 'SUMMARY:OHS Developers Call', 'DTSTART;TZID=Europe/London:20260105T150000', 'DTEND;TZID=Europe/London:20260105T160000', 'RRULE:FREQ=WEEKLY;BYDAY=MO']), '2026-10-07T00:00:00Z');
  assert.strictEqual(out.length, 1);
  assert.strictEqual(out[0].start, '2026-10-12T14:00:00.000Z'); // BST (UTC+1)
  assert.strictEqual(out[0].category, 'working-group');
});

test('weekly series honours DST changes', () => {
  const out = run(ics(['UID:w2', 'SUMMARY:Sprint', 'DTSTART;TZID=Europe/London:20260105T150000', 'RRULE:FREQ=WEEKLY;BYDAY=MO']), '2026-10-27T00:00:00Z');
  assert.strictEqual(out[0].start, '2026-11-02T15:00:00.000Z'); // back on GMT
});

test('biweekly series respects INTERVAL', () => {
  const out = run(ics(['UID:b1', 'SUMMARY:Biweekly', 'DTSTART:20260105T100000Z', 'RRULE:FREQ=WEEKLY;INTERVAL=2;BYDAY=MO']), '2026-01-06T00:00:00Z');
  assert.strictEqual(out[0].start, '2026-01-19T10:00:00.000Z');
});

test('monthly by ordinal weekday (last Thursday) is supported', () => {
  const out = run(ics(['UID:m1', 'SUMMARY:Open Health Stack Community Call', 'DTSTART:20260129T150000Z', 'RRULE:FREQ=MONTHLY;BYDAY=-1TH']), '2026-10-01T00:00:00Z');
  assert.strictEqual(out[0].start, '2026-10-29T15:00:00.000Z');
  assert.strictEqual(out[0].category, 'community');
});

test('monthly by nth weekday (2nd Tuesday) and by month day', () => {
  const a = run(ics(['UID:m2', 'SUMMARY:A', 'DTSTART:20260113T090000Z', 'RRULE:FREQ=MONTHLY;BYDAY=2TU']), '2026-10-01T00:00:00Z');
  assert.strictEqual(a[0].start, '2026-10-13T09:00:00.000Z');
  const b = run(ics(['UID:m3', 'SUMMARY:B', 'DTSTART:20260115T090000Z', 'RRULE:FREQ=MONTHLY']), '2026-10-16T00:00:00Z');
  assert.strictEqual(b[0].start, '2026-11-15T09:00:00.000Z');
});

test('cancelled occurrences (EXDATE) are skipped', () => {
  const out = run(ics(['UID:x1', 'SUMMARY:Call', 'DTSTART:20260105T100000Z', 'RRULE:FREQ=WEEKLY;BYDAY=MO', 'EXDATE:20261012T100000Z']), '2026-10-07T00:00:00Z');
  assert.strictEqual(out[0].start, '2026-10-19T10:00:00.000Z');
});

test('moved occurrence (RECURRENCE-ID) replaces the series slot', () => {
  const out = run(ics(
    ['UID:r1', 'SUMMARY:Call', 'DTSTART:20260105T100000Z', 'RRULE:FREQ=WEEKLY;BYDAY=MO'],
    ['UID:r1', 'SUMMARY:Call (moved)', 'RECURRENCE-ID:20261012T100000Z', 'DTSTART:20261013T120000Z', 'DTEND:20261013T130000Z']
  ), '2026-10-07T00:00:00Z');
  assert.deepStrictEqual(out.map((e) => e.start), ['2026-10-13T12:00:00.000Z', '2026-10-19T10:00:00.000Z']);
});

test('UNTIL and COUNT end a series; cancelled and past one-offs are dropped', () => {
  const out = run(ics(
    ['UID:u1', 'SUMMARY:Ended', 'DTSTART:20260105T100000Z', 'RRULE:FREQ=WEEKLY;BYDAY=MO;UNTIL=20260301T000000Z'],
    ['UID:c1', 'SUMMARY:Counted', 'DTSTART:20260105T100000Z', 'RRULE:FREQ=WEEKLY;COUNT=3'],
    ['UID:p1', 'SUMMARY:Past', 'DTSTART:20260101T100000Z', 'DTEND:20260101T110000Z'],
    ['UID:k1', 'SUMMARY:Cancelled', 'STATUS:CANCELLED', 'DTSTART:20261201T100000Z']
  ), '2026-10-07T00:00:00Z');
  assert.strictEqual(out.length, 0);
});

test('physical LOCATION marks an in-person event; meet links are cleaned', () => {
  const out = run(ics(
    ['UID:i1', 'SUMMARY:Meetup', 'DTSTART:20261203T090000Z', 'LOCATION:Bangkok\\, Thailand'],
    ['UID:o1', 'SUMMARY:Online', 'DTSTART:20261203T090000Z', 'DESCRIPTION:Join https://www.google.com/url?q=https://meet.google.com/abc-defg-hij&sa=D']
  ), '2026-10-07T00:00:00Z');
  const byTitle = Object.fromEntries(out.map((e) => [e.title, e]));
  assert.strictEqual(byTitle.Meetup.category, 'in-person');
  assert.strictEqual(byTitle.Meetup.location, 'Bangkok, Thailand');
  assert.strictEqual(byTitle.Online.joinUrl, 'https://meet.google.com/abc-defg-hij');
});
