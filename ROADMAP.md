# Roadmap

This is a living document. It reflects the current best thinking on what to build next — not a contract. Things change as you learn more about your users and your product. Update it freely.

---

## Shipped

**3 shipped.**

- **Last shipped: Landing website.** A static marketing site under `website/`, mirroring the SnowRaven app site, deployed to GitHub Pages (live at dtgibson.github.io/snowraven-mini; custom domain `snowravenmini.dtgibson.com` pending a DNS record). The stores are shown as "coming soon" until the listings publish.
- **Previously: Store submission prep (v1.0.0).** The Chrome Web Store and Firefox Add-ons listing package, with v1.0.0 published to GitHub including a buildable source archive for Firefox review. Submitting to the stores is a remaining manual step.

---

## Up Next

1. **Tide without an OpenWeather key, and a first-run key walkthrough.** Let tide show on its own when only OpenWeather is missing, and guide new users through pasting their two free keys.
2. **Combined copy and a duplicate-block guard.** An optional one-button weather+tide copy, and skipping the auto-copy when the comment already contains a weather block.

Two manual steps remain outside the build: submitting to the stores (package ready under `store/`) and adding the DNS record for `snowravenmini.dtgibson.com`.

---

## On the Horizon

- Edge-case hardening: checklists with no resolvable coordinates, inland checklists with no nearby tide station, and expired or invalid keys.
- Re-verify timezone parity against SnowRaven if either side updates its timezone data.
- A dedicated Microsoft Edge Add-ons listing, if there is demand.
