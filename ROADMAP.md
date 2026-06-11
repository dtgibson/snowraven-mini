# Roadmap

This is a living document. It reflects the current best thinking on what to build next — not a contract. Things change as you learn more about your users and your product. Update it freely.

---

## Shipped

**4 shipped.**

- **Last shipped: Night weather moon phase (v1.1.0).** Night checklists' weather blocks now append a moon-phase emoji to the condition emoji, unspaced (e.g. `☁️🌗`), matching SnowRaven 0.5.28 byte-for-byte. On `main`; a 1.1.0 store release (regenerated store zips/assets, website version pill) is pending.
- **Previously: Landing website.** A static marketing site under `website/`, mirroring the SnowRaven app site, deployed to GitHub Pages and live at `snowravenmini.dtgibson.com` with HTTPS. The stores are shown as "coming soon" until the listings publish.
- **Previously: Store submission prep (v1.0.0).** The Chrome Web Store and Firefox Add-ons listing package, with v1.0.0 published to GitHub including a buildable source archive for Firefox review. Submitting to the stores is a remaining manual step.

---

## Up Next

1. **Tide without an OpenWeather key, and a first-run key walkthrough.** Let tide show on its own when only OpenWeather is missing, and guide new users through pasting their two free keys.
2. **Combined copy and a duplicate-block guard.** An optional one-button weather+tide copy, and skipping the auto-copy when the comment already contains a weather block.

One manual step remains outside the build: submitting to the stores (the package under `store/` is ready, but still at v1.0.0 — regenerate it when cutting the 1.1.0 release). The site and its custom domain are live.

---

## On the Horizon

- Edge-case hardening: checklists with no resolvable coordinates, inland checklists with no nearby tide station, and expired or invalid keys.
- Re-verify timezone parity against SnowRaven if either side updates its timezone data.
- A dedicated Microsoft Edge Add-ons listing, if there is demand.
