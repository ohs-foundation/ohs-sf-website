# Handoff: Blog + site updates — OHS Software Foundation website

## Overview
This package documents a batch of changes to the **Open Health Stack Software Foundation** marketing website. The headline addition is a **Blog**, anchored by the foundation's launch announcement post. It also includes a set of smaller content/structure edits across the home, projects, and community pages.

The work in this round:
1. **New Blog** — a blog index (`blog.html`) + the launch announcement article (`blog-launch-announcement.html`).
2. **"Blog" added to the global nav** (desktop + mobile) and footer on every page.
3. **Home (`index.html`)** — added a "Read the intention to launch announcement" pill to the hero; removed the duplicate "Ecosystem map" section and replaced it with a single "Explore all projects" link under the three pillars; renamed Pillar 03 to **"AI Commons"** (one card retains the longer "AI Commons for Global Digital Health" heading — see notes); tightened two FHIR-Foundations pillar copy strings.
4. **Projects (`projects.html`)** — added a **Kotlin Multiplatform FHIR SDK** project card (Active) before the Android FHIR SDK (Maintenance); replaced the "Steering committees" section with a **Get involved** CTA pointing to Community.
5. **Community (`community.html`)** — replaced the populated Events section with an **"Event calendar coming soon"** placeholder.

## About the design files
The files in `site/` are the **actual source of the live site** — this project is a **framework-free static website** (hand-authored HTML, one shared `styles.css`, one `app.js`, and a `content.json` data file consumed by `index.html`). They are not throwaway prototypes; they ARE the implementation.

