# OHS-SF Website Setup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move production-ready static files to the repo root, strip the design-tool Tweaks panel, add repo scaffolding and a favicon, wire up GitHub Actions for Pages, and create the remote repo at `github.com/ohs-foundation/ohs-sf-website`.

**Architecture:** Four static HTML pages (`index.html`, `foundation.html`, `projects.html`, `community.html`) sharing one stylesheet (`styles.css`) and one script (`app.js`). No build step. Deployed via GitHub Actions → GitHub Pages.

**Tech Stack:** Vanilla HTML/CSS/JS · GitHub Actions · GitHub Pages · `gh` CLI

---

## File Map

| Action | Path | Notes |
|---|---|---|
| Move in | `index.html` | Remove Tweaks panel block in Task 2 |
| Move in | `foundation.html` | No changes beyond favicon link |
| Move in | `projects.html` | No changes beyond favicon link |
| Move in | `community.html` | No changes beyond favicon link |
| Move in | `styles.css` | No changes — teal + 14px defaults confirmed |
| Move in | `app.js` | No changes |
| Delete | `tweaks-panel.jsx` | Design-tool only, must not ship |
| Create | `.gitignore` | Excludes .DS_Store, zips, node_modules, design_handoff dir |
| Create | `LICENSE` | Apache-2.0 |
| Create | `README.md` | Project-facing docs |
| Create | `favicon.svg` | 2×2 logo-mark blocks in SVG |
| Create | `.github/workflows/pages.yml` | Deploys root to Pages on push to main |

---

## Task 1: Move Site Files to Repo Root

**Files:** Copy `design_handoff_ohs_foundation_site/site/*` → repo root

- [ ] **Step 1: Copy all site files to repo root**

```bash
cp design_handoff_ohs_foundation_site/site/index.html .
cp design_handoff_ohs_foundation_site/site/foundation.html .
cp design_handoff_ohs_foundation_site/site/projects.html .
cp design_handoff_ohs_foundation_site/site/community.html .
cp design_handoff_ohs_foundation_site/site/styles.css .
cp design_handoff_ohs_foundation_site/site/app.js .
cp design_handoff_ohs_foundation_site/site/tweaks-panel.jsx .
```

- [ ] **Step 2: Verify all 7 files are present in root**

```bash
ls -1 index.html foundation.html projects.html community.html styles.css app.js tweaks-panel.jsx
```

Expected: 7 file names printed, no "No such file" errors.

- [ ] **Step 3: Commit raw import**

```bash
git add index.html foundation.html projects.html community.html styles.css app.js tweaks-panel.jsx
git commit -m "chore: import design handoff files"
```

---

## Task 2: Remove Tweaks Panel

**Files:** Modify `index.html`, delete `tweaks-panel.jsx`

The Tweaks panel is a React-based design exploration tool. Everything from the comment `<!-- ===== TWEAKS PANEL ... -->` through the final inline `</script>` before `</body>` must be removed. The three React/Babel CDN `<script>` tags are inside this block.

After removal, `<script src="app.js"></script>` must be immediately followed by `</body>`.

- [ ] **Step 1: Edit index.html — remove the Tweaks block**

In `index.html`, replace the entire block starting at the blank line before the Tweaks comment through the closing inline script tag. The exact old_string to remove is:

```
<!-- ===== TWEAKS PANEL (React island over the static page) ===== -->
<div id="tweaks-root"></div>
<script src="https://unpkg.com/react@18.3.1/umd/react.development.js" integrity="sha384-hD6/rw4ppMLGNu3tX5cjIb+uRZ7UkRJ6BPkLpg4hAu/6onKUg4lLsHAs9EBPT82L" crossorigin="anonymous"></script>
<script src="https://unpkg.com/react-dom@18.3.1/umd/react-dom.development.js" integrity="sha384-u6aeetuaXnQ38mYT8rp6sbXaQe3NL9t+IBXmnYxwkUI2Hw4bsp2Wvmx4yRQF1uAm" crossorigin="anonymous"></script>
<script src="https://unpkg.com/@babel/standalone@7.29.0/babel.min.js" integrity="sha384-m08KidiNqLdpJqLq95G/LEi8Qvjl/xUYll3QILypMoQ65QorJ9Lvtp2RXYGBFj1y" crossorigin="anonymous"></script>
<script type="text/babel" src="tweaks-panel.jsx"></script>
```

...through the end of the inline `<script type="text/babel">` block ending in `ReactDOM.createRoot(document.getElementById('tweaks-root')).render(<App />);\n</script>`.

Use the Edit tool with the exact literal strings from the file — the file was read, so matching is exact.

- [ ] **Step 2: Delete tweaks-panel.jsx**

