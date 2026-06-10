# PRD — Landing Website
**Feature:** landing-website
**Date:** 2026-06-10
**Stage:** 2 — The Planner
**Source:** strategic-brief.md (approved)

## Feature Overview
A small, hand-authored static website for SnowRaven Mini, served from GitHub Pages at `snowravenmini.dtgibson.com`. It mirrors the SnowRaven desktop app's site (`snowraven.dtgibson.com`): a header and nav, a hero, a privacy band, alternating feature rows with real screenshots, an install section, and a footer. It shows what the extension does and how to install it today, with the Chrome Web Store and Firefox Add-ons marked "coming soon."

## User Stories
> **US-01** — As a birder who hears about SnowRaven Mini, I want a quick page that shows what it does with real screenshots, so that I can decide whether I want it without reading a GitHub README.

> **US-02** — As a visitor ready to try it, I want a clear way to install it now, so that I can use it before it reaches the stores.

> **US-03** — As a privacy-minded user, I want the page to state plainly that my keys stay on my device, so that I trust it.

> **US-04** — As the maintainer, I want a polished link to share (and a place store users land later), so that the extension has a real product presence.

> **US-05** — As the maintainer, I want the store buttons built so they flip from "coming soon" to live links with a small edit, so that updating after launch is trivial.

## Functional Requirements

### Site structure
> **FR-01** — The deliverable shall be a single static `index.html` with a header and nav, a hero, a privacy band, a features section of alternating rows, an install section, and a footer, mirroring the SnowRaven site's layout.

> **FR-02** — The deliverable shall include a `styles.css` built on the SnowRaven Mini design tokens (green `#2D8653`, Inter, the `--sr-*` palette) so the site reads as a sibling of both the extension and the SnowRaven site.

> **FR-03** — The deliverable shall include a small `app.js` for the theme toggle and mobile nav only, with no framework and no build step.

### Content
> **FR-04** — The hero shall state what the extension is ("Weather and tide for your eBird checklist, in one click"), a one-line subhead, a primary install call to action, a secondary link (GitHub or Help), and a meta line ("Chrome and Firefox. No account, no telemetry.").

> **FR-05** — A privacy band shall reinforce that the two API keys stay on the device in `chrome.storage.local`, each sent only to its own service, with no backend, no telemetry, and no servers.

> **FR-06** — The features section shall present these rows, each with an icon, heading, short copy, and a real screenshot: (1) one-click weather and tide (result shot), (2) your keys, your device (Options shot), (3) asks only for what it needs (permission shot), (4) honest about tide (tide-notice shot). The checklist-view shot may be used as a fifth row or omitted.

> **FR-07** — The install section shall show Chrome Web Store and Firefox Add-ons buttons clearly marked "Coming soon" (not linking to live listings), plus the current install path: download the latest GitHub release and load it in the browser, linking the release and the Help install guide.

> **FR-08** — The footer shall link the GitHub repo, the Help guide, the privacy policy, the SnowRaven desktop app site, and the AGPL-3.0 license.

### Assets and meta
> **FR-09** — The deliverable shall reuse the v1.0.0 screenshots from `store/assets/`, optimized for the web (converted to a web format and sized for the layout), and include a raven `favicon.svg` and a social preview image.

> **FR-10** — The page shall include a title, meta description, canonical URL (`https://snowravenmini.dtgibson.com/`), Open Graph and Twitter card tags with a preview image, a `color-scheme` meta, and an anti-flash theme script that sets the theme before first paint.

### Theme, responsive, accessibility
> **FR-11** — The site shall support light and dark themes, default to the visitor's system setting (`prefers-color-scheme`), offer a toggle persisted in `localStorage`, and meet WCAG 2.1 AA contrast in both.

> **FR-12** — The site shall be responsive down to mobile, use semantic landmarks, be fully keyboard navigable with visible focus, give every screenshot meaningful alt text, and respect `prefers-reduced-motion`.