The target codebase (the developer's `ohs-sf/` repo) is the same plain HTML/CSS/JS stack, so these files map **1:1** onto it — apply the diffs described below directly. If you are instead porting this site into a component framework (React/Vue/Astro/etc.), treat these files as high-fidelity references and recreate the markup/behavior using that framework's patterns and the same design tokens.

## Fidelity
**High-fidelity / production.** Final colors, typography, spacing, and interactions are all resolved. Reproduce exactly.

## File map (project → codebase)
| This package | Maps to | Status |
|---|---|---|
| `site/index.html` | `index.html` | edited |
| `site/projects.html` | `projects.html` | edited |
| `site/community.html` | `community.html` | edited |
| `site/foundation.html` | `foundation.html` | edited (AI Commons wording only) |
| `site/blog.html` | `blog.html` | **new** |
| `site/blog-launch-announcement.html` | `blog-launch-announcement.html` | **new** |
| `site/content.json` | `content.json` | edited |
| `site/styles.css` | `styles.css` | unchanged — included for token reference |
| `site/app.js` | `app.js` | unchanged — included for behavior reference |

> Not included (unchanged): `lock.html`, `favicon.svg`. The two new blog pages reuse the existing `lock.html` auth-gate snippet (see "Auth gate" below).

---

## Shared design system (already in `styles.css`)
All pages inherit from `styles.css`. Build everything from these — do not introduce new tokens or fonts.

### Fonts (Google Fonts)
- **Hanken Grotesk** — body + headings; weights 400/500/600/700/800.
- **IBM Plex Mono** — eyebrows, tags, meta labels; weights 400/500/600.
- Base body: 17px, line-height 1.6, color `--ink`.

### Color tokens (`:root`, authored in oklch — hex is approximate)
| Token | oklch | ~hex | Use |
|---|---|---|---|
| `--bg` | `0.985 0.004 165` | `#fbfcfa` | page background |
| `--bg-2` | `0.965 0.006 175` | `#f3f6f4` | alt section band |
| `--surface` | `#ffffff` | `#ffffff` | cards |
| `--ink` | `0.245 0.018 210` | `#1f2a2e` | primary text |
| `--ink-soft` | `0.46 0.018 210` | `#5b6a6f` | body/secondary |
| `--ink-faint` | `0.60 0.015 210` | `#83908f` | meta / mono labels |
| `--line` | `0.905 0.008 200` | `#e2e7e6` | borders, dashed placeholders |
| `--teal` (signature) | `0.55 0.13 290` | `#6a4bd6` | accent (note: indigo, despite token name) |
| `--teal-deep` | `0.42 0.11 292` | `#4a32a3` | links, primary button, arrows |
| `--teal-bright` | `0.66 0.14 288` | `#8b6ef0` | bright accent |
| `--teal-wash` | `0.957 0.022 290` | `#efeafc` | tinted pill/chip bg |
| `--core` (Pillar 01) | `0.58 0.105 222` | `#3f86c4` | FHIR Foundations |
| `--toolkit` (Pillar 02) | `0.56 0.094 200` | `#2a8f96` | Reference Toolkit |
| `--ai` (Pillar 03) | `0.62 0.13 35` | `#d2683f` | AI Commons |
| `--amber` / `--green` / `--rose` | — | — | status dots / accents |

### Radius & shadow
- `--radius` (cards/inputs), `--radius-lg` (large panels), full-round `999px` for pills/tags.
- `--shadow-sm`, `--shadow-md` (hover elevation), `--ease` (shared transition curve).

### Reusable classes (defined in `styles.css`)
- Layout: `.wrap` (max-width ~1200px, centered, responsive gutter), `.wrap-wide`, `.section-pad`.
- Type: `.eyebrow` (mono kicker with leading rule; add `.bare` to drop the rule), `.section-title`, `.lead`.
- Buttons: `.btn` + `.btn-primary` (deep teal fill), `.btn-ghost` (transparent, `--line` border), `.btn-light` (white on dark), `.btn-on-dark`.
- Links: `.textlink` (inline link with `.arrow` svg that slides on hover).
- Tags: `.tag` + color variants `.core` / `.toolkit` / `.ai` / `.teal`.
- Cards: `.card`, `.card.hover`.
- Motion: `.reveal` + `.reveal.in`, stagger delays `.d1`–`.d4` (driven by `app.js` IntersectionObserver).
- Chrome: `.site-header`/`.nav`/`.nav-links`/`.nav-cta`/`.nav-toggle`/`.mobile-nav`; `.site-footer`/`.footer-grid`.

### `app.js` behaviors (no change needed)
Sticky-header `scrolled` class on scroll; `.nav-toggle` opens/closes `.mobile-nav` (toggles `aria-expanded`); `.reveal` → adds `.in` when entering viewport; `[data-year]` → current year in footer.

---

## NEW — Blog

### Screen: Blog index (`blog.html`)
- **Purpose:** entry point listing posts; currently one featured post + a "coming soon" rail.
- **Layout (top→bottom):**
  1. Standard `.site-header` nav + `.mobile-nav` (with **Blog** marked `.active`).
  2. `.page-hero` (`.wrap`): eyebrow "The blog", h1 ("News, releases and notes from the foundation."), `.lead`.
  3. **Featured post** — a single anchor `.featured` (grid `1.05fr / 0.95fr`, `--radius-lg`, `--line` border, `--shadow-sm`; hover lifts `translateY(-3px)` to `--shadow-md`). Left `.featured-body`: tags (`.tag.teal` "Latest" + `.tag` "Foundation news"), h2 title, `.excerpt`, `.featured-meta` (byline · date · read time), `.textlink` "Read the announcement". Right `.featured-art`: dark panel (`--ink` bg) with a blurred `--teal` `.glow` and a CSS-built "temple" mark (`.fa-roof` dashed label → 3 `.fa-col` columns tinted `--core`/`--toolkit`/`--ai` → `.fa-base` plinth). Decorative only (`aria-hidden`).
  4. "More posts" rail (`.more-rail` — mono label with trailing rule) + `.upcoming` dashed-border placeholder card.
  5. Standard `.site-footer`.
- **Featured card links to** `blog-launch-announcement.html`.
- **Responsive:** under 800px `.featured` collapses to one column and the art panel moves above the text.

### Screen: Launch announcement article (`blog-launch-announcement.html`)
- **Purpose:** the foundation's launch post (the "hybrid" edit — concise but with the key supporting sections).
- **Reading width:** `.article-body` capped at **720px**, centered.
- **Layout (top→bottom):**
  1. Nav (Blog `.active`).
  2. `.article-hero` (`.wrap`): `.breadcrumb` (`Blog / Foundation news`), `<h1>`, `.article-dek` (`.lead`), `.article-meta` (a `.mchip` "Launch announcement" pill on `--teal-wash`, byline, `<time>`, read time) on a top hairline border.
  3. `.article-body`: intro paragraphs → `<h2>` section heads each with a mono `.kicker` label → **3 pillar cards** (`.post-pillars`: `.pp.core` / `.pp.toolkit` / `.pp.ai`, each a left-accent-border card with status `.tag`, `<h3>`, copy) → a centered `.pullquote` (large balanced quote, teal `“` mark) → "Why the Linux Foundation" `.def-list` (left-border list items) → a short community/partners paragraph → a `.closer` (kicker line + bold call-to-action line).
  4. `.cta-band` — full-width deep-teal gradient band, centered eyebrow + h2 + lead + `.cta-row` of buttons (`.btn-light` "Explore the repositories", `.btn-on-dark` "Become a founding member" / "Join the community").
  5. Footer.
- **Article-specific CSS** lives in a `<style>` block in the file head (classes: `.article-hero`, `.breadcrumb`, `.article-dek`, `.article-meta`/`.mchip`, `.article-body`, `.kicker`, `.post-pillars`/`.pp`, `.pullquote`, `.def-list`, `.closer`, `.cta-band`). If porting to components, lift these rules.
- **Exact copy:** use the text in `site/blog-launch-announcement.html` verbatim. Note the byline is "the OHS-SF team", date `2026-07-07` (July 7, 2026), "4 min read" — all confirmable placeholders (see below).

### Auth gate (both blog pages)
Each blog page begins with the same inline script the rest of the site uses: it reads `localStorage["ohs_auth"]` (a JSON `{exp}` timestamp) and, if missing/expired, redirects to `lock.html?return=<url>`. Keep this snippet identical to the other pages so the gate stays consistent. (PIN handling lives in `lock.html`, unchanged.)

---

## EDITS — Home (`index.html`)

### 1. Hero announcement pill (new)
At the very top of the hero's first `.reveal` column, above the `.eyebrow`, an anchor `.hero-announce` linking to `blog-launch-announcement.html`:
- Inline-flex pill: `--surface` bg, `1px --line` border, `border-radius:999px`, `--shadow-sm`, `padding:9px 12px 9px 18px`, `gap:12px`, `margin-bottom:24px`, `font-size:1.02rem`.
- Children: `.ha-tag` ("New" — mono 0.7rem, uppercase, `--teal-deep` on `--teal-wash`, rounded), `.ha-text` ("Read the intention to launch announcement" — weight 600, `--ink`), and a 19×19 arrow svg (`--teal-deep`).
- Hover: `border-color:--teal`, `translateY(-1px)`, `--shadow-md`; arrow slides `translateX(3px)`.
- ≤560px: `font-size:0.92rem`, `.ha-text` allowed to wrap.

### 2. Ecosystem section removed → "Explore all projects" link
The entire `<section class="ecosystem">` (the interactive pillar→projects map, formerly "02 · The ecosystem") was **deleted** as duplicative of the Projects page. In its place, a centered link block at the end of the three-pillars section, after `.pillar-grid`:
```html
<div class="pillars-cta reveal" style="display:flex; justify-content:center; margin-top:48px">
  <a href="projects.html" class="btn btn-primary">Explore all projects <svg class="arrow" .../></a>
</div>
```
Each pillar card keeps its own per-pillar `.pillar-foot` link (`projects.html#core` / `#toolkit` / `#ai`).
> Side effect: section eyebrow numbering now runs 01 (pillars) → 03 (Why a foundation); 02 is unused. Left as-is — renumber if desired.

### 3. Pillar 03 renamed to "AI Commons"
"AI Commons for Global Health" → "AI Commons" in the home pillar card heading and the "Future proof / AI-ready platform" mention. Same rename applied in `projects.html` (Pillar 03 `<h2>`) and `foundation.html` (AI-ready platform copy).
> Exception: the home pillar **grid is data-driven from `content.json`**, and per a later request its `cardHeading` is the longer **"AI Commons for Global Digital Health"**. So the JS-rendered grid card shows the long form while other references show "AI Commons". Intentional — confirm if you want them unified.

### 4. FHIR Foundations pillar copy (in `content.json`)
- `pillars[0].cardBody`: now "The foundational libraries for working with FHIR. Includes new multi-platform kotlin FHIR SDK and battle-tested components for Android, access control and analytics, sustained by an active community of technical partners." (removed "kotlin and java").
- `pillars[0].cardBullets[1]`: now "Client SDK and server side libraries for building on FHIR".

### `content.json` consumption
`index.html` reads `content.json` at runtime to render `#widget-pillar-grid` (the three pillar cards) and related widgets. Keys per pillar include `tagLabel`, `cardHeading`, `cardBody`, `cardBullets[]`, `cardLinkLabel`, `cardLinkHref`, plus ecosystem/diagram fields. When porting, preserve this data-driven binding (or inline the values into the template if you drop the JSON).

---

## EDITS — Projects (`projects.html`)

### 1. New project card: Kotlin Multiplatform FHIR SDK
In the `#core` (FHIR Foundations) `.proj-grid`, a new `<article class="card hover proj reveal d2">` inserted **immediately before** the "Android FHIR SDK" card:
- `.proj-top`: `.icon-chip.core` (svg) + `.tag.core` "SDK".
- `<h3>` "Kotlin Multiplatform FHIR SDK".
- Copy: "The next-generation, multiplatform SDK for building FHIR-native apps across Android, iOS and web from a single Kotlin codebase — the successor to the Android FHIR SDK."
- `.proj-meta`: `.status.active` (green dot) "Active" + `.lang` "Kotlin Multiplatform".
- `.repo` link → `https://github.com/ohs-foundation/kmp-fhir-sdk` **(placeholder URL — confirm)**.
- The existing Android FHIR SDK card stays right after it, status `.maintenance` "Maintenance".

### 2. Steering committees → Get involved CTA
The whole `<section id="committees" class="committees section-pad">` (header "Steering committees keep the blocks moving." + 3 committee cards) was **replaced** by a centered CTA, reusing the `.committees` band styling:
```html
<section id="get-involved" class="committees section-pad">
  <div class="wrap">
    <div class="section-head reveal" style="text-align:center; max-width:760px; margin-inline:auto">
      <span class="eyebrow bare" style="justify-content:center">Get involved</span>
      <h2 class="section-title" style="margin-top:16px">Build a block. Or build on them.</h2>
      <p class="lead" style="margin-inline:auto">Every project is open and openly governed. Developers, ministries, funders and partners are welcome — contributing never requires membership.</p>
      <div class="cta-row reveal d1" style="display:flex; flex-wrap:wrap; gap:14px; justify-content:center; margin-top:32px">
        <a href="community.html" class="btn btn-primary">Join the community <svg class="arrow" .../></a>
        <a href="https://github.com/ohs-foundation" target="_blank" rel="noopener" class="btn btn-ghost">Explore the repositories</a>
      </div>
    </div>
  </div>
</section>
```
> The section `id` changed from `#committees` to `#get-involved`. Update any anchor links that pointed to `#committees`.

---

## EDITS — Community (`community.html`)

### Events → "coming soon" placeholder
Inside `<section id="events">`, the populated content (the "Open Digital Health Summit" `.event-feature` with stats + the dated `.event-list` rows) was **replaced** by a placeholder, while the section header was kept (lead reworded to "Summits, workshops and bootcamps that bring the community together — with the WHO and partners."):
```html
<div class="reveal d1" style="margin-top:40px; border:1.5px dashed var(--line); border-radius:var(--radius-lg); padding:clamp(40px,6vw,72px); text-align:center; background:var(--surface)">
  <span class="icon-chip teal" style="margin:0 auto 18px"><svg ...calendar.../></span>
  <h3 style="font-size:1.3rem; letter-spacing:-0.01em">Event calendar coming soon</h3>
  <p style="color:var(--ink-soft); max-width:46ch; margin:12px auto 0; line-height:1.6">We're lining up our first summits, workshops and community sessions. Check back shortly — or join a channel below to hear about events first.</p>
  <div style="display:flex; justify-content:center; margin-top:26px">
    <a href="#channels" class="btn btn-ghost">See the channels</a>
  </div>
</div>
```

---

## Global — "Blog" nav entry
Added to **every page** (`index`, `foundation`, `projects`, `community`, and both blog pages):
- Desktop: a new `<a href="blog.html">Blog</a>` in `.nav-links`, after the Community link (gets `class="active"` on the blog pages).
- Mobile: matching `<a href="blog.html">Blog</a>` in `.mobile-nav`, before the "Become a member" button.
- Footer: a "Blog" link added to the Community column where present.

---

## Interactions & behavior summary
- **Nav:** sticky header gains `.scrolled` past offset; mobile hamburger toggles `.mobile-nav` + `aria-expanded`. (existing `app.js`)
- **Reveal-on-scroll:** any element with `.reveal` fades/rises in via IntersectionObserver adding `.in`; `.d1`–`.d4` stagger. New blocks already carry these classes. (existing `app.js`)
- **Hover states:** `.featured`, `.post-row`/`.join-list` (article), `.hero-announce`, `.btn*`, `.textlink` arrows — all use `translateY`/`translateX` + shadow transitions on `--ease`. Honor `prefers-reduced-motion` if rebuilding animations.
- **Links/flows:** hero pill + blog featured card → article; article CTA → GitHub / mailto / community; projects CTA → community + GitHub; community placeholder → `#channels`.
- **Responsive:** `.featured` and grids collapse to single column at the documented breakpoints; pill text wraps ≤560px.

## Design tokens
See "Shared design system" above — the authoritative source is `:root` in `site/styles.css`. No new tokens were introduced this round.

## Assets
- **No raster images.** All visuals are CSS/SVG: inline `<svg>` icons (stroke `currentColor`), the CSS "temple" mark on the blog index, and the `.ef-globe`/icon-chips. Fonts load from Google Fonts. `favicon.svg` is referenced but unchanged (not bundled).

## Placeholders to confirm before publish
1. **Publish date** — `2026-07-07` (July 7, 2026) on the post + community placeholder copy.
2. **Byline** — "the OHS-SF team" (no named author/spokesperson).
3. **Kotlin Multiplatform FHIR SDK** — repo URL `github.com/ohs-foundation/kmp-fhir-sdk` and the "successor to the Android FHIR SDK" framing.
4. **GitHub org URL** — `github.com/ohs-foundation` used in CTAs (the existing community "Channels" section still points at `github.com/google/android-fhir` / "github.com/open-health-stack" — reconcile).
5. **AI Commons heading** — long form ("…for Global Digital Health") in the JSON-driven home grid vs short form ("AI Commons") elsewhere.
6. **Read time** — "4 min read" is an estimate.

## Files in this package
- `site/index.html`, `site/projects.html`, `site/community.html`, `site/foundation.html` — edited pages
- `site/blog.html`, `site/blog-launch-announcement.html` — new blog pages
- `site/content.json` — edited pillar data
- `site/styles.css`, `site/app.js` — unchanged, included for token + behavior reference