```bash
rm tweaks-panel.jsx
```

- [ ] **Step 3: Verify index.html ends correctly**

```bash
tail -4 index.html
```

Expected:
```
<script src="app.js"></script>
</body>
</html>
```

- [ ] **Step 4: Open index.html locally and confirm no console errors**

```bash
open index.html
```

Open browser DevTools → Console. Expected: zero errors (no React/Babel/missing-file errors). The page should render fully.

- [ ] **Step 5: Commit**

```bash
git add index.html
git rm tweaks-panel.jsx
git commit -m "chore: remove design-tool tweaks panel for production"
```

---

## Task 3: Add Repo Scaffolding

**Files:** Create `.gitignore`, `LICENSE`, `README.md`, `favicon.svg`; add favicon `<link>` to all four HTML files.

- [ ] **Step 1: Create .gitignore**

Create `/Users/fredhersch/Development/ohs-sf/.gitignore` with this exact content:

```
# macOS
.DS_Store
.AppleDouble
.LSOverride

# Archives
*.zip
*.tar.gz

# Node (future use)
node_modules/
npm-debug.log*

# Env
.env
.env.local

# Design handoff (source files, not part of production repo)
design_handoff_ohs_foundation_site/

# Editor
.vscode/
.idea/
```

- [ ] **Step 2: Create LICENSE (Apache-2.0)**

Create `/Users/fredhersch/Development/ohs-sf/LICENSE` with the full Apache 2.0 license text:

