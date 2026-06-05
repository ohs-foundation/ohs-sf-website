# PIN Lock — Design Spec

## Goal

Protect all four pages of the OHS-SF site with a PIN code gate. The site is publicly hosted on GitHub Pages but access is restricted to people who have been given the PIN. Once entered correctly, the PIN is remembered for 30 days.

## Security model

Client-side only — the PIN is visible in the page source. This is intentional: the purpose is pre-launch access control, not cryptographic security. Anyone with the PIN (or who reads the source) can access the site. This is acceptable for the use case.

---

## Architecture

Two pieces:

1. **Inline auth guard** — added to the `<head>` of all four pages. Runs synchronously before the browser paints anything. Checks `localStorage` for a valid token; if absent or expired, redirects to `lock.html`.

2. **`lock.html`** — a standalone PIN entry page. Styled with the existing `styles.css` design tokens. On correct PIN entry, writes the auth token to `localStorage` and redirects to the originally requested page (or `index.html` if no return URL).

---

## Auth token

Stored in `localStorage` under the key `ohs_auth`.

```json
{ "exp": 1749254400000 }
```

- `exp` — Unix timestamp in milliseconds. Set to `Date.now() + 30 * 24 * 60 * 60 * 1000` on successful auth.
- Presence + valid `exp > Date.now()` = authenticated.
- Absent, unparseable, or expired = unauthenticated → redirect.

---

## Inline auth guard

Added to each of the four HTML pages (`index.html`, `foundation.html`, `projects.html`, `community.html`) as the **first `<script>` tag in `<head>`**, immediately after the `<meta charset>` tag and before any stylesheets or other resources load.

```html
<script>
(function(){
  var a = localStorage.getItem('ohs_auth');
  if (a) { try { if (Date.now() < JSON.parse(a).exp) return; } catch(e){} }
  window.location.replace('lock.html?return=' + encodeURIComponent(location.href));
})();
</script>
```

Placement rationale: synchronous inline scripts in `<head>` block parsing, so the page is never rendered before the check runs. No flash of content.

`lock.html` itself does **not** include this guard (it must always be reachable).

---

## `lock.html`

A standalone page. Uses `styles.css` for design tokens and base styles. No additional stylesheet.

### Layout

Full-viewport-height centered card. Elements from top to bottom:

1. OHS logo mark (`.logo-mark` CSS component, same as site header)
2. Eyebrow label: `PRIVATE PREVIEW` (IBM Plex Mono, `--teal-deep`)
3. Heading: `Enter access code` (Hanken Grotesk, weight 700)
4. PIN input — `type="password"`, `inputmode="numeric"`, `maxlength="10"`, centered, large font
5. Submit button — `.btn.btn-primary`, full-width
6. Error message area — hidden by default, shown on wrong PIN

### PIN constant

```js
var CORRECT_PIN = '797283';
```

Single constant at the top of the inline script. Easy to locate and change.

### Behavior

**On submit:**
- Trim whitespace from input value
- Compare to `CORRECT_PIN`
- **Correct:** write `ohs_auth` to `localStorage` with 30-day expiry → redirect to sanitized return URL
- **Wrong:** clear input, refocus, show error message (`"Incorrect code — try again"`), apply `.shake` CSS animation to the card

**Return URL handling:**
- Read `?return=` query parameter
- Validate: must be same origin (`location.origin`). If it fails validation or is absent, fall back to `index.html`
- Redirect via `window.location.replace(returnUrl)` so the lock page is not left in the browser's history stack.

**Keyboard:** form submits on Enter (standard `<form>` submit event).

### Shake animation

```css
@keyframes shake {
  0%,100% { transform: translateX(0); }
  20%,60% { transform: translateX(-8px); }
  40%,80% { transform: translateX(8px); }
}
.shake { animation: shake 0.35s ease; }
```

Applied to the card element on wrong PIN. Removed via `animationend` listener so it can retrigger on subsequent wrong attempts.

---

## Files changed

| Action | File | What changes |
|---|---|---|
| Modify | `index.html` | Add inline guard script as first `<script>` in `<head>` |
| Modify | `foundation.html` | Same |
| Modify | `projects.html` | Same |
| Modify | `community.html` | Same |
| Create | `lock.html` | Full PIN entry page |

No changes to `styles.css`, `app.js`, or the GitHub Actions workflow.

---

## Out of scope

- Server-side auth (not available on static Pages)
- Hashing the PIN (adds complexity without real security benefit given client-side model)
- "Forgot PIN" / reset flow
- Per-user codes or audit logging
- Removing the gate later (manual: delete the guard scripts and `lock.html`)
