# Updating the site: posts, members, events

Everything on this page is done by editing plain text files: Markdown for posts, YAML for lists. Commit the change and Netlify publishes it within a minute or two. To check a change before it goes live, open a pull request: Netlify posts a preview link on it.

---

## Write a blog post

### 1. Create the post folder

In `content/blog/`, create a folder for the post. **The folder name becomes the URL**, so use short, lowercase words joined by dashes:

```
content/blog/gdhf-2026-recap/      →  https://ohs.foundation/blog/gdhf-2026-recap.html
```

Inside it, put:

- `index.md`, the post itself (template below)
- `cover.jpg` (or `.png`), the cover image
- any other images the post uses

```
content/blog/gdhf-2026-recap/
  index.md
  cover.jpg
  panel-photo.jpg
```

If you have Hugo installed, `hugo new content blog/gdhf-2026-recap` creates the folder and `index.md` from the template for you.

### 2. Start `index.md` with this block

Copy this to the top of the file and fill it in. iA Writer and Ulysses show it as plain text, which is fine.

```markdown
---
title: "GDHF 2026: what we heard in Bangkok"
date: 2026-12-08
author: "Fred Hersch"
category: "Events"
summary: "One or two sentences. Shown on the blog page and as the preview text when the post is shared on LinkedIn."
cover: cover.jpg
coverAlt: "The OHS community gathering at GDHF 2026"
draft: false
---
```

| Field | What it does |
|---|---|
| `title` | The post title. Keep the quotes. |
| `date` | Publication date, `YYYY-MM-DD`. The newest post is featured at the top of the blog page. **A future date won't appear until the site is rebuilt on or after that day**, so use today's date to publish now. |
| `author` | Shown as "By …". |
| `category` | A short label such as *Foundation news*, *Events* or *Releases*, shown as a tag. |
| `summary` | The teaser on the blog page and the description in LinkedIn and Slack previews. |
| `cover` | File name of the cover image in the post folder. Required: the build stops with a clear message if the file is missing. |
| `coverAlt` | A short description of the cover image for screen readers. |
| `draft` | `true` keeps the post off the live site; `false` publishes it. |

Optional extras:

| Field | What it does |
|---|---|
| `subtitle` | A longer line under the title on the post page. Defaults to `summary`. |
| `badge` | The chip next to the author on the post page. Defaults to `category`. |
| `shortTitle` | A shorter title for the browser tab. |
| `readMore` | The link text on the blog page card. Defaults to "Read the post". |
| `coverCaption` | A caption shown under the cover image. |

### 3. Write the post in Markdown

```markdown
**Start with a bold sentence.** It's styled as the post's lead-in.

Normal paragraphs, **bold**, *italic*, [a link](https://example.org).

## A section heading

## A heading with a small label above it {kicker="What we're building"}

- **Bullet lists** get the site's left-rule style.
- **Start items with bold text** for a definition-list feel.

1. Numbered lists work too.

![What the image shows](panel-photo.jpg "Optional caption under the image")

> A sentence worth pulling out. It renders as a large pull quote.
>
> — Who said it
```

**Video:**

```markdown
{{< youtube dQw4w9WgXcQ >}}        ← the ID from the YouTube URL
{{< vimeo 123456789 >}}
{{< video src="clip.mp4" caption="Short clip" >}}   ← a small file in the post folder
```

Use YouTube or Vimeo for anything longer than a few seconds, because large video files slow down the repository.

**Images:** large photos are fine. The site resizes and compresses them automatically. For the cover, a landscape image at least 1600 px wide works best. It's cropped to 1200×630 for LinkedIn and to 4:3 on the blog page, so keep the important part near the centre.

### 4. Preview (optional)

```bash
hugo server            # then open http://localhost:1313/blog.html
```

Drafts are hidden there too. Run `hugo server -D` to include them.

### 5. Publish

Set `draft: false`, then commit and push to `main`. Or open a pull request first to get a preview link.

### Sharing on LinkedIn

Paste the post's URL into a LinkedIn post. The preview card (cover image, title and summary) is filled in automatically, and every post also has a **LinkedIn** share button at the bottom. LinkedIn caches previews: if you change the cover or summary after sharing, paste the URL into the [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/) to refresh it.

The blog also has an RSS feed at `/feed.xml`, if you ever want a tool to post new articles automatically.

### Pointing the home page pill at a new post

The "New" pill above the home page headline is set in `data/home.yaml` under `announcement:`. Change the text and URL, or delete the block to hide it.

---

## Add or change a member

Edit `data/members.yaml`.

1. Put the logo file in `assets/members/`. SVG is best; PNG, JPG and WebP work too, preferably with a transparent background.
2. Add an entry under `members:`:

```yaml
members:
  - name: Example Health
    tier: premier
    url: https://example.org
    logo: example-health.svg
```

- Within a tier, members appear in the order they're listed.
- Without a `logo`, the organisation's initials are shown instead.
- The `tiers:` list at the top sets the tier names and their order. Rename or add tiers freely. Members refer to a tier by its `id`, and `showOnHome: true` puts that tier's members in the logo strip on the home page.
- With no members listed, both members sections stay hidden.

To see what it looks like with sample members, run `hugo server -e demo`.

---

## Other things that live in data files

| To change… | Edit |
|---|---|
| A pinned event on the Community page (e.g. a conference) | `data/events.yaml`. Rows hide themselves after `endDate`. |
| A project card, or a pillar's description | `data/pillars.yaml` |
| Contact emails, Discord invite, calendar link, governance doc link | `hugo.toml`, under `[params]` |

Regular community and working-group calls appear automatically from the public community Google Calendar, so there's nothing to edit on the site for those.
