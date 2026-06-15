# Roadmap

This is a living document. It reflects the current best thinking on what to build next — not a contract. Things change as you learn more about your users and your product. Update it freely.

---

## Shipped

**6 shipped.**

- **Last shipped: Accessibility (WCAG 2.1 AA) pass.** The popup and Options UI were brought to WCAG 2.1 AA — semantic landmarks and headings, labelled keyboard-reachable Weather/Tide regions, AA contrast in both themes, and screen-reader announcements for every state. Presentation/ARIA only; weather/tide parity unchanged. On `main` (f50ab43); shipped to users in v1.2.0, now live on the Chrome Web Store.
- **Previously: Chrome Web Store launch + Edge docs + site polish.** v1.1.0 went live on the Chrome Web Store; the site links to the listing (Firefox "coming soon"), the docs cover installing on Microsoft Edge via the Chrome Web Store, the website's broken icons were fixed (real Chrome/Firefox logos, complete bird/weather/key glyphs), and the Pages CI workflow was moved off the deprecated Node 20 actions.
- **Previously: Night weather moon phase (v1.1.0).** Night checklists' weather blocks now append a moon-phase emoji to the condition emoji, unspaced (e.g. `☁️🌗`), matching SnowRaven 0.5.28 byte-for-byte. Shipped in v1.1.0, now live on the Chrome Web Store.
- **Previously: Landing website.** A static marketing site under `website/`, mirroring the SnowRaven app site, deployed to GitHub Pages and live at `snowravenmini.dtgibson.com` with HTTPS. Both the Chrome Web Store and Firefox Add-ons listings are now live and linked.
- **Previously: Store submission prep (v1.0.0).** The Chrome Web Store and Firefox Add-ons listing package, with v1.0.0 published to GitHub including a buildable source archive for Firefox review. Both stores are now live: the Chrome Web Store and Firefox Add-ons.

---

## Up Next

1. **Tide without an OpenWeather key, and a first-run key walkthrough.** Let tide show on its own when only OpenWeather is missing, and guide new users through pasting their two free keys.
2. **Combined copy and a duplicate-block guard.** An optional one-button weather+tide copy, and skipping the auto-copy when the comment already contains a weather block.

Both store listings are live — the **Chrome Web Store** at v1.2.0 and **Firefox Add-ons** at v1.1.0 — and the site and its custom domain are live. One manual step remains outside the build: updating **Firefox Add-ons** to v1.2.0 (the prepared v1.2.0 source archive + checklist under `store/` are ready).

---

## On the Horizon

- Edge-case hardening: checklists with no resolvable coordinates, inland checklists with no nearby tide station, and expired or invalid keys.
- Re-verify timezone parity against SnowRaven if either side updates its timezone data.
- A dedicated Microsoft Edge Add-ons listing, if there is demand.
