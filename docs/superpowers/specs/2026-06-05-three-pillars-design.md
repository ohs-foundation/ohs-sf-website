# Three Pillars — Design Spec

## Goal

Restructure the site from two pillars to three: rename "Core" to "FHIR Foundations" (Pillar 01), promote the Reference Toolkit / OHS Player to its own pillar (Pillar 02), and renumber AI Commons to Pillar 03. Update all affected content on `index.html`, `projects.html`, and the shared footer on all pages.

---

## Pillar structure

| # | Name | Tag label | Color token | Status label |
|---|---|---|---|---|
| 01 | FHIR Foundations | `Pillar 01 · FHIR Foundations · Active` | `--core` (blue) | Active |
| 02 | Reference Toolkit | `Pillar 02 · Reference Toolkit · Active` | `--toolkit` (teal) | Active |
| 03 | AI Commons | `Pillar 03 · AI Commons · Launching soon` | `--ai` (violet) | Launching soon |

---

## CSS changes (`styles.css`)

### New design tokens

Add to `:root` after the `--ai-wash` line (in `styles.css`):

```css
--toolkit:      oklch(0.56 0.094 200);
--toolkit-wash: oklch(0.955 0.018 195);
```

### New pillar rules (in `index.html` inline `<style>`)

Add alongside the existing `.pillar.core` and `.pillar.ai` rules:

```css
.pillar.toolkit { border-top: 3px solid var(--toolkit); }
.pillar.toolkit .glow { background: var(--toolkit); }
```

### Layout changes (in `index.html` inline `<style>`)

```css
/* change from 1fr 1fr */
.pillar-grid { grid-template-columns: 1fr 1fr 1fr; }
/* change from 1fr 1fr */
.eco-pillars { grid-template-columns: 1fr 1fr 1fr; }
```

At `≤860px` both already stack to `1fr` — no new breakpoints needed.

### Ecosystem map token (in `index.html` inline `<style>`)

```css
.eco-pillar[data-pillar="toolkit"].is-active { border-color: var(--toolkit); }
.eco-node[data-belongs="toolkit"] .en-tag { color: var(--toolkit); }
```

### Projects page (`projects.html` inline `<style>`)

Add alongside existing `.pillar-band.core` and `.pillar-band.ai`:

```css
.pillar-band.toolkit {
  background: linear-gradient(120deg, var(--toolkit-wash), var(--surface));
  border: 1px solid color-mix(in oklch, var(--toolkit) 18%, transparent);
}
.pillar-band.toolkit .pb-mark i { background: var(--toolkit); }
.pillar-band.toolkit .pb-mark i:nth-child(even) { opacity: 0.45; }
```

---

## `index.html` changes

### Pillar section

- Eyebrow: `01 · Two pillars` → `01 · Three pillars`
- Heading: `One foundation, two pillars of work.` → `One foundation, three pillars of work.`
- Lead: `An umbrella structure that maintains the building blocks developers rely on today, opens the fastest path to building a next-gen digital health solution, and creates a neutral space for what comes next.`
- Pillar grid: 3 cards

**Card 01 — FHIR Foundations:**
- Tag: `Pillar 01 · FHIR Foundations · Active`
- Class: `card pillar core`
- Heading: `FHIR-native core libraries`
- Body: `The foundational Kotlin Multiplatform libraries for working with FHIR — plus battle-tested components for Android, access control and analytics, sustained by an active community of technical partners.`
- Bullets: `kotlin-fhir & kotlin-fhirpath — KMP FHIR libraries` / `Android FHIR SDK, Info Gateway & Analytics` / `HL7® FHIR® interoperability by default`
- Link: `Explore FHIR Foundations →` → `projects.html#core`

**Card 02 — Reference Toolkit:**
- Tag: `Pillar 02 · Reference Toolkit · Active`
- Class: `card pillar toolkit`
- Heading: `Multiplatform AI-ready Reference Toolkit`
- Body: `The fastest way to develop and deploy a next-gen digital health solution — a complete, composable reference implementation built on the FHIR Foundations libraries, ready for Android, iOS and web.`
- Bullets: `OHS Player — the reference runtime` / `KMP client app, web portal & backend` / `AI-ready by design`
- Link: `Explore the toolkit →` → `projects.html#toolkit`

