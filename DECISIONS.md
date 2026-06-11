# Decisions — SnowRaven Mini

## Weather & Tide on the eBird Checklist Page — 2026-06-09

**Decision:** Build the extension fully on-device with bring-your-own keys (eBird + OpenWeather in `chrome.storage.local`) and no backend. Resolve checklist coordinates via the eBird API using SnowRaven's region-centre-first fallback (not the page's map pin). Resolve timezone in-browser with `@photostructure/tz-lookup`. Add the `clipboardWrite` permission so the post-lookup weather auto-copy is reliable.

**Rationale:** Privacy and zero infrastructure. Byte-for-byte weather parity with SnowRaven requires feeding OpenWeather the *same* coordinates SnowRaven uses — the region-bounding-box centre, which differs from the exact map pin at hotspots — so the extension reuses that lookup rather than reading the page pin. A byte-exact timezone library would be multiple megabytes and break the small-bundle goal, so the ~50 KB `tz-lookup` was chosen, verified against SnowRaven at build time with a UTC fallback; the rare near-border timezone divergence is accepted. `clipboardWrite` is benign (write-only) and makes the headline one-click copy reliable, worth the one extra permission.

**Implications:** Future features keep the no-backend / bring-your-own-key / minimal-permission posture. The timezone library's near-border parity is a small known risk to re-verify if either side's tz data changes.

## v1 key-gating scope — 2026-06-09

**Decision:** v1 requires both keys; if only the OpenWeather key is missing, the popup nudges for it rather than showing tide on its own.

**Rationale:** The product's headline is weather, which needs the OpenWeather key; tide-only is a niche case not worth extra v1 UI.

**Implications:** Tide-without-OpenWeather is a deferred enhancement.

## Store submission — 2026-06-10

**Decision:** Publish to the Chrome Web Store and Firefox Add-ons as public listings, debuting at **v1.0.0** (one build serves both stores). Microsoft Edge is deliberately out of scope.

**Rationale:** 1.0.0 reads better for a public debut than 0.1.x, and a single version keeps one build for both browsers; routine updates resume incrementing by 0.1. Edge can install Chrome Web Store extensions only when each user enables an off-by-default "Allow extensions from other stores" setting, so it is not a reliable distribution channel without a separate Microsoft Edge Add-ons submission.

**Implications:** Future releases keep one shared version and one build. The Firefox manifest must retain `gecko.data_collection_permissions` (AMO requires the data-collection declaration for new submissions). Revisit a dedicated Edge Add-ons listing only if there is demand.

## Landing website — 2026-06-10

**Decision:** Ship a static marketing site at `snowravenmini.dtgibson.com`, mirroring the SnowRaven app site, served from GitHub Pages via a GitHub Actions deploy of the `website/` folder. The site renders the extension's popup as live HTML (not screenshots), uses system fonts, and shows the stores as "coming soon" until the listings publish.

**Rationale:** A trustworthy front door for the v1.0.0 release ahead of the store listings; parity with SnowRaven's own site keeps the family resemblance; live popup HTML avoids duplicating each feature row's heading and adds no image weight; system fonts and no build keep it fast, matching the no-bloat ethos.

**Implications:** Enabling GitHub Pages is a one-time action done outside the workflow (the Action's token cannot create the Pages site on first run). The custom domain needs a DNS CNAME (`snowravenmini` to `dtgibson.github.io`) before GitHub will verify it and provision HTTPS. Swap the "coming soon" store buttons for live links once the listings go live.

## Night-list weather: moon-phase emoji parity — 2026-06-11

**Decision:** Match SnowRaven 0.5.28 (`512466e`): night checklists' weather blocks append a moon-phase emoji to the condition emoji, unspaced (e.g. `☁️🌗`). A block is night when any sampled hour falls outside its own sunrise–sunset window; the phase is read from the checklist's first hour and mirrored in the Southern Hemisphere. The moon math is a hand-port of `lunarphase-js@2.0.3` with a pure-UTC Julian Day, copied character-for-character from SnowRaven's `weatherFormatter.ts`. Day blocks are byte-unchanged. Shipped to `main` as **v1.1.0**.

**Rationale:** Byte-for-byte weather parity with SnowRaven is the product's core promise, so adopting SnowRaven's output change is maintenance of an existing contract, not a new feature — it stayed in the Improve lane. Hand-porting the moon math rather than adding `lunarphase-js` keeps the small-bundle, no-new-dependency posture. The golden parity test asserts the exact night strings via `.toBe`, copied from SnowRaven, so any byte drift fails the build; parity was further confirmed by a logic diff against `512466e`, an independent from-scratch recomputation of the moon phases, and a regression/security audit.

**Implications:** The moon emoji must stay glued to the condition emoji with no space — a single emoji run is the parity contract (SnowRaven anchors a weather block on its last emoji run). The store package under `store/` and the website still carry `v1.0.0` artifact names and version text; cutting an actual 1.1.0 store release means regenerating the store zips/assets and updating the website version pill. Re-sync again if SnowRaven changes its weather formatter.

## Chrome Web Store live; Edge via the Chrome listing; site + CI follow-ups — 2026-06-11

**Decision:** The Chrome Web Store listing went live at **v1.1.0** (<https://chromewebstore.google.com/detail/snowraven-mini/dfbphfbhbehdlfepoigechmjbifpndhc>). The website's Chrome button is now a live link to the listing; Firefox stays "coming soon" until AMO publishes. Microsoft Edge (and other Chromium browsers) is supported by installing from the Chrome Web Store after enabling Edge's off-by-default "Allow extensions from other stores" — documented in `docs/HELP.md`; there is still no separate Microsoft Edge Add-ons listing. Two cleanups rode along: several mangled website icons were fixed, and the Pages CI workflow was bumped off the deprecated Node 20 actions.

**Rationale:** The store-submission and landing-site decisions always planned to swap the "coming soon" buttons for live links once a listing published; Chrome is now that listing. Edge reach comes for free through the Chrome Web Store via a per-user opt-in, so a dedicated Edge listing stays out of scope. The website's icons are hand-authored inline SVGs (Lucide glyphs plus the SnowRaven "bird" logo); four mock popups had been trimmed to a single body path and other glyphs were malformed, so they were restored to complete glyphs, and the unrecognizable browser scribbles were replaced with the official Chrome and Firefox monochrome logos from Simple Icons (exact paths, not redrawn). The CI bump (checkout v4→v6, configure-pages v5→v6, upload-pages-artifact v3→v5, deploy-pages v4→v5) clears GitHub's Node 20 deprecation before the 2026-06-16 forced cutover.

**Implications:** Swap the Firefox button to a live link and update the docs when AMO publishes. Website icons are hand-authored inline SVGs — render the page and eyeball them before shipping, since a trimmed path renders as a broken glyph. Keep the Pages workflow actions current as GitHub deprecates older Node runtimes.
