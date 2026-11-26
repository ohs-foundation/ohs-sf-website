// Regression tests for Foundation membership copy, tier schemas, and Hugo build output.
// Run from the repo root with:  node --test
const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const ROOT = path.resolve(__dirname, '..');

function readRepoFile(relPath) {
  return fs.readFileSync(path.join(ROOT, relPath), 'utf8');
}

function parseMembersYaml(yamlText) {
  const tiers = [];
  const members = [];
  let section = null;
  for (const rawLine of yamlText.split(/\r?\n/)) {
    const line = rawLine.replace(/#.*$/, '').trimEnd();
    if (!line.trim()) continue;
    if (/^tiers:\s*$/.test(line)) {
      section = 'tiers';
      continue;
    }
    if (/^members:\s*(\[\])?\s*$/.test(line)) {
      section = 'members';
      continue;
    }
    if (section === 'tiers') {
      const idMatch = line.match(/^\s*-\s*id:\s*(\S+)/);
      if (idMatch) tiers.push(idMatch[1]);
    } else if (section === 'members') {
      const tierMatch = line.match(/^\s*tier:\s*(\S+)/);
      if (tierMatch) members.push(tierMatch[1]);
    }
  }
  return { tiers, members };
}

function findHugoBinary() {
  const candidates = [
    path.join(os.homedir(), '.local', 'bin', 'hugo'),
    'hugo',
  ];
  for (const bin of candidates) {
    try {
      execFileSync(bin, ['version'], { stdio: 'ignore' });
      return bin;
    } catch {
      // Try next candidate.
    }
  }
  return null;
}

test('members.md membership section preserves approved tiers, copy guardrails, and CTAs', () => {
  const content = readRepoFile('content/members.md');
  const expectedTiers = [
    'name: Premier',
    'name: General',
    'name: Associate',
    'name: Implementer',
    'name: Sponsorships & grants',
  ];
  for (const tier of expectedTiers) {
    assert.ok(content.includes(tier), `Expected ${tier} in content/members.md`);
  }

  assert.ok(content.includes('joinButton: Join now'), 'Expected joinButton: Join now');
  assert.ok(content.includes('contactButton: Get in touch'), 'Expected contactButton: Get in touch');

  const retiredSnippets = [
    'name: Gold',
    'name: Inclusive',
    'up to three total',
    'stand for election to the Governing Board (one seat available)',
    'LMIC for-profits under 100 employees',
    'foundations work',
  ];
  for (const snippet of retiredSnippets) {
    assert.ok(!content.includes(snippet), `Unexpected stale snippet "${snippet}" in content/members.md`);
  }
});

test('data/members.yaml and data/members_demo.yaml share the same tier IDs', () => {
  const expectedTierIds = ['premier_strategic', 'general_associate', 'supporters', 'advisory_support'];

  const live = parseMembersYaml(readRepoFile('data/members.yaml'));
  assert.deepStrictEqual(live.tiers, expectedTierIds);
  assert.ok(live.members.length > 0, 'data/members.yaml should list the members and supporters');
  for (const memberTier of live.members) {
    assert.ok(live.tiers.includes(memberTier), `Member references unknown tier "${memberTier}"`);
  }

  const demo = parseMembersYaml(readRepoFile('data/members_demo.yaml'));
  assert.deepStrictEqual(demo.tiers, expectedTierIds);
  assert.ok(demo.members.length > 0, 'data/members_demo.yaml should retain sample members');
  for (const memberTier of demo.members) {
    assert.ok(demo.tiers.includes(memberTier), `Demo member references unknown tier "${memberTier}"`);
  }
});

test('Hugo renders members.html with all membership tiers and both CTAs intact', (t) => {
  const hugoBin = findHugoBinary();
  if (!hugoBin) {
    t.skip('hugo binary not installed in this environment');
    return;
  }

  const outDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ohs-website-test-'));
  try {
    execFileSync(hugoBin, ['--gc', '--minify', '--destination', outDir], {
      cwd: ROOT,
      stdio: 'pipe',
    });
    const html = fs.readFileSync(path.join(outDir, 'members.html'), 'utf8');

    for (const heading of ['Premier', 'General', 'Associate', 'Implementer']) {
      assert.ok(html.includes(`<h3>${heading}</h3>`), `Expected rendered <h3>${heading}</h3>`);
    }
    assert.match(html, /<h3>Sponsorships (?:&|&amp;) grants<\/h3>/, 'Expected rendered Sponsorships & grants heading');
    assert.ok(!html.includes('<h3>Gold</h3>'), 'Stale <h3>Gold</h3> rendered in members.html');
    assert.ok(!html.includes('<h3>Inclusive</h3>'), 'Stale <h3>Inclusive</h3> rendered in members.html');

    assert.match(html, /href="?https:\/\/enrollment\.lfx\.linuxfoundation\.org\/\?project=open-health-stack-foundation"?[^>]*>Join now\b/);
    assert.match(html, /href="?mailto:membership@ohs\.foundation"?[^>]*>Get in touch<\/a>/);
  } finally {
    fs.rmSync(outDir, { recursive: true, force: true });
  }
});