**Card 03 — AI Commons:**
- Tag: `Pillar 03 · AI Commons · Launching soon`
- Class: `card pillar ai`
- Heading: `AI Commons for Global Health` (unchanged)
- Body: unchanged
- Bullets: unchanged
- Link: `Explore AI Commons →` → `projects.html#ai`

### Hero stack diagram

Add a new layer between "Standards-based building blocks" and "AI Commons for Global Health":

```html
<div class="stack-layer layer-toolkit">
  <div class="ltext">
    <div class="ll">Pillar 02 · Active</div>
    <div class="lt">Reference Toolkit</div>
    <div class="ls">OHS Player — multiplatform, AI-ready</div>
  </div>
  <div class="blocks" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i></div>
</div>
```

Add CSS for `.layer-toolkit` alongside `.layer-core` and `.layer-ai`:

```css
.layer-toolkit { background: color-mix(in oklch, var(--toolkit-wash) 80%, white); border: 1px solid color-mix(in oklch, var(--toolkit) 22%, transparent); }
.layer-toolkit .ll { color: var(--toolkit); }
.layer-toolkit .blocks i { background: var(--toolkit); }
.layer-toolkit .blocks i:nth-child(2n) { opacity: 0.55; }
```

### Ecosystem map

**Pillar buttons:** 3 buttons in `eco-pillars`:

1. Core button → update label to `Pillar 01 · FHIR Foundations`, sub `FHIR-native core libraries`, count `5 projects`
2. New toolkit button: `data-pillar="toolkit"`, label `Pillar 02 · Reference Toolkit`, sub `Multiplatform AI-ready runtime`, count `4 projects`
3. AI button → update to `Pillar 03 · AI Commons`, count unchanged `3 initiatives`

**Toolkit button icon** — use a layers/stack SVG:
```html
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M12 2 2 7l10 5 10-5-10-5Z"/>
  <path d="m2 17 10 5 10-5"/>
  <path d="m2 12 10 5 10-5"/>
</svg>
```

**Nodes:** Update `eco-nodes` to 12 total:

Core nodes (5, `data-belongs="core"`):
1. kotlin-fhir — "Lean, fast KMP implementation of the HL7® FHIR® data model."
2. kotlin-fhirpath — "KMP implementation of FHIRPath for querying FHIR resources."
3. Android FHIR SDK — "FHIR-native libraries for secure, offline-capable Android apps." (existing)
4. FHIR Info Gateway — "Privacy-preserving access control for patient data." (existing)
5. FHIR Analytics — "Transform FHIR data into trusted, faster insights." (existing)

Toolkit nodes (4, `data-belongs="toolkit"`):
1. OHS Player — "The reference runtime — deploy a next-gen digital health solution."
2. Reference Client App — "KMP-based configurable reference app built on OHS components."
3. Reference Web Portal — "Web-based management tool for healthcare workforce hierarchies."
4. Reference Backend — "Custom endpoints and access checker plugins for OHS Player clients."

AI nodes (3, `data-belongs="ai"`) — unchanged.

---

## `projects.html` changes

### Page title

`Two pillars. Many building blocks.` → `Three pillars. Many building blocks.`

### Pillar 01 — FHIR Foundations (replaces Core)

- Section `id="core"` stays (anchor links from footers/nav remain valid)
- Band tag: `Pillar 01 · FHIR Foundations · Active`
- Band heading: `FHIR-native core libraries`
- Band description: `The foundational Kotlin Multiplatform libraries for working with FHIR, plus battle-tested components for Android, access control and analytics.`
- Band class: `pillar-band core` (unchanged)

**5 project cards:**

1. **kotlin-fhir** — Tag: Core Library · Status: Active · Lang: Kotlin Multiplatform · Repo: `https://github.com/ohs-foundation/kotlin-fhir`
   - Body: "A lean, fast KMP implementation of the HL7® FHIR® data model — the foundational library for all OHS components."

2. **kotlin-fhirpath** — Tag: Core Library · Status: Active · Lang: Kotlin Multiplatform · Repo: `https://github.com/ohs-foundation/kotlin-fhirpath`
   - Body: "KMP implementation of FHIRPath for querying and evaluating FHIR resources across platforms."

