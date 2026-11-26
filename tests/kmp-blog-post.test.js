// Regression tests for the KMP FHIR SDK Beta blog post bundle and video shortcode.
// Run from the repo root with:  node --test
const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const ROOT = path.resolve(__dirname, '..');

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

test('KMP FHIR SDK beta blog bundle contains required media and clean prose', () => {
  const bundleDir = path.join(ROOT, 'content/blog/kmp-fhir-sdk-beta');
  for (const file of ['index.md', 'cover.jpg', 'card.jpg', 'kmp-multiplatform-demo.mp4', 'kmp-multiplatform-poster.jpg']) {
    const full = path.join(bundleDir, file);
    assert.ok(fs.existsSync(full), `Missing expected bundle asset ${file}`);
    assert.ok(fs.statSync(full).size > 0, `Asset ${file} is empty`);
  }

  const md = fs.readFileSync(path.join(bundleDir, 'index.md'), 'utf8');
  assert.ok(!md.includes('—'), 'Post markdown should not contain em dashes');
  for (const expected of [
    'kotlin-fhir',
    'kotlin-fhirpath',
    'kotlin-fhir-engine',
    'kotlin-fhir-data-capture',
    'OHS Player',
    'docs.ohs.foundation/fhir-foundations/',
    'docs.ohs.foundation/ohs-player/',
    'kmp-multiplatform-demo.mp4',
  ]) {
    assert.ok(md.includes(expected), `Expected post markdown to reference ${expected}`);
  }
});

test('Hugo keeps kmp-fhir-sdk-beta draft off production builds and renders full post with --buildDrafts', (t) => {
  const hugoBin = findHugoBinary();
  if (!hugoBin) {
    t.skip('hugo binary not installed in this environment');
    return;
  }

  const prodDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ohs-kmp-prod-test-'));
  const draftDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ohs-kmp-draft-test-'));
  try {
    // Production build must NOT publish the draft post yet.
    execFileSync(hugoBin, ['--gc', '--minify', '--destination', prodDir], {
      cwd: ROOT,
      stdio: 'pipe',
    });
    assert.ok(
      !fs.existsSync(path.join(prodDir, 'blog/kmp-fhir-sdk-beta.html')),
      'Draft post must remain excluded from production build until approved'
    );

    // Draft preview build (-D / --buildDrafts) must render the complete article and video animation.
    execFileSync(hugoBin, ['--gc', '--minify', '--buildDrafts', '--destination', draftDir], {
      cwd: ROOT,
      stdio: 'pipe',
    });

    const postHtmlPath = path.join(draftDir, 'blog/kmp-fhir-sdk-beta.html');
    assert.ok(fs.existsSync(postHtmlPath), 'Expected rendered blog/kmp-fhir-sdk-beta.html with --buildDrafts');
    const postHtml = fs.readFileSync(postHtmlPath, 'utf8');

    assert.ok(postHtml.includes('One Codebase, Three Platforms: The KMP FHIR SDK Enters Beta'));
    assert.match(postHtml, /<video[^>]*\bautoplay\b[^>]*\bmuted\b[^>]*\bloop\b[^>]*\bplaysinline\b/);
    assert.match(postHtml, /src="?\/blog\/kmp-fhir-sdk-beta\/kmp-multiplatform-demo\.mp4"?/);
    assert.match(postHtml, /poster="?\/blog\/kmp-fhir-sdk-beta\/kmp-multiplatform-poster\.jpg"?/);
    assert.ok(fs.existsSync(path.join(draftDir, 'blog/kmp-fhir-sdk-beta/kmp-multiplatform-demo.mp4')));

    const blogIndexHtml = fs.readFileSync(path.join(draftDir, 'blog.html'), 'utf8');
    assert.ok(blogIndexHtml.includes('/blog/kmp-fhir-sdk-beta.html'));
    assert.ok(blogIndexHtml.includes('One Codebase, Three Platforms: The KMP FHIR SDK Enters Beta'));

    const homeHtml = fs.readFileSync(path.join(draftDir, 'index.html'), 'utf8');
    assert.ok(homeHtml.includes('/blog/kmp-fhir-sdk-beta.html'));
    assert.ok(homeHtml.includes('New release: the KMP FHIR SDK enters Beta'));
  } finally {
    fs.rmSync(prodDir, { recursive: true, force: true });
    fs.rmSync(draftDir, { recursive: true, force: true });
  }
});
