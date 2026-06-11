# QA Report — Chrome listing live + Edge install docs

**Lane:** Improve · **Stage 3 (The Tester)** · 2026-06-11 · **Verdict: PASS** (one revision applied)

Verified three ways in parallel: a headless render of the site, a links + Edge-accuracy
check against Microsoft's docs, and a whole-repo stale-copy sweep. Two Edge wording
refinements surfaced and were applied; everything else passed.

## Rendered site (headless Chromium, 1200px + 480px)

Screenshotted the `#install` section and inspected it by eye:

- The Chrome tile renders as a real, full-opacity button — "Available on the Chrome Web
  Store" with a solid green **Install** pill — visually distinct from the dimmed Firefox
  "Coming soon / Soon" tile.
- The Microsoft Edge note renders cleanly below the store row, with "install guide" as a
  working link.
- No overflow or breakage at desktop or mobile width; the grid collapses to one column on
  mobile as intended.
- HTML is well-formed around the edit (the `<a class="store-btn live">` and the grid divs
  all balance); the new CSS is valid and references existing design tokens; the Chrome
  `href` is the exact listing URL; the in-page Edge link fragment matches the HELP.md
  heading slug `install-on-microsoft-edge`.

## Links + Edge accuracy

- Chrome Web Store listing, GitHub releases, and releases/latest all resolve (HTTP 200;
  releases/latest redirects to the live v1.1.0 tag).
- The Edge steps were checked against Microsoft's official support and Learn docs. The
  "Allow extensions from other stores" setting (off by default), the banner-prompt path,
  and the "Add extension" confirm were all confirmed accurate. **Two refinements applied:**
  - The manual fallback path now matches Microsoft's wording: Settings and more (⋯) →
    Extensions → Manage extensions, then switch on the toggle at the bottom of the left pane.
  - The install button step now explains that the listing button still reads "Add to Chrome"
    in Edge (it's the Chrome Web Store's own button), preventing confusion.

## Stale-copy sweep + suite

- All user-facing copy (website, `docs/HELP.md`, `README.md`) correctly reads "Chrome is
  live, Firefox coming soon." No file claims Firefox is live; every Firefox reference is
  pending.
- The Chrome Web Store URL is byte-identical in all five places it appears.
- The only remaining pre-launch "Chrome not submitted / coming soon" wording is confined to
  the three context docs — `PRODUCT_CONTEXT.md`, `ROADMAP.md`, `DECISIONS.md` — which are
  intentionally deferred to The Chronicler at the end. Captured as the to-update list there.
- `npx vitest run` — **89 passed (89)**. `npm run build` — clean.

## Website icon audit + fixes (added scope)

The user flagged broken/unrecognizable icons during review. Audited all inline SVGs and
fixed them, then rendered the page headless (CDP, 2x device scale) and inspected the
header, features, and install sections by eye:

- All 7 bird instances render complete; 0 stripped birds remain (verified by grep + render).
- The weather (cloud-rain) and key icons render complete and correct.
- The Chrome and Firefox store logos are recognizable: Chrome green/active with the
  "Install" pill, Firefox muted grey under "Coming soon." Paths are the exact official
  Simple Icons glyphs (not redrawn).
- HTML tag balance holds (div 79/79, a 32/32, svg 24/24, section 5/5).
- `npm run build` clean; `npx vitest run` 89/89.

## Conclusion

Site and docs are accurate and render correctly; the Edge instructions match Microsoft's
current flow. Ready for The Auditor.
