# Roadmap

This is a living document. It reflects the current best thinking on what to build next — not a contract. Things change as you learn more about your users and your product. Update it freely.

---

## Shipped

**7 shipped.**

- **Last shipped: First-run walkthrough + combined weather & tide copy.** A per-key onboarding checklist that names both free keys, links out, and routes to Settings replaced the bare missing-keys notice; and a secondary "Copy weather & tide together" button (shown only when both blocks resolve) copies SnowRaven desktop's `buildCombined()` output byte-for-byte. Frontend-only, manual-only combined copy, no new permissions. Released in **v1.3.0** (55d501b); live on Firefox Add-ons, rolling out to the Chrome Web Store.
- **Previously: Accessibility (WCAG 2.1 AA) pass.** The popup and Options UI were brought to WCAG 2.1 AA — semantic landmarks and headings, labelled keyboard-reachable Weather/Tide regions, AA contrast in both themes, and screen-reader announcements for every state. On `main` (f50ab43); shipped to users in v1.2.0, now live on both the Chrome Web Store and Firefox Add-ons.

---

## Up Next

1. **Tide without an OpenWeather key.** Let tide show on its own when only OpenWeather is missing, instead of requiring both keys before any lookup. (The first-run walkthrough that used to share this row has shipped.)
2. **Duplicate-block guard.** Skip the weather auto-copy when the checklist comment already contains a weather block, so reopening the popup doesn't risk a double paste. (The combined copy that used to share this row has shipped.)

**Firefox Add-ons** is live at **v1.3.0**; the **Chrome Web Store** is updating from v1.2.0 to v1.3.0. The site and its custom domain are live (showing v1.3.0). The walkthrough and combined copy shipped in **v1.3.0** (55d501b).

---

## On the Horizon

- Edge-case hardening: checklists with no resolvable coordinates, inland checklists with no nearby tide station, and expired or invalid keys.
- A component-render smoke layer (jsdom + React Testing Library) for the popup's page-state branches and button-gate conditions, so QA covers them automatically instead of by code inspection. The lib/golden parity tests are solid; the gap is at the component boundary.
- Re-verify timezone parity against SnowRaven if either side updates its timezone data.
- A dedicated Microsoft Edge Add-ons listing, if there is demand.
