# Managing the site's content

Everything you can read on ohs.foundation is kept in plain text files: Markdown and YAML. You don't need to touch HTML or know Hugo. Edit a file, commit, and Netlify publishes the change within a minute or two.

**Contents**

1. [Where content lives](#1-where-content-lives)
2. [Editing basics](#2-editing-basics): YAML, Markdown, links, icons, preview and publish
3. [Across the whole site](#3-across-the-whole-site): menu, footer, newsletter band, 404, shared links
4. [Home page](#4-home-page) · [Foundation](#5-foundation-page) · [Projects](#6-projects-page) · [Community](#7-community-page) · [Welcome](#8-welcome-page)
5. [Blog](#9-blog)
6. [Members](#10-members)
7. [Quick reference](#11-quick-reference)
8. [When something goes wrong](#12-when-something-goes-wrong)

---

## 1. Where content lives

| File | What's in it |
|---|---|
| `content/_index.md` | Home page text |
| `content/foundation.md` | Foundation page text, including the membership tiers |
| `content/projects.md` | Projects page heading and "Get involved" band |
| `content/community.md` | Community page text |
| `content/welcome-to-community.md` | The page new newsletter subscribers land on |
| `content/blog/_index.md` | Blog page heading, plus the purple band at the end of every post |
| `content/blog/<post>/index.md` | One blog post, with its images beside it |
| `data/pillars.yaml` | The three pillars and every project card (used on Home, Projects and in the footer) |
| `data/members.yaml` | Member organisations and their tiers (Home and Foundation pages) |
| `data/events.yaml` | Conferences pinned to the Community page's event list |
| `hugo.yaml` | Menus, footer, the "Stay in the loop" band, the 404 page, site name, shared links and emails |
| `i18n/en.yaml` | Small interface labels such as "Latest" and "Share this post" |

Each page file in `content/` starts with a block between two `---` lines (the *front matter*). That block holds the page's title, its search and share description, and **all of its text**, organised top to bottom in the order the sections appear on the page. Section names match what you see:

```yaml
---
title: Foundation
description: "An independent, community-owned software foundation …"

hero:                                   ← the big heading at the top
  eyebrow: The next chapter             ← the small label above it
  heading: An independent, community-owned software foundation.
  lead: We're transitioning the current Open Health Stack …

governance:                             ← the "Governance" section
  heading: Balanced voices, transparent decisions.
  cards:                                ← a list: one entry per card
    - icon: users
      color: core
      title: External Advisory Council
      text: Voices from multilaterals, NGOs and Ministries of Health …
---
```

The words used throughout:

- **eyebrow**: the small all-caps label above a heading.
- **heading**: the heading.
- **lead**: the larger intro paragraph under it.
- **text**: an ordinary paragraph.

**The layout and design aren't in these files.** You change what the page says, not how it looks. A section left out of the file simply isn't shown.

---

## 2. Editing basics

### YAML: the rules that matter

- Indent with **spaces, never tabs**. Items in the same list or block line up exactly.
- **Lists** are lines starting with `- `. To add a card, tier or button, copy an existing entry, including all of its indented lines, and edit it. To remove one, delete the entry. Order in the file is order on the page.
- **Long text** can run over several lines after `>-`. Indent the following lines and they're joined into one paragraph:

  ```yaml
  text: >-
    This sentence continues
    on the next line.
  ```

- **Quote text** (`"…"`) if it contains a colon followed by a space or ends with a colon, starts with `@`, `#`, `*`, `[` or a quote, or is a number you want kept as text: `title: "Step 2: Save the calls"`.
- `#` starts a comment, a note to people that the site ignores.
- Short items can sit on one line in braces: `{ label: Join now, url: /community.html }`.

### Markdown inside text

Every `text`, `lead` and `note` field accepts Markdown:

| Write | Get |
|---|---|
| `**bold**` | **bold** |
| `*italic*` | *italic* |
| `[Discord](@discord)` | a link |

### Links

Anywhere a URL goes (`url:` fields, menu items, links in Markdown) you can use:

| Write | Goes to |
|---|---|
| `/projects.html`, `/foundation.html#membership` | a page on this site, or a section of it |
| `#events` | a section of the same page |
| `https://…` | another website |
| `@discord`, `@calendar`, `@github`, `@governanceDocs`, `@lfxEnrollment`, `@linuxFoundation`, `@netlify` | the shared links set in `hugo.yaml` → `params.links` |
| `@email:general`, `@email:membership`, `@email:proposals` | an email to the addresses in `hugo.yaml` → `params.contact` |

With shared links, a change (say, a new Discord invite) is made once in `hugo.yaml` and every page follows. Add your own under `params.links` and use them as `@name`.

### Buttons

```yaml
buttons:
  - { label: Join the community, url: /community.html, style: primary, icon: arrow-right-17 }
  - { label: Explore the repositories, url: "@github", style: ghost, newTab: true }
```

- **style**: `primary` (solid indigo), `ghost` (outlined), `light` (white, for purple bands) or `on-dark` (outlined, for purple bands).
- **icon** (optional): `arrow-right-15`, `arrow-right-16`, `arrow-right-17` or `arrow-right-18` for a plain arrow; `arrow-ext-14` or `arrow-ext-16` for the "opens elsewhere" arrow. The number is the size.
- **newTab: true** (optional): opens an external link in a new tab.

### Icons

Cards with a small rounded icon take `icon:` and an optional `color:`.

- **icon**: `building`, `banknote`, `bulb`, `wrench`, `users`, `balance`, `document`, `x-circle`, `calendar`, `chat`, `code`, `spark`, `globe`, `dollar`, `layers`, `search`, `monitor`, `phone`, `desktop`, `shield`, `chart`, `pulse`, `checkbox`, `hub`, `plus`.
- **color**: `core` (teal-blue), `toolkit` (teal) or `ai` (violet). Leave it out for the default indigo.

An unknown icon name stops the build, and the message lists the valid names.

### Preview, then publish

```bash
hugo server            # → http://localhost:1313, refreshes as you save
hugo server -e demo    # the same, plus sample members and sample blog posts
```

Commit and push to `main` to publish. To check first, push a branch and open a pull request; Netlify adds a preview link. If a change has a mistake, the build stops and the live site stays as it was (see [section 12](#12-when-something-goes-wrong)).

---

## 3. Across the whole site

All in **`hugo.yaml`**:

| To change… | Where in `hugo.yaml` |
|---|---|
| **Top menu** (Foundation, Projects, Community, Blog) | `menus:` → `main:`. Items appear in `weight` order. `identifier` must match the page's name (e.g. `community`) so the menu highlights the page you're on. |
| **Become a member** button in the header | `params:` → `header:` → `button:` |
| **"Stay in the loop" band** above the footer | `params:` → `newsletter:` |
| **Footer** text | `params:` → `footer:` (`about`, `copyright`, `hostedBy`, `poweredBy`) |
| **Footer** columns and links | Column headings: `params:` → `footer:` → `columns:`. Links: `menus:` → `footerFoundation`, `footerProjects`, `footerCommunity`. The Projects column lists the pillars from `data/pillars.yaml` first. |
| **"Page not found"** page | `params:` → `notFound:` |
| **Shared links** (Discord, calendar, GitHub, governance docs, LFX enrolment…) | `params:` → `links:` |
| **Contact emails** | `params:` → `contact:` |
| **Newsletter and working-group sign-up forms** | `params:` → `emailOctopus:`. These are the EmailOctopus form IDs; the form fields, consent text and thank-you messages are edited in EmailOctopus. |
| **Site name** next to the logo in the header and footer | `params:` → `brand:` |
| **Site description** (used when a page has none of its own) | `params:` → `description:` |

Elsewhere:

| To change… | Edit |
|---|---|
| A page's **browser-tab title** and **search/share description** | `title:` and `description:` at the top of its file in `content/`. The home page tab title is `pageTitle:` in `content/_index.md`. |
| **Default share image** (what LinkedIn and Slack show for pages other than blog posts) | Replace `assets/images/og-default.png`, keeping the name; 1200 × 630 px. |
| **Site icon** in the browser tab | `static/favicon.svg` (and `static/apple-touch-icon.png`, 180 × 180, for phones) |
| **Short links** such as `ohs.foundation/get-involved` | `netlify.toml` → the `[[redirects]]` blocks. Copy one to add another. |
| **Small interface labels** ("Latest", "Read the post", "Share this post", "min read", "Loading upcoming events…") | `i18n/en.yaml` |

---

## 4. Home page

**`content/_index.md`**, top to bottom:

| Block | What it is |
|---|---|
| `announcement` | The "New" pill above the headline (`tag`, `text`, `url`). Delete the block to hide it. |
| `hero` | `eyebrow`; `heading` plus `headingAccent` (the coloured end of the headline); `lead`; `buttons`; `badge` ("Hosted by the Linux Foundation") |
| `diagram` | Labels of the diagram beside the headline, the colours of its small app tiles, and the standards chips at its base. The pillar names and short descriptions in it come from `data/pillars.yaml`. |
| `pillars` | Heading and intro of the "Three pillars" section, and its button label. The three cards themselves come from `data/pillars.yaml` (the `home:` block of each pillar). |
| `why` | "Why a foundation": heading, intro and the four cards (`icon`, `title`, `text`) |
| `members` | Heading of the premier-members logo strip. The strip appears once `data/members.yaml` has members in a tier marked `showOnHome: true`. |
| `cta` | The purple "The ask" band: `eyebrow`, `heading`, `lead`, `buttons` |

---

## 5. Foundation page

**`content/foundation.md`**, top to bottom:

| Block | What it is |
|---|---|
| `hero` | Top heading and intro |
| `mission` | "The charter · North star" box |
| `charter` | Heading and intro; `commitments` (the numbered cards, numbered automatically 01, 02, … in list order); `boundary` (the "no complete products" box) |
| `governance` | Heading and intro; `cards`; `docsButton` (the label of the governance docs button; its link is `@governanceDocs`) |
| `model` | "Why this model": heading and `items` |
| `membership` | Heading and intro. `groups` holds the membership options with their prices and benefits: each group has a `label` (e.g. "Standard tiers · Linux Foundation model") and `tiers` (`name`, `meta` for the price line, `text`). `docs` is the governance docs box. `joinButton` and `contactButton` are the button labels. `directory` is the heading of the "Our members" logo section. |

**Example: add a membership option.** Copy a tier under the right group and edit it:

```yaml
        - name: Supporter
          meta: $2k / year · individuals and small teams
          text: >-
            For people who want to back the mission. Includes the supporter newsletter and an
            invitation to the annual community summit.
```

The membership options described here (prices and benefits) are separate from the tiers in `data/members.yaml`, which only group the member logos. Keep the two consistent when tiers change.

---

## 6. Projects page

| Part | Edit |
|---|---|
| Top heading and intro | `content/projects.md` → `hero` |
| "Get involved" band at the bottom | `content/projects.md` → `involved` |
| Each pillar band (tag line, heading, description, GitHub collection link) | `data/pillars.yaml`, the `projects:` block of each pillar |
| The project cards | `data/pillars.yaml` → `projects:` → `items:` |

**Add, change or remove a project card.** Copy an item under the right pillar's `items:`:

```yaml
    - name: FHIR Info Gateway
      kind: Gateway                     # small tag at the top of the card
      icon: shield                      # any icon from "Icons" above
      description: >-
        A privacy-preserving access layer that ensures only relevant
        healthcare workers can reach the patient data they need.
      status: Active                    # text next to the coloured dot
      statusStyle: active               # dot colour: active, maintenance, incubating, proposed
      tech: Java · Proxy                # optional
      link: https://github.com/ohs-foundation/fhir-gateway
      linkLabel: View repository
```

- `openCall: true` gives the dashed "Propose an initiative" card style.
- Links starting with `http` get the "opens elsewhere" arrow.

**Rename a pillar or change its status.** Edit `name` or `status` in `data/pillars.yaml`. That updates the home diagram, the home cards, the Projects page and the footer together. The AI Commons entry also has `projectsStatus:`, which overrides the status on the Projects page only (currently "Launching soon" there and "Launching" elsewhere). Delete that line to use one wording everywhere.

---

## 7. Community page

**`content/community.md`**, top to bottom:

| Block | What it is |
|---|---|
| `hero` | Top heading and intro |
| `join` | "Show up. Join the conversation.": the two `options` (calls, Discord), each with a `link`; `mailingList` (the text and button above the sign-up link) |
| `involved` | "Four ways to build with us": the `cards`, each with a `link` |
| `workingGroups` | Text above the working-group sign-up form, and the `note` pill |
| `events` | Heading and intro; `calendarText` (with a link to the calendar); `calendarButton`; the labels of the four `filters` |
| `cta` | The purple "Help build the future…" band: `eyebrow`, `heading`, `lead`, `buttons` |
| `subscribe` | Text above the newsletter sign-up form at the bottom |

### Events

- **Community calls and working-group meetings appear automatically** from the public community Google Calendar. Add, move or cancel them in Google Calendar and the site follows within about 10 minutes. Events with "Community call" in the title are labelled *Community call*; other online events *Working group*; events with a street address *In-person*.
- **Conferences and other one-off events** pinned to the list go in **`data/events.yaml`**:

```yaml
pinned:
  - title: "Global Digital Health Forum '26"
    when: "2–4 Dec 2026"          # shown exactly as written
    endDate: 2026-12-04           # the row disappears after this day
    location: "Bangkok, Thailand"
    category: in-person           # in-person, community or working-group
    note: "Optional text. [Links](@email:general) are allowed."
```

---

## 8. Welcome page

**`content/welcome-to-community.md`**: the page new newsletter subscribers are sent to (set in EmailOctopus). It isn't in the menus and is hidden from search engines.

- `hero`: `badge`, `heading`, `lead`.
- `cards`: each has a `title` and a `text` written in Markdown, which can include paragraphs, numbered lists (`1.`) and bullet lists (`-`). A card can also have a `button`.
- `note`: the closing line.

The welcome **email** EmailOctopus sends is kept in `email-templates/welcome-email.html` for reference only. Changing that file doesn't change the email; edit it in EmailOctopus.

---

## 9. Blog

### Write a post

**1. Create a folder** in `content/blog/`. **The folder name becomes the URL**, so use short lowercase words joined by dashes:

```
content/blog/gdhf-2026-recap/      →  https://ohs.foundation/blog/gdhf-2026-recap.html
  index.md          ← the post
  cover.jpg         ← cover image, 2400 × 1260 px
  panel-photo.jpg   ← any other images
```

File names are case-sensitive (`Cover.JPG` isn't `cover.jpg`); lowercase names without spaces are safest. With Hugo installed, `hugo new content blog/gdhf-2026-recap` creates the folder and `index.md` from the template.

**2. Start `index.md` with this block:**

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
| `cover` | File name of the cover image in the post folder (JPG, PNG or WebP). Strongly recommended: it's the picture on the blog page and in LinkedIn previews. Without one, the blog page shows the default illustration. |
| `coverAlt` | A short description of the cover image for screen readers. |
| `draft` | `true` keeps the post off the live site; `false` publishes it. |

Optional extras:

| Field | What it does |
|---|---|
| `subtitle` | A longer line under the title on the post page. Defaults to `summary`. |
| `badge` | The chip next to the author on the post page. Defaults to `category`. |
| `shortTitle` | A shorter title for the browser tab. |
| `readMore` | The link text on the blog page card. Defaults to "Read the post". |
| `coverCaption` | A caption under the cover image. |
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

**4. Preview** with `hugo server` (open `/blog.html`; add `-D` to include drafts). **5. Publish**: set `draft: false`, commit and push.

### Cover image size

Make covers **2400 × 1260 px**: any image at the 1.91 : 1 shape works, but it should be at least 1200 × 630. That's the shape LinkedIn uses for link previews, and the blog page uses the same shape, so an image of this shape is never cropped anywhere.

- **On the post page** the cover is always shown whole, whatever its shape.
- **On the blog page and in LinkedIn previews** a cover of a different shape is trimmed to fit, evenly from the centre by default. Use `coverFocus` to keep a different part.

### Sharing on LinkedIn

Paste the post's URL into a LinkedIn post. The preview card (cover, title and summary) is filled in automatically, and every post also has a **LinkedIn** share button at the bottom. LinkedIn caches previews: if you change the cover or summary after sharing, paste the URL into the [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/) to refresh it. The blog's RSS feed is at `/feed.xml`.

### Blog page text

In **`content/blog/_index.md`**:

| Block | What it is |
|---|---|
| `hero` | The blog page heading and intro |
| `moreLabel` | The "More posts" divider above earlier posts |
| `postCta` | The purple band at the end of every post |

To point the home page "New" pill at a post, edit `content/_index.md` → `announcement`.

---

## 10. Members

Members appear in two places:

- a logo strip on the **home page**, for tiers marked `showOnHome: true` (currently Premier);
- the **"Our members"** directory on the **Foundation page**, for all tiers, grouped by tier.

Both are hidden while there are no members. Everything is in **`data/members.yaml`**.

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
- To remove a member, delete its entry, and its logo file if it's no longer needed.

### Tiers

```yaml
tiers:
  - id: premier          # what members' `tier:` refers to (lowercase, no spaces)
    name: Premier        # the label shown on the site
    showOnHome: true     # include this tier in the home page strip
  - id: gold
    name: Gold
```

Rename, add or reorder tiers freely. If you change an `id`, update the members that use it. The headings of the members sections are in the page files: `content/_index.md` → `members` and `content/foundation.md` → `membership` → `directory`.

`hugo server -e demo` shows the sections with sample members (from `data/members_demo.yaml`).

---

## 11. Quick reference

| I want to… | Edit |
|---|---|
| Publish a blog post | New folder in `content/blog/` ([section 9](#9-blog)) |
| Change any text on a page | That page's file in `content/` ([section 1](#1-where-content-lives)) |
| Change the home page headline | `content/_index.md` → `hero` |
| Change the home page "New" pill | `content/_index.md` → `announcement` |
| Change membership prices or benefits | `content/foundation.md` → `membership` → `groups` |
| Add or remove a member | `data/members.yaml` + logo in `assets/members/` |
| Rename member tiers | `data/members.yaml` → `tiers` |
| Add or edit a project card | `data/pillars.yaml` → `items` |
| Rename a pillar or change its status | `data/pillars.yaml` → `name` / `status` |
| Pin a conference to the events list | `data/events.yaml` |
| Change a regular call's time | Google Calendar (the site updates itself) |
| Change the menu, footer or newsletter band | `hugo.yaml` → `menus` / `params.footer` / `params.newsletter` |
| Change the Discord invite, calendar or other shared link | `hugo.yaml` → `params.links` |
| Change a contact email | `hugo.yaml` → `params.contact` |
| Change how a page looks in Google or LinkedIn | `description:` in its `content/*.md` file |
| Add a short link like `/get-involved` | `netlify.toml` → `[[redirects]]` |

---

## 12. When something goes wrong

If a change has a mistake that would break the site, **the build stops and the live site stays as it was**. In a pull request, the Netlify check turns red; on `hugo server`, the error appears in the terminal and the browser. The message names the file. Common ones:

| Message | Fix |
|---|---|
| `failed to load data: "…/events.yaml:2:12" … mapping value is not allowed`, or `… found character that cannot start any token` | A formatting slip in that YAML file, at the line and column shown: usually a colon in unquoted text (wrap the text in double quotes), a tab instead of spaces, or uneven indentation. The same problems in a page's front matter show the `content/…md` file instead. |
| `Unknown icon "people". Available: …` | Use one of the listed icon names. |
| `Unknown link "@discrod"` / `Unknown email "@email:info"` | A typo in a shared link, or one that isn't defined in `hugo.yaml` → `params.links` / `params.contact`. |
| `cover image "cover.jpg" not found next to the post's index.md` | The file name in `cover:` doesn't match the file in the post folder. Check the spelling and case. |
| `image "photo.jpg" not found next to index.md` | Same problem for an image in the post text. |
| `has tier "Premier", which isn't one of the tier ids` | A member's `tier:` must match a tier `id` exactly, including upper/lower case. |
| `logo "x.svg" (for "…") not found in assets/members/` | The logo file is missing or named differently. |
| `coverFocus "middle" isn't one of: …` | Use one of the listed values. |

Other things to check:

- **A post doesn't appear.** It probably still says `draft: true`.
- **A section disappeared.** Its block may be misnamed or wrongly indented in the page file. Compare it with the names in this guide.
- **LinkedIn shows an old preview.** Refresh it in the [Post Inspector](https://www.linkedin.com/post-inspector/).
- **The events list says it couldn't load.** That's normal under `hugo server`, because events come from a Netlify function. They load on Netlify previews and the live site.
