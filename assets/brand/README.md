# Official logo files

From the OHS-SF Brand Guidelines v1.0 logo export (September 2026). The full
export (PNG banners, stickers, stacked versions) lives outside this repo; ask
the foundation for it.

| File | Use |
|---|---|
| `ohs-logo-horizontal.svg` | Horizontal lockup, full colour: white or near-white backgrounds |
| `ohs-logo-horizontal-reversed.svg` | Horizontal lockup, reversed: Ink or indigo backgrounds |
| `ohs-mark.svg`, `ohs-mark-reversed.svg` | The mark on its own (below 140 px wide, use the mark only) |

The files are unchanged apart from removing an embedded content-credentials
(C2PA) block, which only added size.

The site doesn't link these files directly. `layouts/_partials/logo-sprite.html`
reads `ohs-logo-horizontal.svg` and `ohs-mark.svg` at build time and writes the
shapes into each page once, with the colours as CSS variables (`--logo-*` in
`assets/css/main.css`). That gives both official versions from one copy:
full colour by default, reversed inside an element with the class
`logo-reversed`.

From the guidelines: don't stretch, recolour or rotate the logo, keep clear
space around it equal to one square of the mark, and don't use the lockup
narrower than 140 px.
