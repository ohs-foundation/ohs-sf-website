// Regression tests for the KMP FHIR SDK blog post bundle and video shortcode.
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

test('KMP FHIR SDK blog bundle contains required media and clean prose', () => {
  const bundleDir = path.join(ROOT, 'content/blog/kmp-fhir-sdk-beta');
  for (const file of ['index.md', 'cover.jpg', 'card.jpg', 'kmp-multiplatform-demo.mp4', 'kmp-multiplatform-poster.jpg']) {
    const full = path.join(bundleDir, file);
    assert.ok(fs.existsSync(full), `Missing expected bundle asset ${file}`);
    assert.ok(fs.statSync(full).size > 0, `Asset ${file} is empty`);
  }
  const mp4Buf = fs.readFileSync(path.join(bundleDir, 'kmp-multiplatform-demo.mp4'));
  assert.ok(mp4Buf.includes(Buffer.from('mp4a')), 'Expected demo MP4 to include an AAC audio track');

  const md = fs.readFileSync(path.join(bundleDir, 'index.md'), 'utf8');
  assert.ok(!md.includes('—'), 'Post markdown should not contain em dashes');
  assert.match(md, /^draft:\s*false$/m, 'Staged PR branch must set draft: false so Netlify Deploy Preview renders it');
  for (const expected of [
    'One Codebase, Every Platform: Bringing Cross-Platform FHIR Development to Global Digital Health',
    'kotlin-fhir',
    'kotlin-fhirpath',
    'kotlin-fhir-engine',
    'kotlin-fhir-data-capture',
    'together with Agent Skills',
    'foreseeable future',
    'extendable admin portal and analytics dashboards that leverage FHIR Data Pipes',
    'OHS Player',
    'docs.ohs.foundation/fhir-foundations/',
    'docs.ohs.foundation/fhir-foundations/kmp-fhir-sdk/',
    'docs.ohs.foundation/ohs-player/',
    'kmp-multiplatform-demo.mp4',
  ]) {
    assert.ok(md.includes(expected), `Expected post markdown to reference ${expected}`);
  }
});

test('Hugo Netlify preview build renders kmp-fhir-sdk-beta with noindex and production build succeeds cleanly', (t) => {
  const hugoBin = findHugoBinary();
  if (!hugoBin) {
    t.skip('hugo binary not installed in this environment');
    return;
  }

  const previewDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ohs-kmp-preview-test-'));
  const prodDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ohs-kmp-prod-test-'));
  try {
    // 1. Netlify Deploy Preview build (--environment preview -b $DEPLOY_PRIME_URL).
    execFileSync(
      hugoBin,
      ['--gc', '--minify', '--environment', 'preview', '-b', 'https://deploy-preview-kmp--ohs-sf.netlify.app', '--destination', previewDir],
      { cwd: ROOT, stdio: 'pipe' }
    );

    const previewPostPath = path.join(previewDir, 'blog/kmp-fhir-sdk-beta.html');
    assert.ok(fs.existsSync(previewPostPath), 'Expected rendered blog/kmp-fhir-sdk-beta.html in Netlify preview build');
    const previewHtml = fs.readFileSync(previewPostPath, 'utf8');

    assert.ok(previewHtml.includes('One Codebase, Every Platform: Bringing Cross-Platform FHIR Development to Global Digital Health'));
    assert.match(previewHtml, /<meta\s+name="?robots"?\s+content="?noindex"?/);
    assert.match(previewHtml, /<video[^>]*\bautoplay\b[^>]*\bmuted\b[^>]*\bloop\b[^>]*\bplaysinline\b/);
    assert.match(previewHtml, /src="?\/blog\/kmp-fhir-sdk-beta\/kmp-multiplatform-demo\.mp4"?/);
    assert.match(previewHtml, /poster="?\/blog\/kmp-fhir-sdk-beta\/kmp-multiplatform-poster\.jpg"?/);
    assert.ok(fs.existsSync(path.join(previewDir, 'blog/kmp-fhir-sdk-beta/kmp-multiplatform-demo.mp4')));

    const blogIndexHtml = fs.readFileSync(path.join(previewDir, 'blog.html'), 'utf8');
    assert.ok(blogIndexHtml.includes('/blog/kmp-fhir-sdk-beta.html'));
    assert.ok(blogIndexHtml.includes('One Codebase, Every Platform: Bringing Cross-Platform FHIR Development to Global Digital Health'));

    const homeHtml = fs.readFileSync(path.join(previewDir, 'index.html'), 'utf8');
    assert.ok(homeHtml.includes('/blog/kmp-fhir-sdk-beta.html'));
    assert.ok(homeHtml.includes('KMP FHIR SDK: cross-platform FHIR development for global digital health'));

    const robotsTxt = fs.readFileSync(path.join(previewDir, 'robots.txt'), 'utf8');
    assert.ok(robotsTxt.includes('Disallow: /'), 'Expected preview robots.txt to disallow general indexing');

    // 2. Standard production build (used once merged to main) renders cleanly without noindex.
    execFileSync(hugoBin, ['--gc', '--minify', '--destination', prodDir], {
      cwd: ROOT,
      stdio: 'pipe',
    });
    const prodPostPath = path.join(prodDir, 'blog/kmp-fhir-sdk-beta.html');
    assert.ok(fs.existsSync(prodPostPath), 'Expected rendered blog/kmp-fhir-sdk-beta.html in production build');
    const prodHtml = fs.readFileSync(prodPostPath, 'utf8');
    assert.doesNotMatch(prodHtml, /<meta\s+name="?robots"?\s+content="?noindex"?/);
  } finally {
    fs.rmSync(previewDir, { recursive: true, force: true });
    fs.rmSync(prodDir, { recursive: true, force: true });
  }
});
