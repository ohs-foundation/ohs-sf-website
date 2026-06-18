# Handoff: Foundation Page (`foundation.html`)

## Overview
The Foundation page tells the story of the Open Health Stack Software Foundation (OHS-SF): its mission, charter, governance, the rationale for the model, and the membership pathways. It is a single long-scroll marketing/informational page with a sticky header, scroll-reveal animations, and a calm, editorial membership section (recently de-emphasized from a pricing-card layout).

This package documents **only `foundation.html`** plus the shared stylesheet and script it depends on.

## About the Design Files
The files in this bundle are **design references created in HTML** — a prototype showing the intended look and behavior, not production code to ship directly. The task is to **recreate this design in the target codebase's existing environment** (React, Vue, Astro, plain templates, etc.) using its established components, tokens, and patterns. If no environment exists yet, choose the most appropriate framework for the project and implement the design there.

## Fidelity
**High-fidelity.** Final colors, typography, spacing, and interactions are all specified. Recreate the UI faithfully using the exact tokens below. The only "lo-fi" elements are the decorative inline SVG icons (simple line glyphs) — these can be swapped for the codebase's icon set.

---

## Page Structure (top → bottom)

1. **Sticky header / nav**
2. **Hero** — "The next chapter"
3. **North Star / Mission band** (dark) — `#mission`
4. **Charter** — four commitments + one boundary
5. **Governance** (tinted bg) — `#governance`
6. **Why this model** — four points
7. **Membership** (tinted bg) — `#membership`
8. **Footer**

All sections are constrained by `.wrap` (max-width 1200px, responsive side gutter `clamp(20px, 5vw, 64px)`). Vertical rhythm is `.section-pad` = `padding-block: clamp(64px, 9vw, 130px)`.

---

## Screens / Views

### 1. Header / Navigation
- **Layout**: Sticky top bar, height 72px, max-width 1360px, horizontal flex with `gap: 28px`. Left: brand lockup. Center-left: nav links. Flex spacer pushes the CTA to the right.
- **Brand lockup**: 30×30 logo mark = 2×2 grid of 2.5px-gap rounded (4px) squares colored `--teal`, `--core`, `--ai`, `--teal-deep`. Beside it, two-line name: **"Open Health Stack"** (700) over "Software Foundation" (0.69rem, 500, `--ink-faint`, letter-spacing 0.04em).
- **Nav links**: Foundation (active), Projects, Community, Blog. 0.96rem/500, `--ink-soft`; hover → `--ink` text on `--bg-2` pill (radius 9px); active → `--ink`, weight 600.
- **CTA**: "Become a member" → `.btn .btn-primary`, links to `#membership`.
- **Behavior**: On `window.scrollY > 8`, header gains `.scrolled` (adds bottom border `--line`). Below 860px the inline links hide and a hamburger (`.nav-toggle`, 42×42, 1px `--line` border, radius 10px) toggles `.mobile-nav`.
- **Mobile nav**: Fixed panel below header; slides down (`translateY(-12px)`→0, opacity 0→1, 0.3s `--ease`). Links 1.1rem/600 with `--line-soft` dividers; full-width primary CTA.

### 2. Hero (`.page-hero`, `data-screen-label="Foundation hero"`)
- **Padding**: top `clamp(56px, 8vw, 110px)`, bottom `clamp(40px, 6vw, 72px)`.
- **Eyebrow**: "The next chapter" — `.eyebrow` (0.75–0.8rem, 600?, letter-spacing 0.16em, uppercase, `--teal-deep`).
- **H1**: "An independent, community-owned software foundation." — `font-size: clamp(2.5rem, 5.2vw, 4.2rem)`, weight 800, letter-spacing -0.035em, line-height 1.0, `max-width: 18ch`, `margin-top: 18px`.
- **Lead**: `.lead` (`clamp(1.12rem, 1.7vw, 1.45rem)`, line-height 1.5, `--ink-soft`, `text-wrap: pretty`), `max-width: 56ch`, `margin-top: 22px`. Copy: "We're transitioning the current Open Health Stack from a Google-led project into an umbrella project at the Linux Foundation — creating a neutral home built to support the global health ecosystem it serves."

