# Fonts

The site serves its own copies of its two fonts instead of loading them from
Google Fonts. That's faster on a first visit (no extra connections to Google,
and the page no longer waits for Google's stylesheet before it can draw), and
visitors' browsers don't contact Google.

| Family | Files | Licence |
|---|---|---|
| Hanken Grotesk (variable, weights 100–900, normal and italic) | `hanken-grotesk-*-wght-*.woff2` | SIL Open Font License 1.1, `OFL-HankenGrotesk.txt` |
| IBM Plex Mono (weights 400, 500, 600) | `ibm-plex-mono-*-normal.woff2` | SIL Open Font License 1.1, `OFL-IBMPlexMono.txt` |

Each family comes in two parts: `latin` (English and Western European) and
`latin-ext` (other Latin-script languages). Browsers only download the
`latin-ext` file if a page actually uses one of its characters.

The files are the same ones Google Fonts serves, taken from the Fontsource
npm packages `@fontsource-variable/hanken-grotesk` 5.3.0 and
`@fontsource/ibm-plex-mono` 5.3.0.

`layouts/_partials/fonts.html` writes the `@font-face` rules. It also defines
the "fallback" fonts: a local Arial or Courier New, resized to take up the same
space as the real fonts, so the text doesn't jump when the real font arrives.
If you ever swap in a different font, those fallback numbers need
recalculating.

Hugo adds a content hash to each file name when it publishes them, so browsers
can cache them for a year (see `netlify.toml`).
