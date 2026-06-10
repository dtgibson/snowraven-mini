# Roadmap

This is a living document. It reflects the current best thinking on what to build next — not a contract. Things change as you learn more about your users and your product. Update it freely.

---

## Shipped

**1 shipped.**

- **Last shipped — Weather & Tide on the eBird Checklist Page (v0.1.0):** one-click copy of SnowRaven's exact weather (and tide shown alongside) onto the eBird checklist Edit Comments page, in Chrome and Firefox. Published to GitHub with a release.

---

## Up Next

1. **Publish to the Chrome Web Store and Firefox Add-ons** — the v0.1.0 zips on the GitHub release are upload-ready; this is the step that gets it into users' browsers without manual sideloading.
2. **Tide without an OpenWeather key, and a first-run key walkthrough** — let tide show on its own when only OpenWeather is missing, and guide new users through pasting their two free keys.
3. **Combined copy and a duplicate-block guard** — an optional one-button weather+tide copy, and skipping the auto-copy when the comment already contains a weather block.

---

## On the Horizon

- Edge-case hardening: checklists with no resolvable coordinates, inland checklists with no nearby tide station, and expired or invalid keys.
- Re-verify timezone parity against SnowRaven if either side updates its timezone data.