### 3. North Star / Mission band (`.northstar`, in `#mission`)
- **Layout**: Dark card (`background: var(--ink)`, `color:#fff`, `border-radius: var(--radius-lg)` = 22px, padding `clamp(32px, 5vw, 60px)`). Two columns `1.4fr 1fr`, `gap: clamp(28px, 4vw, 56px)`, vertically centered.
- **Left**: eyebrow "The charter · North star" in `--teal-bright`; H2 "Catalyze sustainable, next-gen digital health solutions." (`clamp(1.6rem, 2.6vw, 2.3rem)`, white, `margin-top: 16px`); paragraph in `oklch(0.8 0.012 200)`.
- **Right (`.ns-mark`)**: decorative 3×3 grid of rounded (12px) squares, `gap: 10px`, `aspect-ratio: 1`. Colors cycle `--teal` / `--core` / `--ai`; every even tile `opacity: 0.55`.

### 4. Charter (`.charter-grid`)
- **Layout**: 2-col grid, `gap: 22px`, `margin-top: 44px`. Each card is `.charter-card.card` — a horizontal flex (`gap: 18px`): a monospace number (`.num`, IBM Plex Mono 600, 0.95rem, `--teal-deep`, fixed width 34px) beside an `<h3>` + paragraph (`--ink-soft`, 0.96rem).
- **Items**:
  - 01 — "Develop & maintain open-source code"
  - 02 — "Enable safe AI adoption"
  - 03 — "Capacity building, advocacy & ecosystem support"
  - 04 — "Standards collaboration"
- **Boundary callout (`.constraint`)**: full-width below the grid; dashed 1.5px border `color-mix(in oklch, var(--rose) 40%, var(--line))`, bg `color-mix(in oklch, var(--rose) 5%, var(--surface))`, radius `--radius` (14px), padding 22px 26px. Contains an `.icon-chip` (52×52, radius 13px, `--teal-wash` bg, `--teal-deep` icon) with a circle-with-X SVG, then H3 "The boundary — no \"complete products\"" + paragraph.

### 5. Governance (`#governance`, `background: var(--bg-2)`)
- **Section head**: eyebrow "Governance", H2 "Balanced voices, transparent decisions.", lead.
- **`.gov-grid`** of two `.gov-card.card`s, each with an `.icon-chip` (variant colors via `.core` / `.ai`), H3, paragraph:
  - "External Advisory Council"
  - "Balanced board" (note: a former "Pending approval" badge was removed)

### 6. Why this model (`.model-grid`)
- **Section head**: eyebrow "Why this model", H2 "Built for neutrality, sustainability and scale."
- Four `.model-item`s (icon-chip + H3 + paragraph):
  - "Neutral, open governance"
  - "Sustainable, diverse funding"
  - "Future-ready platform"
  - "Cost-effective by design"

### 7. Membership (`#membership`, `.membership`, `background: var(--bg-2)`)
This section was intentionally redesigned away from a SaaS pricing-card layout into a quiet, editorial list. **Do not reintroduce price headlines, checkmark feature lists, badges, or per-tier buttons.**

- **Section head** (centered, `.section-head.center`): eyebrow "Membership"; H2 "Take a seat at the table."; lead "Help shape the charter, budget and direction — and build an enduring association with a first-of-its-kind initiative."
- **`.tier-list`**: `max-width: 880px`, centered, `margin-top: 36px`.
- **Group labels (`.tier-grouplabel`)**: monospace, 0.7rem, letter-spacing 0.14em, uppercase, `--ink-faint`, `margin: 40px 0 2px` (first-child top margin 0):
  - "Standard tiers · Linux Foundation model"
  - "Additional pathways · OHS-SF"
