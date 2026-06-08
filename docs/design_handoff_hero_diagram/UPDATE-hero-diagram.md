# Task: Update the hero diagram widget on `index.html`

**Scope — read first.** This is a *surgical* swap of **one widget**: the hero "stack" diagram in `index.html`. Replace the old flat 5-layer stack with the new **"Pillars on Open Standards" temple** diagram. Do **not** touch any other section, page, the nav, the token definitions in `:root`, or `styles.css`. Three edits, all inside `index.html`:

1. Replace the widget's CSS (inline `<style>` block).
2. Replace the widget's markup (in the hero).
3. One responsive tweak.

The widget reuses design tokens the site already defines (`--core`, `--teal`, `--teal-deep`, `--teal-bright`, `--ai`, `--core-wash`, `--teal-wash`, `--ai-wash`, `--bg-2`, `--ink`, `--ink-soft`, `--ink-faint`, `--line`, `--surface`, `--radius-lg`, `--shadow-lg`). No new tokens needed.

---

## Edit 1 — CSS

In the inline `<style>` block, **delete the entire old block** starting at the comment

```css
/* Hero stack visual — layered rounded blocks (apps → blocks → infra) */
```

through the end of the `.stack-float b { … }` rule (everything up to, but not including, `/* The shift band */`). That covers all of: `.stack-vis`, `.stack-card`, `.stack-layer`, `.stack-layer+.stack-layer`, `.stack-layer .ltext/.ll/.lt/.ls/.blocks`, `.layer-apps`, `.layer-core`, `.layer-ai`, `.layer-toolkit`, `.layer-infra`, `.stack-connect`, `.stack-float` and its children.

**Replace it with:**