### Deploy and domain
> **FR-13** — The site shall live in a top-level `website/` folder and publish to GitHub Pages via a GitHub Actions workflow, leaving the existing `docs/` folder untouched. It shall include a `CNAME` file containing `snowravenmini.dtgibson.com` and a `.nojekyll` file.

> **FR-14** — The store buttons shall be structured (clearly marked markup) so switching "coming soon" to real store links later is a small, localized edit.

## Non-Functional Requirements
> **NFR-01 — No bloat:** no framework, no build step, no heavy dependencies, consistent with the extension's ethos and the SnowRaven site.

> **NFR-02 — Performance:** lightweight page, lazy-loaded images, fast first paint.

> **NFR-03 — Accessibility:** WCAG 2.1 AA, matching the extension's accessibility bar.

> **NFR-04 — Brand parity:** a visual sibling of `snowraven.dtgibson.com` (green, raven mark, Inter, quiet utility), with no em dashes and without the phrase "byte for byte" in copy.

> **NFR-05 — Honesty:** the page shall not claim the extension is on the stores yet; the stores are "coming soon" until the listings are live.

## Out of Scope
- Creating the DNS record and enabling GitHub Pages in repo settings. These are the maintainer's manual steps; exact values will be provided.
- Live store links (the stores stay "coming soon" until live; a later update swaps them in).
- Analytics, tracking, a contact form, a blog, or any backend.
- Any change to the extension itself.
- The SnowRaven desktop app's own site.

## Open Questions
1. **Deploy mechanism.** *Default:* a GitHub Actions Pages workflow publishing `website/`, which keeps `docs/` clean and matches SnowRaven's `website/` convention. (Requires setting Pages source to "GitHub Actions," a one-time repo setting.) *Alternative:* publish from a branch folder.
2. **Social preview image.** *Default:* use the result screenshot (or a simple composed banner) as the Open Graph image.
3. **Nav items.** *Default:* Features, Install, GitHub.
4. **Domain.** Resolved: `snowravenmini.dtgibson.com` (CNAME record `snowravenmini` to `dtgibson.github.io`).

## Success Metrics
| ID | What's Being Verified | Pass Condition |
|---|---|---|
| QA-01 | Site structure (FR-01) | `index.html` has header/nav, hero, privacy band, features, install, and footer landmarks. |
| QA-02 | Tokens and parity (FR-02, NFR-04) | Styles use the `--sr-*` palette and Inter; the page reads as a sibling of the SnowRaven site; no em dashes, no "byte for byte" in copy. |
| QA-03 | No build (FR-03, NFR-01) | Site is plain HTML/CSS/JS; no framework, no build step, no heavy dependency. |
| QA-04 | Hero (FR-04) | Hero shows the purpose line, subhead, primary install CTA, secondary link, and the meta line. |
| QA-05 | Privacy band (FR-05) | A section states keys stay on device, sent only to each service, no backend or telemetry. |
| QA-06 | Features (FR-06) | At least four feature rows, each with a real screenshot, covering weather+tide, keys, permissions, and tide honesty. |
| QA-07 | Install section (FR-07) | Chrome and Firefox shown as "coming soon" (no live links); the current GitHub-release install path is present and linked. |
| QA-08 | Footer (FR-08) | Footer links repo, Help, privacy policy, the SnowRaven app, and the license. |
| QA-09 | Assets (FR-09) | Web-optimized screenshots, a favicon, and a social image are present and referenced. |
| QA-10 | Meta (FR-10) | Title, description, canonical, OG/Twitter tags, color-scheme meta, and an anti-flash theme script are present. |
| QA-11 | Theme (FR-11) | Light and dark both render with AA contrast; default follows the system; the toggle persists. |
| QA-12 | Responsive + a11y (FR-12) | Layout holds on mobile; landmarks, keyboard focus, image alt text, and reduced-motion are handled. |
| QA-13 | Deploy config (FR-13) | The site is in `website/` with a `CNAME` (snowravenmini.dtgibson.com), a `.nojekyll`, and a Pages Actions workflow; `docs/` is unchanged. |
| QA-14 | Coming-soon switch (FR-14) | The store buttons are marked up so flipping to live links is a small, localized edit. |