3. **Android FHIR SDK** — Tag: SDK · Status: Maintenance (new CSS class — amber dot, label "Maintenance") · Lang: Kotlin · Android · Repo: `https://github.com/ohs-foundation/android-fhir`
   - Body: "FHIR-native libraries to build Android apps that are secure, offline-capable, and provide on-device decision support." (existing copy)

4. **FHIR Info Gateway** — Tag: Gateway · Status: Active · Lang: Java · Proxy · Repo: `https://github.com/ohs-foundation/fhir-gateway`
   - Body: existing copy

5. **FHIR Analytics** — Tag: Analytics · Status: Active · Lang: Python · Pipelines · Repo: `https://github.com/ohs-foundation/fhir-data-pipes`
   - Body: existing copy

### Pillar 02 — Reference Toolkit (new section)

Insert between FHIR Foundations and AI Commons. Section `id="toolkit"`.

- Band class: `pillar-band toolkit`
- Band tag: `Pillar 02 · Reference Toolkit · Active`
- Band heading: `Multiplatform AI-ready Reference Toolkit`
- Band description: `The fastest way to develop and deploy a next-gen digital health solution — a complete, composable reference implementation built on the FHIR Foundations libraries.`

**4 project cards:**

1. **OHS Player** — Tag: Runtime · Status: Active · Lang: Kotlin Multiplatform · Repo: `https://github.com/ohs-foundation/ohs-player`
   - Body: "The reference runtime for OHS — orchestrates the building blocks into a deployable, AI-ready digital health solution."

2. **Reference Client App** — Tag: Mobile · Status: Active · Lang: Kotlin Multiplatform · Repo: `https://github.com/ohs-foundation/ohs-player-reference-client-app`
   - Body: "A KMP-based configurable reference application built on OHS components for Android and iOS."

3. **Reference Web Portal** — Tag: Web · Status: Active · Lang: TypeScript · Repo: `https://github.com/ohs-foundation/ohs-player-reference-web-portal`
   - Body: "A web-based management tool for healthcare organisations to manage workforce hierarchies and configuration."

4. **Reference Backend** — Tag: Backend · Status: Active · Lang: Kotlin · Repo: `https://github.com/ohs-foundation/ohs-player-reference-backend`
   - Body: "Custom endpoints and access checker plugins powering all OHS Player clients."

### Pillar 03 — AI Commons (renumbered from Pillar 02)

- Band tag: `Pillar 03 · AI Commons · Launching soon`
- Body copy unchanged
- Cards unchanged
- Section `id="ai"` stays

### Steering committees

- "Core Building Blocks TSC" → "FHIR Foundations TSC" (description updated to match new scope)
- AI Commons TSC: unchanged
- Governing Board: unchanged

---

## Footer changes (all 4 pages: index, foundation, projects, community)

Projects nav column:

```html
<li><a href="projects.html#core">FHIR Foundations</a></li>
<li><a href="projects.html#toolkit">Reference Toolkit</a></li>
<li><a href="projects.html#ai">AI Commons</a></li>
<li><a href="projects.html#committees">Steering committees</a></li>
```

---

## Files changed

| File | Changes |
|---|---|
| `styles.css` | Add `--toolkit` + `--toolkit-wash` tokens |
| `index.html` | Pillar section (copy + 3rd card), hero stack (new layer), ecosystem map (3rd button + updated nodes), CSS rules for toolkit, footer |
| `projects.html` | Page title, Pillar 01 rename + 5 cards, new Pillar 02 section + 4 cards, Pillar 03 renumber, TSC rename, footer |
| `foundation.html` | Footer only |
| `community.html` | Footer only |

---

## New CSS class: `.status.maintenance`

Add to `styles.css` alongside the existing `.status.active` and `.status.incubating` rules:

```css
.status.maintenance .dot { background: var(--ink-faint); }
```

Label text: "Maintenance". Used only for Android FHIR SDK in this change.

---

## Out of scope

- New steering committee for Reference Toolkit (add later when governance is formal)
- `community.html` content changes (events, channels)
- `foundation.html` content changes (membership, governance)
- GitHub link fixes on community.html (separate task)
