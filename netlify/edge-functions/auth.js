/**
 * OHS-SF Auth Gate — Netlify Edge Function
 *
 * Runs on every request before Netlify serves the static file.
 * Validates a signed session cookie; redirects to /lock.html if missing/expired.
 * POST /verify-pin validates the PIN server-side and sets the cookie.
 * The PIN never appears in any client-side code.
 *
 * Environment variables (set in Netlify dashboard → Site → Environment):
 *   CORRECT_PIN    — the access code
 *   SESSION_SECRET — random string used to sign tokens (min 32 chars)
 */

const COOKIE      = 'ohs_session';
const SESSION_MS  = 24 * 60 * 60 * 1000; // 24 hours

const PUBLIC_PATHS = new Set(['/lock.html', '/styles.css', '/favicon.svg']);

export default async function auth(request, context) {
  const url = new URL(request.url);

  // ── PIN verification ─────────────────────────────────────────────────────
  if (url.pathname === '/verify-pin' && request.method === 'POST') {
    return handleVerify(request, context);
  }

  // ── Auth check ───────────────────────────────────────────────────────────
  if (!PUBLIC_PATHS.has(url.pathname)) {
    const cookie = request.headers.get('Cookie') ?? '';
    const authed = await isValidSession(cookie, context.env.SESSION_SECRET);

    if (!authed) {
      const dest = new URL('/lock.html', url.origin);
      dest.searchParams.set('return', url.pathname + url.search);
      return Response.redirect(dest.toString(), 302);
    }
  }

  // ── Pass through to static file ──────────────────────────────────────────
  return context.next();
}

// ── Handlers ─────────────────────────────────────────────────────────────────

async function handleVerify(request, context) {
  let body;
  try { body = await request.json(); }
  catch { return jsonRes({ ok: false }, 400); }

  if (!body.pin || body.pin !== context.env.CORRECT_PIN) {
    return jsonRes({ ok: false }, 401);
  }

  const token = await makeToken(context.env.SESSION_SECRET);
  return jsonRes({ ok: true }, 200, {
    'Set-Cookie':
      `${COOKIE}=${token}; HttpOnly; Secure; SameSite=Strict; Max-Age=${SESSION_MS / 1000}; Path=/`
  });
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

function jsonRes(body, status, extraHeaders = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...extraHeaders }
  });
}