```css
/* Hero — Pillars on Open Standards (temple) */
.stack-vis { position: relative; }
.dz-card { background: var(--surface); border: 1px solid var(--line); border-radius: var(--radius-lg); padding: 20px; box-shadow: var(--shadow-lg); color: var(--ink); }
.dz-text { display: flex; flex-direction: column; gap: 4px; min-width: 0; }
.dz-ll { font-family: 'IBM Plex Mono', monospace; font-size: 0.6rem; letter-spacing: 0.12em; text-transform: uppercase; opacity: 0.78; line-height: 1.2; }
.dz-lt { font-weight: 700; font-size: 1rem; letter-spacing: -0.01em; line-height: 1.2; color: var(--ink); }

.dz-temple { display: flex; flex-direction: column; }
.dz-t-apps { background: var(--bg-2); border: 1px solid var(--line); border-radius: 16px; padding: 16px 18px; }
.dz-t-apps-head { display: flex; align-items: flex-end; justify-content: space-between; gap: 12px; margin-bottom: 14px; }
.dz-t-by { font-family: 'IBM Plex Mono', monospace; font-size: 0.62rem; letter-spacing: 0.06em; text-transform: uppercase; color: var(--ink-faint); white-space: nowrap; }
.dz-t-grid { display: flex; gap: 8px; }
.dz-t-app { width: 42px; height: 42px; flex: none; border: 1px solid var(--line); border-radius: 11px; display: grid; place-items: center; }
.dz-t-icon { width: 46%; height: 46%; border-radius: 6px; display: block; }
.dz-t-more { width: auto !important; padding: 0 12px; background: transparent !important; border: 1px dashed var(--line) !important; font-family: 'IBM Plex Mono', monospace; font-size: 0.64rem; text-align: center; color: var(--ink-faint); letter-spacing: 0.04em; }
.dz-t-rest { text-align: center; font-family: 'IBM Plex Mono', monospace; font-size: 0.62rem; letter-spacing: 0.1em; text-transform: uppercase; color: var(--ink-faint); padding: 11px 0; position: relative; }
.dz-t-rest::before { content: "▼"; display: block; color: color-mix(in oklch, var(--teal) 60%, var(--ink-faint)); font-size: 0.7rem; margin-bottom: 4px; }
.dz-t-pillars { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
.dz-t-col { border-radius: 16px; padding: 0 18px 24px; min-height: 280px; position: relative; display: flex; flex-direction: column; box-shadow: 0 2px 14px oklch(0.4 0.02 210 / 0.07); }
.dz-t-col-cap { height: 11px; margin: 0 -18px 20px; border-radius: 16px 16px 0 0; }
.dz-t-col-num { font-family: 'IBM Plex Mono', monospace; font-size: 0.62rem; letter-spacing: 0.07em; text-transform: uppercase; }
.dz-t-col-name { font-weight: 700; font-size: 1.28rem; letter-spacing: -0.02em; margin-top: 8px; line-height: 1.08; }
.dz-t-col-desc { font-size: 0.86rem; color: var(--ink-soft); line-height: 1.4; margin-top: 12px; }
.dz-t-blocks { margin-top: auto; display: grid; grid-template-columns: repeat(3, 20px); gap: 6px; padding-top: 24px; }
.dz-t-blocks i { height: 20px; border-radius: 6px; display: block; }
.dz-t-blocks i:nth-child(n+4) { opacity: 0.5; }
.dz-temple .dz-core { background: var(--core-wash); }
.dz-temple .dz-core .dz-t-col-cap { background: var(--core); } .dz-temple .dz-core .dz-t-col-num { color: var(--core); } .dz-temple .dz-core .dz-t-blocks i { background: var(--core); }
.dz-temple .dz-toolkit { background: var(--teal-wash); }
.dz-temple .dz-toolkit .dz-t-col-cap { background: var(--teal); } .dz-temple .dz-toolkit .dz-t-col-num { color: var(--teal-deep); } .dz-temple .dz-toolkit .dz-t-blocks i { background: var(--teal); }
.dz-temple .dz-ai { background: var(--ai-wash); }
.dz-temple .dz-ai .dz-t-col-cap { background: var(--ai); } .dz-temple .dz-ai .dz-t-col-num { color: var(--ai); } .dz-temple .dz-ai .dz-t-blocks i { background: var(--ai); }
.dz-t-base { background: oklch(0.27 0.018 210); color: #fff; border-radius: 16px; padding: 18px 22px; display: flex; align-items: center; justify-content: space-between; gap: 16px; }
.dz-t-base .dz-lt { color: #fff; } .dz-t-base .dz-ll { color: oklch(0.78 0.01 200); }
.dz-t-apps .dz-lt, .dz-t-base .dz-lt { white-space: nowrap; }
.dz-t-chips { display: flex; flex-wrap: wrap; gap: 8px; justify-content: flex-end; }
.dz-t-chips span { font-family: 'IBM Plex Mono', monospace; font-size: 0.74rem; letter-spacing: 0.02em; background: oklch(1 0 0 / 0.1); border: 1px solid oklch(1 0 0 / 0.16); border-radius: 999px; padding: 6px 13px; white-space: nowrap; }
```