```
                                 Apache License
                           Version 2.0, January 2004
                        http://www.apache.org/licenses/

   TERMS AND CONDITIONS FOR USE, REPRODUCTION, AND DISTRIBUTION

   1. Definitions.

      "License" shall mean the terms and conditions for use, reproduction,
      and distribution as defined by Sections 1 through 9 of this document.

      "Licensor" shall mean the copyright owner or entity authorized by
      the copyright owner that is granting the License.

      "Legal Entity" shall mean the union of the acting entity and all
      other entities that control, are controlled by, or are under common
      control with that entity. For the purposes of this definition,
      "control" means (i) the power, direct or indirect, to cause the
      direction or management of such entity, whether by contract or
      otherwise, or (ii) ownership of fifty percent (50%) or more of the
      outstanding shares, or (iii) beneficial ownership of such entity.

      "You" (or "Your") shall mean an individual or Legal Entity
      exercising permissions granted by this License.

      "Source" form shall mean the preferred form for making modifications,
      including but not limited to software source code, documentation
      source, and configuration files.

      "Object" form shall mean any form resulting from mechanical
      transformation or translation of a Source form, including but
      not limited to compiled object code, generated documentation,
      and conversions to other media types.

      "Work" shall mean the work of authorship made available under
      the License, as indicated by a copyright notice that is included
      in or attached to the work (an example is provided in the Appendix below).

      "Derivative Works" shall mean any work, whether in Source or Object
      form, that is based on (or derived from) the Work and for which the
      editorial revisions, annotations, elaborations, or other modifications
      represent, as a whole, an original work of authorship. For the purposes
      of this License, Derivative Works shall not include works that remain
      separable from, or merely link (or bind by name) to the interfaces of,
      the Work and Derivative Works thereof.

      "Contribution" shall mean, as submitted to the Licensor for inclusion
      in the Work by the copyright owner or by an individual or Legal Entity
      authorized to submit on behalf of the copyright owner. For the purposes
      of this definition, "submitted" means any form of electronic, verbal,
      or written communication sent to the Licensor or its representatives,
      including but not limited to communication on electronic mailing lists,
      source code control systems, and issue tracking systems that are managed
      by, or on behalf of, the Licensor for the purpose of recording and
      discussing modifications to the Work, but excluding communication that
      is conspicuously marked or designated in writing by the copyright owner
      as "Not a Contribution."

      "Contributor" shall mean Licensor and any Legal Entity on behalf of
      whom a Contribution has been received by the Licensor and included
      within the Work.

   2. Grant of Copyright License. Subject to the terms and conditions of
      this License, each Contributor hereby grants to You a perpetual,
      worldwide, non-exclusive, no-charge, royalty-free, irrevocable
      copyright license to reproduce, prepare Derivative Works of,
      publicly display, publicly perform, sublicense, and distribute the
      Work and such Derivative Works in Source or Object form.

   3. Grant of Patent License. Subject to the terms and conditions of
      this License, each Contributor hereby grants to You a perpetual,
      worldwide, non-exclusive, no-charge, royalty-free, irrevocable
      (except as stated in this section) patent license to make, have made,
      use, offer to sell, sell, import, and otherwise transfer the Work,
      where such license applies only to those patent claims licensable
      by such Contributor that are necessarily infringed by their
      Contribution(s) alone or by the combination of their Contribution(s)
      with the Work to which such Contribution(s) was submitted. If You
      institute patent litigation against any entity (including a cross-claim
      or counterclaim in a lawsuit) alleging that the Work or any
      Contributor's patent or other patent claim embodied in the Work
      constitutes direct or contributory patent infringement, then any
      patent licenses granted to You under this License for that Work
      shall terminate as of the date such litigation is filed.

   4. Redistribution. You may reproduce and distribute copies of the
      Work or Derivative Works thereof in any medium, with or without
      modifications, and in Source or Object form, provided that You
      meet the following conditions:

      (a) You must give any other recipients of the Work or Derivative
          Works a copy of this License; and

      (b) You must cause any modified files to carry prominent notices
          stating that You changed the files; and

      (c) You must retain, in the Source form of any Derivative Works
          that You distribute, all copyright, patent, trademark, and
          attribution notices from the Source form of the Work,
          excluding those notices that do not pertain to any part of
          the Derivative Works; and

      (d) If the Work includes a "NOTICE" text file as part of its
          distribution, You must include a readable copy of the
          attribution notices contained within such NOTICE file, in
          at least one of the following places: within a NOTICE text
          file distributed as part of the Derivative Works; within
          the Source form or documentation, if provided along with the
          Derivative Works; or, within a display generated by the
          Derivative Works, if and wherever such third-party notices
          normally appear. The contents of the NOTICE file are for
          informational purposes only and do not modify the License.
          You may add Your own attribution notices within Derivative
          Works that You distribute, alongside or in addition to the
          NOTICE text from the Work, provided that such additional
          attribution notices cannot be construed as modifying the License.

      You may add Your own license statement for Your modifications and
      may provide additional grant of rights to use, copy, modify, merge,
      publish, distribute, sublicense, and/or sell copies of the
      Derivative Works, and to permit persons to whom the Derivative
      Works are furnished to do so.

   5. Submission of Contributions. Unless You explicitly state otherwise,
      any Contribution intentionally submitted for inclusion in the Work
      by You to the Licensor shall be under the terms and conditions of
      this License, without any additional terms or conditions.
      Notwithstanding the above, nothing herein shall supersede or modify
      the terms of any separate license agreement you may have executed
      with Licensor regarding such Contributions.

   6. Trademarks. This License does not grant permission to use the trade
      names, trademarks, service marks, or product names of the Licensor,
      except as required for reasonable and customary use in describing the
      origin of the Work and reproducing the content of the NOTICE file.

   7. Disclaimer of Warranty. Unless required by applicable law or
      agreed to in writing, Licensor provides the Work (and each
      Contributor provides its Contributions) on an "AS IS" BASIS,
      WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
      implied, including, without limitation, any conditions of TITLE,
      MERCHANTIBILITY, SATISFACTORY QUALITY, or FITNESS FOR A PARTICULAR
      PURPOSE. You are solely responsible for determining the
      appropriateness of using or reproducing the Work and assume any
      risks associated with Your exercise of permissions under this License.

   8. Limitation of Liability. In no event and under no legal theory,
      whether in tort (including negligence), contract, or otherwise,
      unless required by applicable law (such as deliberate and grossly
      negligent acts) or agreed to in writing, shall any Contributor be
      liable to You for damages, including any direct, indirect, special,
      incidental, or exemplary damages of any character arising as a
      result of this License or out of the use or inability to use the
      Work (including but not limited to damages for loss of goodwill,
      work stoppage, computer failure or malfunction, or all other
      commercial damages or losses), even if such Contributor has been
      advised of the possibility of such damages.

   9. Accepting Warranty or Additional Liability. While redistributing
      the Work or Derivative Works thereof, You may choose to offer,
      and charge a fee for, acceptance of support, warranty, indemnity,
      or other liability obligations and/or rights consistent with this
      License. However, in accepting such obligations, You may offer only
      conditions consistent with this License.

   END OF TERMS AND CONDITIONS

   Copyright 2026 Open Health Stack Software Foundation

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
```

- [ ] **Step 3: Create README.md**

Create `/Users/fredhersch/Development/ohs-sf/README.md`:

```markdown
# Open Health Stack Software Foundation — Website

Marketing and informational website for the [Open Health Stack Software Foundation](https://ohs.foundation) — an independent, community-owned software foundation hosted by the Linux Foundation, building open-source building blocks for next-gen, AI-powered global digital health.

## Local preview

No build step required. Open any page directly in a browser:

```bash
open index.html
```

Or serve locally to avoid any file:// quirks:

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
```