- **Tier rows (`.tier-row`)**: 2-col grid `230px 1fr`, `gap: 36px`, `padding: 26px 0`, `border-top: 1px solid var(--line)`, `align-items: baseline`. Left column: `<h3>` (1.1rem) + `.tier-meta` (0.84rem, `--ink-faint`, `margin-top: 6px`). Right column (`.tier-row-body p`): 0.96rem, `--ink-soft`, `max-width: 58ch`, `text-wrap: pretty`.
- **Rows & exact copy**:
  - **Premier** — meta: "$100k / year · 3-year commitment" — body: "For organizations shaping the foundation. Includes a dedicated Governing Board seat, a hand in the charter, budget and direction, and founding-member brand association. Up-front grants may be accepted in lieu of fees."
  - **General** — meta: "Sliding scale, by organization size · incl. $5k/yr Linux Foundation membership" — body: "The fee scales with organization size — indicatively $10k/year up to 100 employees. General members nominate a board representative (one per five members, up to three total) and take part in working groups and the technical, outreach and other committees."
  - **Associate** — meta: "No fee · non-profit, academic & government entities" — body: "Reserved for approved non-profit, academic and government entities. Associate members may stand for election to the Governing Board (one seat available) and participate fully in working groups and committees."
  - *(group label: Additional pathways · OHS-SF)*
  - **Inclusive** — meta: "No fee · LMIC for-profits under 100 employees" — body: "The standard $10k/year General fee is waived to maximize accessibility for entrepreneurs in lower- and middle-income countries, with full participation in working groups."
  - **Sponsorships or grants** — meta: "Custom · funders & multilaterals" — body: "We are open to mission aligned grants or financial sponsorships for specific projects or activities that support the foundations work."
- **CTA (`.membership-cta`)**: centered flex, `margin-top: 44px`, single `.btn .btn-primary` "Get in touch about membership" → `mailto:fred@ohs.foundation`.

### 8. Footer (`.site-footer`)
- Dark footer, `.wrap-wide` (max-width 1360px). `.footer-grid` columns: brand + about blurb, then "Foundation", "Projects", "Community" link lists. Bottom bar: "© <year> Open Health Stack Software Foundation · a project of the Linux Foundation." (`[data-year]` is filled by JS.)

---

## Interactions & Behavior
- **Sticky header** toggles `.scrolled` past 8px scroll.
- **Mobile nav** toggle below 860px (see Header).
- **Scroll reveal**: elements with `.reveal` start hidden and gain `.in` when intersecting (IntersectionObserver, threshold 0.12, rootMargin `0px 0px -8% 0px`). Stagger via `.d1` / `.d2` / `.d3` delay classes. `.reveal.in` (no observer / reduced motion) is the visible end-state — ensure content is visible without JS. Hero items also carry `in` initially so they show immediately.
- **Buttons**: hover lifts `translateY(-2px)` with shadow; `:active` `translateY(1px)`; transitions use `--ease` = `cubic-bezier(0.22, 0.61, 0.36, 1)`.
- **Current year**: `[data-year]` set on load.
- **Auth gate (optional)**: The page top has an inline script that redirects to `lock.html` unless a valid `ohs_auth` entry (with future `exp`) exists in `localStorage`. This is a soft preview lock — drop it or replace with real auth in production.

## State Management
Minimal/none for this page — it is static content. Client behaviors are: header scrolled flag, mobile-nav open flag, reveal-in flags. No data fetching is required for `foundation.html` (the `content.json` hydration in `app.js` only runs on pages that contain `#widget-pillar-grid`, which this page does not).

## Design Tokens (from `styles.css :root`)

