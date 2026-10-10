---
title: "{{ replace .File.ContentBaseName "-" " " | title }}"
date: {{ time.Now.Format "2006-01-02" }}
author: "the OHS-SF team"
category: "Foundation news"
summary: "One or two sentences. Shown on the blog page and as the preview text when the post is shared on LinkedIn."
cover: cover.jpg
coverAlt: "Describe the cover image for screen readers"
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

{{</* youtube VIDEO_ID */>}}
