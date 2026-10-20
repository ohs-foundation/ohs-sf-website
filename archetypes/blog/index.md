---
title: "{{ replace .File.ContentBaseName "-" " " | title }}"
date: {{ time.Now.Format "2006-01-02" }}
author: "the OHS-SF team"   # or a key from data/authors.yaml, e.g. fikri-milano (see WRITING.md → "Authors")
category: "Foundation news"
summary: "One or two sentences. Shown on the blog page and as the preview text when the post is shared (LinkedIn, WhatsApp, X …)."
cover: cover.jpg          # 2400×1260 px (1.91:1) — see WRITING.md
coverAlt: "Describe the cover image for screen readers"
# cardImage: card.jpg     # optional: a narrower 4:3 picture (1600×1200 px) for the blog page's featured card
# shareImage: share.jpg   # optional: a different picture for social sharing than the cover (2400×1260 px)
draft: true
---

**Open with a bold sentence** — it becomes the post's lead-in. Then write normally.

## A section heading {kicker="Optional small label"}

Paragraphs, [links](https://example.org), **bold**, *italic*, lists:

- **Point one.** Explanation.
- **Point two.** Explanation.

![Alt text for the image](photo.jpg "Optional caption shown under the image")

> A pull quote.
>
> — Who said it

<!-- Videos (YouTube, Vimeo, small clips): see WRITING.md → "Video". -->
