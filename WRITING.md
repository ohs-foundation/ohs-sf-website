# Managing the site's content

How to change anything on ohs.foundation: blog posts, members, events, projects, and the text on every page. You don't need to know Hugo; you edit plain text files, commit, and Netlify publishes the result within a minute or two.

**Contents**

1. [How editing works](#1-how-editing-works)
2. [Across the whole site](#2-across-the-whole-site): menu, footer, newsletter band, links and emails, page titles, share image
3. [Home page](#3-home-page)
4. [Foundation page](#4-foundation-page)
5. [Projects page](#5-projects-page)
6. [Community page](#6-community-page), including events
7. [Blog](#7-blog)
8. [Members](#8-members)
9. [Welcome and 404 pages](#9-welcome-and-404-pages)
10. [Quick reference](#10-quick-reference)
11. [When something goes wrong](#11-when-something-goes-wrong)

---

## 1. How editing works

Content lives in three kinds of files:

| Kind | Where | How easy |
|---|---|---|
| **Data files** (YAML) | `data/*.yaml`, `hugo.toml` | Easy: lists of name/value pairs. Projects, members, events, home page labels, shared links. |
| **Content files** (Markdown) | `content/` | Easy: blog posts, plus each page's title and search/share description. |
| **Page templates** (HTML) | `layouts/` | Edit with care: the fixed wording of each page (headings, paragraphs, buttons). |

### Editing text in a page template

Most of the wording on the Foundation, Community and Home pages is written straight into the page's HTML template. Changing it is safe if you only change the words:

1. Open the template listed for that section in this guide, and search for a few words of the sentence you want to change. Each section also starts with a comment such as `<!-- GOVERNANCE -->`.
2. Change **only the text between the tags**. Leave everything inside `<` `>` alone, and anything inside `{{` `}}`.
3. Write `&amp;` for "&". Other characters (— · ’ “ ” ®) can be typed as normal.
4. A sentence may wrap over several lines in the file. That's fine; line breaks inside a paragraph don't show on the site.

```html
<h3>Balanced board</h3>                 ← change "Balanced board"
<p>A capped board size balances …</p>   ← change the sentence, keep <p> and </p>
```

### Editing a YAML data file

- Indent with **spaces, never tabs**, and keep each line at the same indentation as its neighbours.
- Text containing a colon followed by a space (`: `), or starting with a quote or `#`, must be wrapped in double quotes: `title: "GDHF '26: Bangkok"`.
- A line starting with `#` is a comment, a note for people that the site ignores.
- A list item starts with `- `. To add one, copy an existing item, including all of its indented lines.

### Preview, then publish

```bash
hugo server            # → http://localhost:1313, refreshes as you save
hugo server -e demo    # the same, plus sample members and sample posts
```

Commit and push to `main` to publish. To check a change first, push a branch and open a pull request; Netlify adds a preview link to it. If the build fails, the live site stays as it was (see [section 11](#11-when-something-goes-wrong)).

---

## 2. Across the whole site

| To change… | Edit | Notes |
|---|---|---|
| **Top menu** (Foundation, Projects, Community, Blog) and the **Become a member** button | `layouts/_partials/header.html` | The list of menu items is at the top of the file. The mobile menu uses the same list. |
| **Footer** text and links | `layouts/_partials/footer.html` | The "Projects" column is built automatically from the pillar names in `data/pillars.yaml`. |
| **"Stay in the loop" band** above the footer (most pages) | `layouts/_partials/newsletter-band.html` | Its button goes to the sign-up form on the Community page. |
| **Contact emails**: general (hello@), membership, project proposals | `hugo.toml` → `[params.contact]` | Used everywhere these addresses appear. |
| **Discord invite, community calendar, GitHub, governance docs, LFX "Join now" link** | `hugo.toml` → `[params.links]` | Change once and every page updates. |
| **Newsletter / working-group sign-up forms** | `hugo.toml` → `[params.emailOctopus]` | These are the EmailOctopus form IDs. The form fields, consent text and thank-you message are edited in EmailOctopus, not here. |
| **Browser-tab title and search/share description** of a page | The page's file in `content/`: `foundation.md`, `projects.md`, `community.md`, `blog/_index.md`, `_index.md` (home) | `title:` becomes "Title — Open Health Stack Software Foundation"; `description:` is what Google and LinkedIn show. The home page tab title is `pageTitle:` in `content/_index.md`. |
| **Default share image** (what LinkedIn and Slack show for pages other than blog posts) | Replace `assets/images/og-default.png` | Keep the same name; 1200 × 630 px. |
| **Site icon** in the browser tab | `static/favicon.svg` (and `static/apple-touch-icon.png`, 180 × 180, for phones) | |
| **Short links** such as `ohs.foundation/get-involved` | `netlify.toml` → the `[[redirects]]` blocks | Copy an existing block to add another. |

---

## 3. Home page

`https://ohs.foundation/`, top to bottom:

| Section | Edit | What's there |
|---|---|---|
| **"New" pill** above the headline | `data/home.yaml` → `announcement:` | `tag`, `text`, `url`. Delete the whole block to hide the pill. |
| **Headline, intro paragraph, the two buttons, "Hosted by the Linux Foundation" badge** | `layouts/home.html`, under `<!-- ===== HERO ===== -->` | The headline's coloured part is the `<span class="grad">…</span>`. |
| **Diagram** on the right (Apps & solutions → three pillars → Open standards) | Labels: `data/home.yaml` → `diagram:`. Pillar names, statuses and one-line descriptions: `data/pillars.yaml` (`name`, `status`, `home.diagramDesc`) | `baseChips` are the "HL7® FHIR® / MCP / Skills" chips; `appTileColors` are the small app tiles. |
| **"Three pillars" heading and intro** | `data/home.yaml` → `pillarsSection:` | |
| **The three pillar cards** | `data/pillars.yaml`, the `home:` block of each pillar | `heading`, `body`, `bullets` (the ticked lines), `linkLabel`. The tag line "Pillar 01 · FHIR Foundations · Active" comes from `num`, `name` and `status`. |
| **"Why a foundation"** (four cards) | `layouts/home.html`, under `<!-- ===== WHY A FOUNDATION ===== -->` | |
| **Premier members strip** | `data/members.yaml` | Appears automatically once there are members in a tier marked `showOnHome: true`. Its small label and heading are the `home:` block at the top of that file. See [Members](#8-members). |
| **"The ask" purple band** ("Help us build the future…") | `layouts/home.html`, under `<!-- ===== CTA ===== -->` | |

---

## 4. Foundation page

`/foundation.html`. Everything except the members directory is in **`layouts/foundation.html`**; look for these comments:

| Section | Comment in the template |
|---|---|
| Hero: "An independent, community-owned software foundation." | `<!-- HERO -->` |
| Mission: "Catalyze sustainable, next-gen digital health solutions." | `<!-- NORTH STAR / MISSION -->` |
| Charter: the four commitments, plus "The boundary" | `<!-- CHARTER -->` |
| Governance: External Advisory Council, Balanced board | `<!-- GOVERNANCE -->` |
| "Why this model" (four cards) | `<!-- WHY THIS MODEL -->` |
| Membership tiers and prices (Premier, General, Associate, Inclusive, Sponsorships or grants) | `<!-- MEMBERSHIP -->` |
| Governance docs box, plus the **Join now** / **Get in touch** buttons | `<!-- GOVERNANCE DOCS CALLOUT -->`. The links themselves are in `hugo.toml` (`governanceDocs`, `lfxEnrollment`, `contact.membership`). |
| **"Our members"** directory at the bottom (`/foundation.html#members`) | `data/members.yaml`, see [Members](#8-members) |

The membership tiers described in this page's text (prices and benefits) and the tier names in `data/members.yaml` (used to group member logos) are separate. Keep them consistent when tiers change.

---

## 5. Projects page

`/projects.html`

| Section | Edit |
|---|---|
| Hero: "Three pillars. Many building blocks." | `layouts/projects.html`, under `<!-- HERO -->` |
| Each **pillar band** (tag line, heading, description, "View collection on GitHub" link) | `data/pillars.yaml`, the `projects:` block of each pillar (`heading`, `body`, `collectionUrl`; delete `collectionUrl` to hide the GitHub link) |
| The **project cards** | `data/pillars.yaml` → `projects:` → `items:` |
| "Get involved" band at the bottom | `layouts/projects.html`, under `<!-- GET INVOLVED -->` |

### Add, change or remove a project card

Copy an existing item under the right pillar's `items:` and edit it:

```yaml
    - name: FHIR Info Gateway
      kind: Gateway                     # small tag at the top of the card
      icon: shield                      # see the list below
      description: >-
        A privacy-preserving access layer that ensures only relevant
        healthcare workers can reach the patient data they need.
      status: Active                    # text next to the coloured dot
      statusStyle: active               # dot colour: active, maintenance, incubating, proposed
      tech: Java · Proxy                # optional
      link: https://github.com/ohs-foundation/fhir-gateway
      linkLabel: View repository
```

- `icon`: one of `layers`, `search`, `monitor`, `phone`, `shield`, `chart`, `desktop`, `pulse`, `checkbox`, `hub`, `plus`.
- `description: >-` lets a long description wrap over several lines in the file. Indent its lines a little further, as shown.
- Links starting with `http` get the "external" arrow; links within the site (`/community.html#involved`) get the plain arrow.
- `openCall: true` gives the dashed "Propose an initiative" card style.
- Cards appear in the order listed. To remove one, delete the item and all its indented lines.

### Change a pillar's name or status

Edit `name` or `status` in `data/pillars.yaml`. That updates the home page diagram, the pillar cards, the Projects page and the footer together. The AI Commons entry also has a `projectsStatus:` line, which overrides the status on the Projects page only (it currently says "Launching soon" there and "Launching" elsewhere). Delete that line to use one wording everywhere.

---

## 6. Community page

`/community.html`. Text is in **`layouts/community.html`**:

| Section | Comment in the template |
|---|---|
| Hero: "A global movement for open digital health." | `<!-- HERO -->` |
| "Show up. Join the conversation." (monthly calls, Discord) | `<!-- JOIN THE COMMUNITY -->` |
| "Four ways to build with us" | `<!-- GET INVOLVED -->` |
| Working-group sign-up (text above the form) | `<!-- WORKING GROUP SIGN-UP … -->` |
| Events: heading, intro, calendar button, filter buttons | `<!-- EVENTS -->` |
| "Help build the future…" purple band | `<!-- CONTRIBUTOR CTA -->` |
| Newsletter sign-up at the bottom | `<!-- NEWSLETTER SIGNUP … -->` |

### Events

- **Community calls and working-group meetings appear automatically** from the public community Google Calendar. Add, move or cancel them in Google Calendar and the site follows within about 10 minutes. Events with "Community call" in the title are labelled *Community call*; online events are labelled *Working group*; events with a physical address are labelled *In-person*.
- **Conferences and other one-off events** you want pinned to the list go in `data/events.yaml`:

```yaml
pinned:
  - title: "Global Digital Health Forum '26"
    when: "2–4 Dec 2026"          # shown exactly as written
    endDate: 2026-12-04           # the row disappears after this day
    location: "Bangkok, Thailand"
    category: in-person           # in-person, community or working-group
    note: "Optional text. [Links](mailto:hello@ohs.foundation) are allowed."
```

---

## 7. Blog

### Write a post

**1. Create a folder** in `content/blog/`. **The folder name becomes the URL**, so use short lowercase words joined by dashes:

```
content/blog/gdhf-2026-recap/      →  https://ohs.foundation/blog/gdhf-2026-recap.html
  index.md          ← the post
  cover.jpg         ← cover image, 2400 × 1260 px
  panel-photo.jpg   ← any other images
```

File names are case-sensitive (`Cover.JPG` isn't `cover.jpg`); lowercase names without spaces are safest. If you have Hugo installed, `hugo new content blog/gdhf-2026-recap` creates the folder and `index.md` from the template.

**2. Start `index.md` with this block** (iA Writer and Ulysses show it as plain text, which is fine):

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
| `date` | The date shown on the post, `YYYY-MM-DD`. Posts are ordered by it, and the newest one is featured at the top of the blog page. Publishing is controlled by `draft`, not by the date. |
| `author` | Shown as "By …". |
| `category` | A short label such as *Foundation news*, *Events* or *Releases*, shown as a tag. |
| `summary` | The teaser on the blog page and the description in LinkedIn and Slack previews. |
| `cover` | File name of the cover image in the post folder (JPG, PNG or WebP). Strongly recommended: it's the picture on the blog page and in LinkedIn previews. Without one, the blog page shows the default illustration. If the file named here is missing, the build stops with a message saying so. |
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
| `coverFocus` | Which part of the cover to keep if it isn't 1.91 : 1 and has to be trimmed on the blog page and in LinkedIn previews: `center` (default), `top`, `bottom`, `left`, `right`, `top-left`, `top-right`, `bottom-left` or `bottom-right`. |

**3. Write the post in Markdown:**

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

Video:

```markdown
{{< youtube dQw4w9WgXcQ >}}        ← the ID from the YouTube URL
{{< vimeo 123456789 >}}
{{< video src="clip.mp4" caption="Short clip" >}}   ← a small file in the post folder
```

Use YouTube or Vimeo for anything longer than a few seconds, because large video files slow down the repository. Large photos are fine; the site resizes and compresses them automatically.

**4. Preview** with `hugo server` (then open `/blog.html`; add `-D` to include drafts). **5. Publish**: set `draft: false`, commit and push.

### Cover image size

Make covers **2400 × 1260 px**: any image at the 1.91 : 1 shape works, but it should be at least 1200 × 630. That's the shape LinkedIn uses for link previews, and the blog page uses the same shape, so an image of this shape is never cropped anywhere.

- **On the post page** the cover is always shown whole, whatever its shape.
- **On the blog page and in LinkedIn previews** a cover of a different shape is trimmed to fit, evenly from the centre by default. Use `coverFocus` to keep a different part.

### Sharing on LinkedIn

Paste the post's URL into a LinkedIn post. The preview card (cover, title and summary) is filled in automatically, and every post also has a **LinkedIn** share button at the bottom. LinkedIn caches previews: if you change the cover or summary after sharing, paste the URL into the [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/) to refresh it. The blog's RSS feed is at `/feed.xml`.

### Other blog text

| To change… | Edit |
|---|---|
| The blog page heading ("News, releases and notes from the foundation.") and intro | `layouts/blog/section.html`, under `<!-- ===== HERO ===== -->` |
| The purple "A place for everyone who builds." band at the end of every post | `layouts/blog/page.html`, under `<!-- ===== CTA ===== -->` |
| The home page "New" pill pointing at a post | `data/home.yaml` → `announcement:` |

---

## 8. Members

Members appear in two places:
- a logo strip on the **home page**, for tiers marked `showOnHome: true` (currently Premier);
- the **"Our members"** directory on the **Foundation page**, for all tiers, grouped by tier.

Both are hidden while there are no members. Everything is in `data/members.yaml`.

### Add a member

1. Put the logo in `assets/members/`. SVG is best; PNG, JPG and WebP work too (transparent background, at least 140 px tall). Use a lowercase name without spaces.
2. Add an entry under `members:`. If the file says `members: []` (an empty list), replace that line:

```yaml
members:
  - name: Example Health          # shown under the logo; also the logo's alt text
    tier: premier                 # a tier id from the tiers list
    url: https://example.org      # optional: makes the card a link
    logo: example-health.svg      # optional: without it, the initials are shown
```

- Within a tier, members appear in the order listed.
- **Without a `url`** the card isn't clickable. **Without a `logo`** the card shows the organisation's initials.
- To remove a member, delete its entry (the `- name:` line and the lines under it), and its logo file if it's no longer needed.

### Tiers

The `tiers:` list at the top of the file sets the tier names, their order, and which tiers appear on the home page:

```yaml
tiers:
  - id: premier          # what members' `tier:` refers to (lowercase, no spaces)
    name: Premier        # the label shown on the site
    showOnHome: true     # include this tier in the home page strip
  - id: gold
    name: Gold
```

Rename, add or reorder tiers freely. If you change an `id`, update the members that use it. The label and heading of the home page strip are the `home:` block in the same file.

To see the sections with sample members, run `hugo server -e demo` (it reads `data/members_demo.yaml` instead).

---

## 9. Welcome and 404 pages

| Page | Edit | Notes |
|---|---|---|
| `/welcome-to-community.html`: "Welcome to the community." with steps for new subscribers | `layouts/welcome.html` | Not linked from the site menus and hidden from search engines; it's meant as the page new subscribers are sent to (set in EmailOctopus). |
| The "page not found" page | `layouts/404.html` | Shown for any address that doesn't exist. |

The welcome **email** that EmailOctopus sends is kept in `email-templates/welcome-email.html` for reference. Changing that file doesn't change the email; edit it in EmailOctopus.

---

## 10. Quick reference

| I want to… | Edit |
|---|---|
| Publish a blog post | New folder in `content/blog/` ([section 7](#7-blog)) |
| Add or remove a member | `data/members.yaml` + logo in `assets/members/` |
| Rename membership tiers used for member logos | `data/members.yaml` → `tiers:` |
| Change membership prices or benefits | `layouts/foundation.html` → `<!-- MEMBERSHIP -->` |
| Add or edit a project card | `data/pillars.yaml` → `items:` |
| Rename a pillar or change its status | `data/pillars.yaml` → `name` / `status` |
| Change the home page "New" pill | `data/home.yaml` → `announcement:` |
| Change the home page headline | `layouts/home.html` → `<!-- ===== HERO ===== -->` |
| Pin a conference to the events list | `data/events.yaml` |
| Change a regular call's time | Google Calendar (the site updates itself) |
| Change the Discord invite or calendar link | `hugo.toml` → `[params.links]` |
| Change a contact email | `hugo.toml` → `[params.contact]` |
| Change a menu or footer link | `layouts/_partials/header.html` / `footer.html` |
| Change how a page looks in Google or LinkedIn | `description:` in its `content/*.md` file |
| Add a short link like `/get-involved` | `netlify.toml` → `[[redirects]]` |

---

## 11. When something goes wrong

If a change has a mistake that would break the site, **the build stops and the live site stays as it was**. In a pull request, the Netlify check turns red; on `hugo server`, the error is shown in the terminal and the browser. The message says which file is wrong. Common ones:

| Message | Fix |
|---|---|
| `cover image "cover.jpg" not found next to the post's index.md` | The file name in `cover:` doesn't match the file in the post folder. Check the spelling and case. |
| `image "photo.jpg" not found next to index.md` | Same problem for an image in the post text. |
| `has tier "Premier", which isn't one of the tier ids` | The member's `tier:` must match an `id` in the tiers list exactly, including upper/lower case. |
| `logo "x.svg" (for "…") not found in assets/members/` | The logo file is missing or its name is spelled differently. |
| `coverFocus "middle" isn't one of: …` | Use one of the listed values. |
| `failed to load data: "…/events.yaml:2:12" … mapping value is not allowed` or `… found character that cannot start any token` | A formatting slip in that YAML file, at the line and column shown (here line 2, column 12): usually a colon in unquoted text (wrap the text in double quotes), a tab instead of spaces, or uneven indentation. |

Other things to check:
- **A post doesn't appear.** It probably still says `draft: true`.
- **LinkedIn shows an old preview.** Refresh it in the [Post Inspector](https://www.linkedin.com/post-inspector/).
- **The events list says it couldn't load.** That's normal under `hugo server`, because the events come from a Netlify function. They load on Netlify previews and on the live site.