> Note: `--toolkit*` tokens are no longer referenced by this widget (the Reference Toolkit pillar now uses the site's `--teal*` tokens). Leave the `--toolkit*` token definitions in place unless you confirm nothing else uses them.

---

## Edit 2 — Markup

In the hero (`<section class="hero">`), **replace the entire** `<div class="stack-vis reveal in d1"> … </div>` block (the one containing `<div class="stack-card" data-screen-label="Hero stack diagram">` and its five `.stack-layer` rows) with:

```html
<div class="stack-vis reveal in d1">
  <div class="dz-card dz-temple" data-screen-label="Hero pillars diagram">
    <!-- Apps roof -->
    <div class="dz-t-apps">
      <div class="dz-t-apps-head">
        <div class="dz-text">
          <div class="dz-ll">Built on top</div>
          <div class="dz-lt">Apps &amp; solutions</div>
        </div>
        <div class="dz-t-by">Built by developers everywhere</div>
      </div>
      <div class="dz-t-grid">
        <div class="dz-t-app" style="background: color-mix(in oklch, oklch(0.58 0.105 222) 12%, white); border-color: color-mix(in oklch, oklch(0.58 0.105 222) 26%, transparent);"><span class="dz-t-icon" style="background: oklch(0.58 0.105 222);"></span></div>
        <div class="dz-t-app" style="background: color-mix(in oklch, oklch(0.56 0.115 292) 12%, white); border-color: color-mix(in oklch, oklch(0.56 0.115 292) 26%, transparent);"><span class="dz-t-icon" style="background: oklch(0.56 0.115 292);"></span></div>
        <div class="dz-t-app" style="background: color-mix(in oklch, oklch(0.56 0.094 200) 12%, white); border-color: color-mix(in oklch, oklch(0.56 0.094 200) 26%, transparent);"><span class="dz-t-icon" style="background: oklch(0.56 0.094 200);"></span></div>
        <div class="dz-t-app" style="background: color-mix(in oklch, oklch(0.60 0.11 155) 12%, white); border-color: color-mix(in oklch, oklch(0.60 0.11 155) 26%, transparent);"><span class="dz-t-icon" style="background: oklch(0.60 0.11 155);"></span></div>
        <div class="dz-t-app" style="background: color-mix(in oklch, oklch(0.70 0.115 75) 12%, white); border-color: color-mix(in oklch, oklch(0.70 0.115 75) 26%, transparent);"><span class="dz-t-icon" style="background: oklch(0.70 0.115 75);"></span></div>
        <div class="dz-t-app" style="background: color-mix(in oklch, oklch(0.62 0.13 18) 12%, white); border-color: color-mix(in oklch, oklch(0.62 0.13 18) 26%, transparent);"><span class="dz-t-icon" style="background: oklch(0.62 0.13 18);"></span></div>
        <div class="dz-t-app dz-t-more">+ more</div>
      </div>
    </div>

    <div class="dz-t-rest">held up by the three pillars</div>

    <!-- Pillars -->
    <div class="dz-t-pillars">
      <div class="dz-t-col dz-core">
        <div class="dz-t-col-cap"></div>
        <div class="dz-t-col-num">Pillar 01 · Active</div>
        <div class="dz-t-col-name">FHIR Foundations</div>
        <div class="dz-t-col-desc">FHIR-native core libraries</div>
        <div class="dz-t-blocks" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i></div>
      </div>
      <div class="dz-t-col dz-toolkit">
        <div class="dz-t-col-cap"></div>
        <div class="dz-t-col-num">Pillar 02 · Active</div>
        <div class="dz-t-col-name">Reference Toolkit</div>
        <div class="dz-t-col-desc">Multiplatform, AI-ready</div>
        <div class="dz-t-blocks" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i></div>
      </div>
      <div class="dz-t-col dz-ai">
        <div class="dz-t-col-cap"></div>
        <div class="dz-t-col-num">Pillar 03 · Launching</div>
        <div class="dz-t-col-name">AI Commons</div>
        <div class="dz-t-col-desc">Safe, verifiable AI · with the WHO</div>
        <div class="dz-t-blocks" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i></div>
      </div>
    </div>

    <div class="dz-t-rest">grounded in</div>

    <!-- Open standards plinth -->
    <div class="dz-t-base">
      <div class="dz-text">
        <div class="dz-ll">The base</div>
        <div class="dz-lt">Open standards</div>
      </div>
      <div class="dz-t-chips">
        <span>HL7® FHIR®</span><span>MCP</span><span>Skills</span>
      </div>
    </div>
  </div>
</div>
```

---

## Edit 3 — Responsive tweak

In the `@media (max-width: 860px)` block, the `.stack-vis` rule sets `max-width: 460px`. Bump it to give the wider 3-column temple room:

```css
.stack-vis { max-width: 560px; }
```

---

## Verify

- Hero shows: an **Apps & solutions** roof with a row of colored app tiles + "+ more", a **"held up by the three pillars"** connector, three pillar columns, a **"grounded in"** connector, and a dark **Open standards** plinth with `HL7® FHIR® / MCP / Skills` chips.
- Pillar statuses read **01 · Active**, **02 · Active**, **03 · Launching**.
- Each pillar's six blocks use that pillar's own color (blue / teal / violet), top row solid, bottom row faded.
- No leftover references to `.stack-card`, `.stack-layer`, `.layer-*`, `.stack-connect`, or `.stack-float` anywhere in `index.html`.
- No new console errors; scroll-reveal (`.reveal.in`) and the rest of the page are unchanged.