### Color (OKLCH)
| Token | Value | Use |
|---|---|---|
| `--bg` | `oklch(0.985 0.004 165)` | page background (warm near-white) |
| `--bg-2` | `oklch(0.965 0.006 175)` | tinted section bg (Governance, Membership) |
| `--surface` | `#ffffff` | cards |
| `--ink` | `oklch(0.245 0.018 210)` | primary text / dark band bg |
| `--ink-soft` | `oklch(0.46 0.018 210)` | body text |
| `--ink-faint` | `oklch(0.60 0.015 210)` | meta / muted |
| `--line` | `oklch(0.905 0.008 200)` | borders / dividers |
| `--line-soft` | `oklch(0.945 0.006 200)` | subtle dividers |
| `--teal` | `oklch(0.55 0.13 290)` | signature indigo (logo) |
| `--teal-deep` | `oklch(0.42 0.11 292)` | primary button, eyebrow, accents |
| `--teal-bright` | `oklch(0.66 0.14 288)` | accent on dark |
| `--teal-wash` | `oklch(0.957 0.022 290)` | icon-chip bg |
| `--core` | `oklch(0.58 0.105 222)` | pillar accent (teal-blue) |
| `--ai` | `oklch(0.56 0.115 292)` | pillar accent (indigo-violet) |
| `--toolkit` | `oklch(0.56 0.094 200)` | pillar accent |
| `--green` | `oklch(0.60 0.11 155)` | tag hue |
| `--amber` | `oklch(0.70 0.115 75)` | tag hue |
| `--rose` | `oklch(0.62 0.13 18)` | boundary callout accent |

*(`*-wash` variants exist for `core`, `ai`, `toolkit` as light backgrounds.)*

### Layout / spacing
- `--maxw: 1200px` (content), wide container 1360px
- `--gut: clamp(20px, 5vw, 64px)` (side gutter)
- Section padding: `clamp(64px, 9vw, 130px)`
- `--radius: 14px`, `--radius-lg: 22px`

### Shadows
- `--shadow-sm: 0 1px 2px oklch(0.40 0.02 210 / 0.06), 0 2px 6px oklch(0.40 0.02 210 / 0.05)`
- `--shadow-md: 0 4px 14px oklch(0.40 0.02 210 / 0.07), 0 12px 34px oklch(0.40 0.02 210 / 0.08)`
- `--shadow-lg: 0 10px 30px oklch(0.40 0.02 210 / 0.10), 0 30px 70px oklch(0.40 0.02 210 / 0.12)`

### Motion
- `--ease: cubic-bezier(0.22, 0.61, 0.36, 1)`

### Typography
- Body font: **Hanken Grotesk** (`'Hanken Grotesk', system-ui, sans-serif`), base 17px, line-height 1.6.
- Mono font: **IBM Plex Mono** (numbers, eyebrows on tiers, group labels).
- Both loaded from Google Fonts (`<link rel="preconnect">` to fonts.googleapis.com / fonts.gstatic.com). Confirm the exact `<link href>` in the source `<head>`; weights used include 400/500/600/700/800.
- Eyebrow style: ~0.75rem, uppercase, letter-spacing 0.16em, `--teal-deep`.
- Section title (`.section-title`) and lead (`.lead`) are shared utility classes in `styles.css`.

## Buttons (shared in `styles.css`)
- `.btn` base: inline-flex, gap, padding, radius, 1px transparent border, transitions on transform/bg/shadow/border/color.
- `.btn-primary`: `--teal-deep` bg, white text, `--shadow-sm`; hover `oklch(0.37 0.078 205)` + lift + `--shadow-md`.
- `.btn-ghost`: transparent, `--ink` text, `--line` border; hover border→`--ink`, `--surface` bg.
- `.btn-light`, `.btn-on-dark` also exist (used elsewhere/in hero CTAs on other pages).

## Assets
- `favicon.svg` — site favicon (included).
- All icons in this page are **inline SVG line glyphs** (logo mark is CSS squares; section icons are stroke SVGs). No raster images on this page. Replace with the codebase's icon library if preferred.
- Google Fonts: Hanken Grotesk + IBM Plex Mono.

## Files (included in this bundle)
- `foundation.html` — the page (structure + page-specific `<style>` block in `<head>`).
- `styles.css` — shared design tokens, layout, buttons, header/footer, cards.
- `app.js` — shared interactions (sticky header, mobile nav, scroll reveal, year, accordion/count-up helpers used by other pages, optional content.json hydration that is a no-op here).
- `favicon.svg` — favicon.

> Note: `foundation.html` links to sibling pages (`index.html`, `projects.html`, `community.html`, `blog.html`, `lock.html`) and `mailto:` addresses. Those targets are **not** part of this single-page handoff — wire the nav/footer links to the real routes in your app.
