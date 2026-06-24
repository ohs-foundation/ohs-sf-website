/**
 * OHS-SF Preview Gate — Cloudflare Worker
 *
 * Sits in front of GitHub Pages. Every request is checked for a valid
 * session cookie. If missing/expired, the user is redirected to /lock.html.
 * POST /verify-pin validates the PIN against an env secret and issues a
 * signed, HttpOnly session cookie — the PIN never appears in client code.
 *
 * Secrets (set via `wrangler secret put`):
 *   CORRECT_PIN    — the access code
 *   SESSION_SECRET — random string used to sign session tokens (min 32 chars)
 */

const ORIGIN      = 'https://ohs-foundation.github.io/ohs-sf-website';
const COOKIE      = 'ohs_session';
const SESSION_MS  = 24 * 60 * 60 * 1000; // 24 hours

// Paths served without auth (the login page + its direct dependencies)
const PUBLIC_PATHS = new Set(['/lock.html', '/styles.css', '/favicon.svg']);

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // ── PIN verification endpoint ────────────────────────────────────────────
    if (url.pathname === '/verify-pin' && request.method === 'POST') {
      return handleVerify(request, env);
    }

    // ── Auth check ───────────────────────────────────────────────────────────
    if (!PUBLIC_PATHS.has(url.pathname)) {
      const cookie = request.headers.get('Cookie') ?? '';
      const authed = await isValidSession(cookie, env.SESSION_SECRET);
      if (!authed) {
        const dest = new URL('/lock.html', url.origin);
        dest.searchParams.set('return', url.pathname + url.search);
        return Response.redirect(dest.toString(), 302);
      }
    }

    // ── Proxy to GitHub Pages ────────────────────────────────────────────────
    return proxyRequest(url);
  }
};

// ── Handlers ──────────────────────────────────────────────────────────────────

async function handleVerify(request, env) {
  let body;
  try { body = await request.json(); }
  catch { return jsonRes({ ok: false }, 400); }

  if (!body.pin || body.pin !== env.CORRECT_PIN) {
    return jsonRes({ ok: false }, 401);
  }

  const token = await makeToken(env.SESSION_SECRET);
  return jsonRes({ ok: true }, 200, {
    'Set-Cookie':
      `${COOKIE}=${token}; HttpOnly; Secure; SameSite=Strict; Max-Age=${SESSION_MS / 1000}; Path=/`
  });
}

async function proxyRequest(url) {
  const originUrl = ORIGIN + url.pathname + url.search;
  const res = await fetch(originUrl);
  const headers = new Headers(res.headers);
  // Remove headers that can interfere with framing / caching at the proxy layer
  headers.delete('x-frame-options');
  return new Response(res.body, { status: res.status, statusText: res.statusText, headers });
}

// ── Session helpers ───────────────────────────────────────────────────────────

async function isValidSession(cookieHeader, secret) {
  const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${COOKIE}=([^;]+)`));
  if (!match) return false;

  const [expStr, sig] = match[1].split('.');
  if (!expStr || !sig) return false;

  const exp = Number(expStr);
  if (isNaN(exp) || Date.now() > exp) return false;

  const expected = await hmacSign(expStr, secret);
  return timingSafeEqual(expected, sig);
}

async function makeToken(secret) {
  const exp = String(Date.now() + SESSION_MS);
  const sig = await hmacSign(exp, secret);
  return `${exp}.${sig}`;
}

async function hmacSign(message, secret) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw', enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false, ['sign']
  );
  const buf = await crypto.subtle.sign('HMAC', key, enc.encode(message));
  // Base64url encode
  return btoa(String.fromCharCode(...new Uint8Array(buf)))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

function timingSafeEqual(a, b) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

// ── Utilities ─────────────────────────────────────────────────────────────────

function jsonRes(body, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...extraHeaders }
  });
}
