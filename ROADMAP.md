# Roadmap

This is a living document. It reflects the current best thinking on what to build next — not a contract. Things change as you learn more about your users and your product. Update it freely.

---

## Shipped

**2 shipped.**

- **Last shipped: Store submission prep (v1.0.0).** The Chrome Web Store and Firefox Add-ons listing package (copy, screenshots, promo tile, permission and privacy disclosures, and submit checklists), with v1.0.0 published to GitHub including a buildable source archive for Firefox review. Submitting to the stores is the remaining manual step.
- **Previously: Weather & Tide on the eBird Checklist Page (v0.1.0).** One-click copy of SnowRaven's weather (and tide alongside) onto the eBird checklist Edit Comments page, in Chrome and Firefox.

---

## Up Next

1. **Tide without an OpenWeather key, and a first-run key walkthrough.** Let tide show on its own when only OpenWeather is missing, and guide new users through pasting their two free keys.
2. **Combined copy and a duplicate-block guard.** An optional one-button weather+tide copy, and skipping the auto-copy when the comment already contains a weather block.

(The store-submission prep that was item 1 is now shipped: v1.0.0 is released and the listing package is ready; submitting is a manual step guided by `store/`.)

---

## On the Horizon

- Edge-case hardening: checklists with no resolvable coordinates, inland checklists with no nearby tide station, and expired or invalid keys.
- Re-verify timezone parity against SnowRaven if either side updates its timezone data.
- A dedicated Microsoft Edge Add-ons listing, if there is demand.
