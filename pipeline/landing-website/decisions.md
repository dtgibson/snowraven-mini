# Decisions — Landing Website

## 2026-06-10 — Feature visuals are live popup HTML, not screenshots
**Decision:** On the site, the hero and feature rows render the extension's popup UI as **live HTML** (using the extension's own component classes, scoped under `--sr-*` tokens), rather than embedding the captioned v1.0.0 store screenshots as images. The captioned store screenshots stay with the store listings.

**Why:** The store screenshots carry their own baked-in marketing headlines, which would clash with each feature row's adjacent heading and copy. Live popup HTML is crisper, responsive, theme-aware (follows the site's light/dark toggle), and adds no image weight. This refines PRD FR-09, which had assumed reused screenshots.

**Implication:** The only raster image the site needs is the Open Graph / social-preview image, since a social card cannot render the live HTML. Use the v1.0.0 result screenshot or a simple composed banner for that.

## 2026-06-10 — System fonts on the site
**Decision:** The site uses a system font stack with no external font request, matching `snowraven.dtgibson.com`, rather than loading Inter (which the extension UI uses).

**Why:** Parity with SnowRaven's site, faster first paint, and no external dependency, consistent with the no-bloat ethos.
