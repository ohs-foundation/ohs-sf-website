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
| `content/` | Pages. `content/blog/<post>/index.md` is one blog post (with its images beside it) |
| `data/members.yaml` | Member organisations and tiers (home page strip + Foundation page directory) |
| `data/pillars.yaml` | The three pillars and their projects (home page cards and diagram, Projects page, footer) |
| `data/home.yaml` | Home page announcement pill, hero diagram labels, pillars intro |
| `data/events.yaml` | Events pinned to the Community page (recurring calls come from the Google Calendar) |
| `hugo.toml` | Site settings, plus shared links and emails (`[params]`): Discord, calendar, contacts, EmailOctopus form IDs |
| `layouts/` | Templates. `baseof.html` is the page shell; `_partials/` holds the header, footer, newsletter band and `<head>` (SEO and social-share tags) |
| `layouts/_markup/`, `layouts/_shortcodes/` | How Markdown renders (headings, links, images) and the extra post components (`pillars`, `closer`, `video`) |
| `assets/css/main.css` | Design system and shared styles; `assets/css/pages/*.css` hold page-specific styles |
| `assets/js/app.js` | Small vanilla JS: mobile nav, scroll reveal, community events, share buttons |
| `assets/images/og-default.png` | Default image shown when a page is shared (1200×630) |
| `assets/members/` | Member logos |
| `netlify/functions/community-events.js` | Reads the public community calendar (ICS) and returns upcoming events as JSON for the Community page |
| `email-templates/` | Source of the EmailOctopus welcome email (not published on the site) |
| `demo/`, `config/demo/`, `data/members_demo.yaml` | Sample content used only by `hugo server -e demo` |
| `tests/` | Tests for the events function (`node --test`) |

## Conventions

- **URLs are stable.** Pages are served as `/foundation.html`, `/blog/<post>.html` and so on (`uglyURLs`) so links already in emails and social posts keep working. Keep a post's folder name once it's published, because the folder name is its URL.
- **Shared links go in one place.** Contact emails, Discord, calendar and governance links live in `hugo.toml` `[params]`. Templates read them from there instead of hard-coding them.
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