- [ ] **Step 4: Create favicon.svg**

Create `/Users/fredhersch/Development/ohs-sf/favicon.svg` — a 32×32 SVG mirroring the CSS logo-mark (2×2 grid of rounded squares, teal / core-blue / ai-violet / teal-deep):

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <rect x="1" y="1" width="13" height="13" rx="3" fill="#1f8f8a"/>
  <rect x="18" y="1" width="13" height="13" rx="3" fill="#2d86c4"/>
  <rect x="1" y="18" width="13" height="13" rx="3" fill="#7158c9"/>
  <rect x="18" y="18" width="13" height="13" rx="3" fill="#1f6b6a"/>
</svg>
```

Colors match the CSS design tokens: teal (#1f8f8a), core (#2d86c4), ai (#7158c9), teal-deep (#1f6b6a).

- [ ] **Step 5: Add favicon link to all four HTML pages**

In each of `index.html`, `foundation.html`, `projects.html`, `community.html`, add this line immediately after `<meta name="viewport" ...>`:

```html
<link rel="icon" href="favicon.svg" type="image/svg+xml">
```

- [ ] **Step 6: Verify favicon appears in browser tab**

```bash
open index.html
```

Expected: the 2×2 block-mark favicon appears in the browser tab.

- [ ] **Step 7: Commit**

```bash
git add .gitignore LICENSE README.md favicon.svg index.html foundation.html projects.html community.html
git commit -m "chore: add scaffolding, favicon, and gitignore"
```

---

## Task 4: Add GitHub Actions Pages Workflow

**Files:** Create `.github/workflows/pages.yml`

- [ ] **Step 1: Create the workflow directory**

```bash
mkdir -p .github/workflows
```

- [ ] **Step 2: Create .github/workflows/pages.yml**

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/configure-pages@v5
      - uses: actions/upload-pages-artifact@v3
        with:
          path: .
      - uses: actions/deploy-pages@v4
        id: deployment
```

- [ ] **Step 3: Commit**

```bash
git add .github/workflows/pages.yml
git commit -m "ci: add GitHub Pages deployment workflow"
```

---

## Task 5: Create GitHub Repo and Push

**Prerequisite:** You must be authenticated with the `gh` CLI and have admin access to the `ohs-foundation` GitHub org. Run `gh auth status` to verify.

- [ ] **Step 1: Check gh CLI auth**

```bash
gh auth status
```

Expected: shows authenticated account. If not: `gh auth login`.

- [ ] **Step 2: Create the repo on GitHub**

```bash
gh repo create ohs-foundation/ohs-sf-website \
  --public \
  --description "Open Health Stack Software Foundation — website" \
  --source . \
  --remote origin \
  --push
```

This creates the repo, sets it as `origin`, and pushes all commits in one step.

If the org doesn't exist yet or you lack permission, create the repo via the GitHub web UI at `https://github.com/organizations/ohs-foundation/repositories/new`, then:

```bash
git remote add origin https://github.com/ohs-foundation/ohs-sf-website.git
git push -u origin main
```

- [ ] **Step 3: Enable GitHub Pages with GitHub Actions source**

Navigate to `https://github.com/ohs-foundation/ohs-sf-website/settings/pages`.

Under **Build and deployment → Source**, select **GitHub Actions** (not "Deploy from a branch").

- [ ] **Step 4: Verify the deployment**

Check `https://github.com/ohs-foundation/ohs-sf-website/actions` — the "Deploy to GitHub Pages" workflow should be running or complete.

Once green, the site is live at the URL shown in the workflow run (e.g. `https://ohs-foundation.github.io/ohs-sf-website/`).

- [ ] **Step 5: Smoke-test the live site**

Visit the live URL and verify:
- All four pages load: `/`, `/foundation.html`, `/projects.html`, `/community.html`
- Nav cross-links work (e.g. "Foundation" link from home → foundation page)
- Mobile nav hamburger opens and closes below 860px (resize browser window)
- Scroll-reveal animations fire on first visit
- Stat count-ups animate on the Community page
- Interactive ecosystem map on home page highlights projects on pillar hover/click
- No console errors on any page

---

## Self-review checklist

- [x] Task 1 moves files before Task 2 modifies them — correct order.
- [x] All four HTML files get the favicon link in Task 3.
- [x] The `.gitignore` excludes `design_handoff_ohs_foundation_site/` so the handoff docs don't pollute the repo.
- [x] The `tweaks-panel.jsx` is removed via `git rm`, not just `rm`, so Git tracks the deletion.
- [x] The GitHub Actions workflow uses `path: .` to upload the entire root as the Pages artifact — correct for a root-level `index.html`.
- [x] No placeholder steps; all file content is included.
