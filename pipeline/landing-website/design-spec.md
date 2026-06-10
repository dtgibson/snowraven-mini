# Design Spec — Landing Website

## Visual Direction
A direct sibling of `snowraven.dtgibson.com` in the SnowRaven Mini brand: green `#2D8653`, the raven mark, a calm light/dark palette with a dark "privacy band," generous spacing, quiet utility. System font stack and no external requests, matching SnowRaven's own site for speed. The mockup of record is `pipeline/landing-website/design.html`.

## Screens / Views
A single page, in this order:
- **Header** (sticky): brand (raven mark + "SnowRaven Mini," with "Raven" accented) + a v1.0.0 pill, primary nav (Features, Privacy, Install), a GitHub ghost link, a theme toggle, and a mobile menu.
- **Hero**: eyebrow, h1 with an accent span, lede, a primary CTA (to #install) plus a secondary GitHub button, a meta line; the popup result state shown in a browser-frame with two float-cards ("Weather: Copied", "Tide: 5.6 ft rising").
- **Privacy band** (dark): "Your keys stay on your device" plus four points (you bring the keys, no tracking, keys stay local, no developer server).
- **Features**: a centered section head plus four alternating rows, each with feature-text (icon, h3, copy) and feature-media showing the real popup UI in a browser-frame: one-click weather and tide (result), your keys (options), asks only for what it needs (permission), also get the tides (tide notice).
- **Install**: section head, Chrome and Firefox "coming soon" store buttons, an "Install from the release" card (download + Help links), and a "what you'll need" aside (the two free keys).
- **Closing band**: "A small companion to SnowRaven, shared freely" with CTAs.
- **Footer**: brand and blurb, links (GitHub, Releases, Help, Privacy, Accessibility, SnowRaven app), and fine print (credits, version, AGPL-3.0).

## Component Usage
No framework and no component library. Plain semantic HTML and hand-authored CSS on the site tokens. The popup is rendered as **live HTML** using the extension's component classes (`sr-popup`, `sr-mono`, `sr-banner`, `sr-amber`, `sr-perm`, `sr-opt`, and so on), scoped in the site CSS with `--sr-*` tokens that switch with the theme. Icons are inline SVG; the raven mark is the `brand/icon.svg` artwork inline.

## Design Tokens Applied
Site tokens mirror SnowRaven's site (`--bg`, `--surface`, `--accent` `#2D8653`, dark band `--band-bg` `#0c1f17`, and so on), light and dark via `data-theme`. The inlined popup uses a scoped `--sr-*` set (light and dark) matching the extension. System font stack; the mono stack for the output blocks.

## Interaction Notes
- Theme: an anti-flash inline script sets `data-theme` before paint; a toggle persists the choice in `localStorage` (`srm-site-theme`) and otherwise follows `prefers-color-scheme`.
- Mobile nav: a hamburger toggles the mobile menu; it closes on link click and on Escape.
- The header gains a bottom border on scroll.
- Scroll-reveal on feature rows and cards via `IntersectionObserver`, disabled under `prefers-reduced-motion`.
- Smooth in-page scrolling with `scroll-padding-top` for the sticky header.

## Content Notes
Plain, warm copy; no em dashes, no "byte for byte." The stores are "coming soon" (no live links yet), marked up so swapping in real store URLs later is a localized edit. Realistic sample data in the popups (The Battery, NY for the coastal result; Ridgefield NWR, WA for the inland tide notice). The Open Graph / social preview needs a real raster image (the live-HTML popups cannot render in a social card): use the v1.0.0 result screenshot (`store/assets/screenshot-1-result-light.png`) or a simple composed banner.

## Build Guidance (for The Engineer)
- Split `design.html` into `website/index.html`, `website/styles.css`, and `website/app.js`.
- Add `website/CNAME` containing `snowravenmini.dtgibson.com`, a `website/.nojekyll`, and `website/favicon.svg` (the raven).
- Add a GitHub Actions Pages workflow (`.github/workflows/pages.yml`) that deploys `website/`. Leave `docs/` untouched.
- Provide the Open Graph image and reference it from the meta tags.
