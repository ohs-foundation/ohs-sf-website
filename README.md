# Open Health Stack Software Foundation — Website

Marketing and informational website for the Open Health Stack Software Foundation — an independent, community-owned software foundation hosted by the Linux Foundation, building open-source building blocks for next-gen, AI-powered global digital health.

## Local preview

No build step required. Open any page directly in a browser:

```bash
open index.html
```

Or serve locally to avoid any `file://` quirks:

```bash
npx serve .
# → http://localhost:3000
```

## Pages

| File | Page |
|---|---|
| `index.html` | Home |
| `foundation.html` | Foundation (mission, charter, governance, membership) |
| `projects.html` | Projects (pillars, sub-projects, steering committees) |
| `community.html` | Community (get involved, events, channels) |

Shared: `styles.css` (design system + all page styles), `app.js` (vanilla JS interactions).

## Tech stack

- Framework-free static HTML/CSS/JS — no bundler, no dependencies
- Fonts via Google Fonts CDN (Hanken Grotesk + IBM Plex Mono)
- All icons are inline SVG; all decorative elements are pure CSS

## Deployment

Pushes to `main` automatically deploy to GitHub Pages via `.github/workflows/pages.yml`.

## License

Apache-2.0 — see [LICENSE](LICENSE).
