// Checks for the Members page (/members.html) and its data in data/members.yaml.
// Run from the repo root with:  node --test
const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const ROOT = path.resolve(__dirname, '..');

// Reads the members list from data/members.yaml. The file only uses simple
// "key: value" lines, so a small parser is enough (no YAML dependency needed).
function readMembers(relPath = 'data/members.yaml') {
  const text = fs.readFileSync(path.join(ROOT, relPath), 'utf8');
  const tiers = [];
  const members = [];
  let section = null;
  let current = null;
  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.replace(/\s+#.*$/, '').replace(/^#.*$/, '').trimEnd();
    if (!line.trim()) continue;
    if (/^tiers:\s*$/.test(line)) { section = 'tiers'; continue; }
    if (/^members:\s*(\[\])?\s*$/.test(line)) { section = 'members'; continue; }
    const m = line.match(/^\s*(-\s+)?(\w+):\s*(.*)$/);
    if (!m) continue;
    const [, dash, key, value] = m;
    if (section === 'tiers' && key === 'id') tiers.push(value);
    if (section === 'members') {
      if (dash) { current = {}; members.push(current); }
      if (current) current[key] = value;
    }
  }
  return { tiers, members };
}

function findHugoBinary() {
  for (const bin of [path.join(os.homedir(), '.local', 'bin', 'hugo'), 'hugo']) {
    try {
      execFileSync(bin, ['version'], { stdio: 'ignore' });
      return bin;
    } catch {
      // Try next candidate.
    }
  }
  return null;
}

// Builds the site into a temporary folder and returns the given pages' HTML.
function build(hugoBin, environment, pages) {
  const outDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ohs-members-test-'));
  try {
    execFileSync(hugoBin, ['--gc', '--minify', '--environment', environment, '--destination', outDir], {
      cwd: ROOT,
      stdio: 'pipe',
    });
    return Object.fromEntries(pages.map((p) => [p, fs.readFileSync(path.join(outDir, p), 'utf8')]));
  } finally {
    fs.rmSync(outDir, { recursive: true, force: true });
  }
}

// Cards show the logo only; the organisation's name is the logo's alt text.
const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const shownName = (html, name) => new RegExp(`alt="?${escapeRe(name)}"?[ />]`).test(html);

test('every member has a name, a known tier, an https link and a logo file that exists', () => {
  const { tiers, members } = readMembers();
  assert.ok(members.length > 0);
  const names = new Set();
  for (const m of members) {
    assert.ok(m.name, 'Member without a name');
    assert.ok(!names.has(m.name), `"${m.name}" is listed twice`);
    names.add(m.name);
    assert.ok(tiers.includes(m.tier), `"${m.name}" has unknown tier "${m.tier}"`);
    if (m.url) assert.match(m.url, /^https:\/\//, `"${m.name}" link should start with https://`);
    for (const key of ['logo', 'logoDark']) {
      if (m[key]) assert.ok(fs.existsSync(path.join(ROOT, 'assets/members', m[key])), `${key} for "${m.name}" not found: assets/members/${m[key]}`);
    }
    if (m.logoDark) assert.ok(m.logo, `"${m.name}" has a logoDark but no logo`);
    if (m.pending !== undefined) assert.strictEqual(m.pending, 'true', `"${m.name}": pending should be true or removed`);
  }
});

test('member list keeps the agreed placements', () => {
  const { members } = readMembers();
  const byName = Object.fromEntries(members.map((m) => [m.name, m]));
  assert.ok(!members.some((m) => /\bOna\b/i.test(m.name)), 'Ona must not be listed (Recode Labs replaces it)');
  assert.ok(byName['Recode Labs'], 'Recode Labs should be listed');
  assert.strictEqual(byName.Microsoft?.tier, 'supporters', 'Microsoft belongs under supporting organisations');
});

test('demo members use the same tiers as the live list', () => {
  const live = readMembers();
  const demo = readMembers('data/members_demo.yaml');
  assert.deepStrictEqual(demo.tiers, live.tiers);
  for (const m of demo.members) {
    assert.ok(demo.tiers.includes(m.tier), `Demo member "${m.name}" has unknown tier "${m.tier}"`);
  }
});

test('live site shows approved members only; previews show everyone', (t) => {
  const hugoBin = findHugoBinary();
  if (!hugoBin) {
    t.skip('hugo binary not installed in this environment');
    return;
  }
  const { members } = readMembers();
  const pending = members.filter((m) => m.pending === 'true');
  const approved = members.filter((m) => m.pending !== 'true');

  const prod = build(hugoBin, 'production', ['members.html', 'index.html']);
  for (const m of approved) assert.ok(shownName(prod['members.html'], m.name), `"${m.name}" missing from members.html`);
  for (const m of pending) {
    assert.ok(!shownName(prod['members.html'], m.name), `Pending "${m.name}" must not appear on the live members page`);
    assert.ok(!shownName(prod['index.html'], m.name), `Pending "${m.name}" must not appear on the live home page`);
  }
  assert.match(prod['members.html'], /id="?membership"?/, 'Membership options should be on the Members page');

  const preview = build(hugoBin, 'preview', ['members.html']);
  for (const m of members) assert.ok(shownName(preview['members.html'], m.name), `"${m.name}" missing from preview members.html`);
});

test('membership links point at the Members page', () => {
  const files = ['hugo.yaml', ...fs.readdirSync(path.join(ROOT, 'content')).filter((f) => f.endsWith('.md')).map((f) => `content/${f}`), 'content/blog/_index.md'];
  for (const f of files) {
    const text = fs.readFileSync(path.join(ROOT, f), 'utf8');
    assert.ok(!text.includes('/foundation.html#membership'), `${f} still links to /foundation.html#membership (now /members.html#membership)`);
  }
  const footer = fs.readFileSync(path.join(ROOT, 'hugo.yaml'), 'utf8').split('footerFoundation:')[1].split(/\n\s*footer\w+:/)[0];
  const names = [...footer.matchAll(/name:\s*([^,]+?),/g)].map((m) => m[1].trim());
  assert.deepStrictEqual(names, ['Mission & charter', 'Governance', 'Members', 'Become a member']);
});
