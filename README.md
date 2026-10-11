# Open Health Stack Software Foundation — Website

Source for [ohs.foundation](https://ohs.foundation): the website of the Open Health Stack Software Foundation, an independent, community-owned software foundation hosted by the Linux Foundation.

The site is static. [Hugo](https://gohugo.io) builds it from templates, Markdown and a few YAML data files, and Netlify publishes the result. It has no CMS, database or server.

**Writing a blog post or adding a member?** See [WRITING.md](WRITING.md). It's written for people who don't need to touch code.

## Run it locally

```bash
brew install hugo          # macOS; Hugo 0.166+ "extended" (see netlify.toml for the exact version)
hugo server                # → http://localhost:1313, reloads as you edit
hugo server -e demo        # same, plus sample members and sample blog posts
```

`hugo` on its own builds the site into `public/`.

## Where things live

| Path | What it is |
|---|---|
| `content/*.md` | One file per page. **All of a page's text** lives in its front matter, as YAML grouped by section (`hero`, `governance`, `membership`, …); the templates only hold layout. `content/blog/<post>/index.md` is one blog post, with its images beside it |
| `data/pillars.yaml` | The three pillars and their projects (home cards and diagram, Projects page, footer) |
| `data/members.yaml` | Member organisations and tiers (home page strip + Foundation page directory) |
| `data/events.yaml` | Events pinned to the Community page (recurring calls come from the Google Calendar) |
| `hugo.yaml` | Site settings, menus (`menus.main`, `menus.footer*`), site-wide text (`params.header`, `newsletter`, `footer`, `notFound`), shared links and emails (`params.links`, `params.contact`) and the EmailOctopus form IDs |
| `i18n/en.yaml` | Interface labels used by templates ("Latest", "Share this post", …) |
| `layouts/` | Templates (layout only, no copy). `baseof.html` is the page shell; one template per page; `_partials/` holds the header, footer, newsletter band, `<head>` (SEO and share tags), `chip.html` (icon library), `button.html` and `url.html` (resolves `@discord`-style shared links) |
| `layouts/_markup/`, `layouts/_shortcodes/` | How Markdown renders (headings, links, images) and the extra post components (`pillars`, `closer`, `video`) |
| `assets/css/main.css` | Design system and shared styles; `assets/css/pages/*.css` hold page-specific styles |
| `assets/js/app.js` | Small vanilla JS: mobile nav, scroll reveal, community events, share buttons |
| `assets/images/og-default.png`, `og-blog-default.jpg` | Default images shown when a page / a blog post is shared (set in `hugo.yaml` → `params.ogImage`, `blogShareImage`) |
| `assets/members/` | Member logos |
| `netlify/functions/community-events.js` | Reads the public community calendar (ICS) and returns upcoming events as JSON for the Community page |
| `email-templates/` | Source of the EmailOctopus welcome email (not published on the site) |
| `demo/`, `config/demo/`, `data/members_demo.yaml` | Sample content used only by `hugo server -e demo` |
| `tests/` | Tests for the events function (`node --test`) |

## Conventions

- **URLs are stable.** Pages are served as `/foundation.html`, `/blog/<post>.html` and so on (`uglyURLs`) so links already in emails and social posts keep working. Keep a post's folder name once it's published, because the folder name is its URL.
- **Content stays out of templates.** Page text goes in the page's front matter, lists shared between pages in `data/`, site-wide text and menus in `hugo.yaml`. A template change should only ever be a layout or design change.
- **Shared links go in one place.** Contact emails, Discord, calendar and governance links live in `hugo.yaml` → `params`. Content refers to them as `@discord`, `@email:general` etc. (resolved by `layouts/_partials/url.html`), so nothing is hard-coded twice.
- **No build tooling beyond Hugo.** There's no npm install and no bundler. Hugo minifies and fingerprints the CSS and JS itself.
- **Design.** The fonts are Hanken Grotesk and IBM Plex Mono, and colours are defined as tokens in `main.css` `:root`. The `--teal*` variables actually hold the indigo signature colour; the names predate a palette change.

## Deployment

Netlify builds every push (`netlify.toml`):

- `main` deploys to production at ohs.foundation.
- Each pull request gets a **Deploy Preview** URL. Previews are marked `noindex`, and their share tags point at the preview itself.
- The Hugo version is pinned in `netlify.toml`. Bump it on purpose and check the build when you do.

Short links (such as `/get-involved`) and caching headers are also set in `netlify.toml`.

## Tests

```bash
node --test        # events function: weekly/monthly series, cancelled and moved occurrences, …
```

## License

Apache-2.0. See [LICENSE](LICENSE).
