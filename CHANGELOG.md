# Changelog

All notable changes to SnowRaven Mini are documented here.

## [1.3.0] - 2026-06-15

### Added
- **A "Copy weather & tide together" button.** When a checklist resolves both a weather block and a tide block, a full-width secondary button now appears below the tide slot that copies the two as a single combined block — byte-for-byte identical to the SnowRaven desktop app's combined output. It is manual-only and never auto-fires: the popup still auto-copies the weather alone on open, and the per-block Copy buttons are unchanged. The button shows only when both blocks are present, survives a tide-station override, and announces the copy through the polite live region. Parity is locked by a golden `.toBe` test.
- **A first-run key walkthrough in the popup.** The bare missing-keys notice is replaced by a guided panel that names both free keys you need (eBird and OpenWeather), shows each key's status (Set or Needed), offers a "Get a free key" link per missing key that opens the provider's key page in a new tab, and routes to Settings. When only one key is missing it says which one and notes the other is already set. No new permission is requested — the links are plain anchors and key entry stays on the Options page.

## [1.2.0] - 2026-06-13

### Added
- **WCAG 2.1 AA accessibility pass on the popup and Options UI.** The popup now announces each resolved state through a shared polite live region — when a checklist's weather is copied, when an API key or host permission is missing, when you're on a checklist view rather than its Edit Comments page, and the resolved tide states (ready, out of range, unavailable, or failed) — so assistive-technology users hear the same outcome sighted users see. Weather-lookup errors continue to announce through the existing assertive alert, not the polite region, to avoid a double read. Both surfaces gained `<header>`/`<main>`/`<h1>` landmarks and a consistent heading hierarchy, and the Weather and Tide output now sit in labelled `<section>` regions. None of this changes the visible layout, copy, or behaviour for sighted users.
- **The weather/tide output block is keyboard-reachable.** The monospace `<pre>` is now focusable (`tabindex`) and named (`role`/`aria-label`) so it can be reached and scrolled by keyboard. It is deliberately not rewrapped: the byte-for-byte SnowRaven parity contract rides on the copied string (`white-space: pre` is preserved), so the clipboard output stays identical and the golden parity tests stay green.

### Fixed
- **Dark-theme hover contrast on buttons and links.** The `--sr-primary-hover` token was defined only for the light theme, so on hover in dark mode primary buttons and links (including "Get a free key") fell below the AA contrast minimum against their hover background. A dark-theme hover colour now keeps them legible.
- **Smaller contrast and zoom gaps on the Options form.** The light-theme input border was darkened (`#9a9aa3` to `#8a8a93`) to clear AA non-text contrast, and the key inputs now use `min-height` plus vertical padding so enlarged text no longer clips at 200% zoom.
- **Decorative arrow glyphs no longer read aloud.** The `↗` and `→` characters on the "Get a free key" and "Open Settings" links are hidden from the accessible name, so screen readers announce the link text without the stray arrow.

## [1.1.0] - 2026-06-11

### Added
- SnowRaven Mini is now on the Chrome Web Store, the one-click install for Chrome, Microsoft Edge, and other Chromium browsers. The help docs gain a Chrome Web Store install path plus an Edge section (install from the Chrome Web Store after enabling Edge's off-by-default "Allow extensions from other stores" setting). Firefox Add-ons is still pending, so Firefox installs from the GitHub release zip.

### Changed
- **Night-list weather blocks now carry a moon-phase emoji.** When a checklist's weather is from a night list — any sampled hour falling outside its own sunrise-to-sunset window — the moon-phase emoji is appended directly to the condition emoji as a single unspaced run (e.g. `☁️🌗`). The phase is read from the checklist's first hour and is mirrored in the Southern Hemisphere. This matches SnowRaven 0.5.28 byte-for-byte: the moon math is a hand-port of `lunarphase-js` with a pure-UTC Julian Day (no new dependency), and the exact output strings are locked by golden `.toBe` parity tests copied from SnowRaven. Day-list blocks are unchanged.

### Fixed
- Repaired several truncated or malformed icons on the marketing site — the bird logo in the mock popups (missing eye/beak/legs/wing), the weather and key glyphs, and the Chrome and Firefox store logos (now the official Simple Icons monochrome marks).

## [1.0.0] - 2026-06-10

### Added
- **First public release — packaged for the Chrome Web Store and Firefox Add-ons.** This is the public debut, shipped as a v1.0.0 GitHub release (Chrome, Firefox, and source zips) from a single build that serves both stores. It adds the full store package under `store/`: listing copy, screenshots, the promo tile and store icon, the per-permission and per-host privacy justifications, the no-data-collection disclosures, and the Chrome and AMO submit checklists. The submissions themselves are a manual maintainer step and have not been filed yet — the extension is installed from the GitHub release until the listings publish. Behaviour is unchanged from 0.1.1; this release is about packaging it for the stores.
- **Landing site at snowravenmini.dtgibson.com.** A static marketing site, mirroring the SnowRaven desktop app's site, went live on GitHub Pages with a custom domain over HTTPS. It renders the popup as live HTML rather than screenshots, and shows the stores as "coming soon" until the listings publish.
- **The Firefox manifest now declares `data_collection_permissions: { required: ["none"] }`.** This is the "collects no data" declaration AMO requires for new submissions; it lives in the `gecko` block (Chrome ignores it) and is folded into the one shared build.

## [0.1.1] - 2026-06-09

### Added
- **Footer links on the popup and Options page.** A small footer links to the SnowRaven Mini repository and to the Help docs, matching SnowRaven's own footer. The links open in a new tab; no new permissions or network access.
- A light divider now separates the weather and tide sections in the popup, so the "Copied to clipboard" confirmation reads as applying to the weather block only.
- Comprehensive docs: a feature README, a screen-by-screen `docs/HELP.md`, a privacy policy, and an accessibility statement (`ACCESSIBILITY.md`).

### Changed
- The in-app header mark in the popup and Options page now renders the SnowRaven raven so it matches the toolbar icon, with fixed colours in both light and dark themes.
- Trimmed the README to a brief overview (full docs moved to `docs/HELP.md`), and removed em dashes and the phrase "byte for byte" from the README, docs, the extension description, and the user-facing UI strings.

### Fixed
- Corrected the README license to AGPL-3.0 to match the repository `LICENSE` (the README had read MIT), and added the matching `AGPL-3.0-or-later` license field to `package.json`, which previously had none.
- The build now clears the output directory before each build (`emptyOutDir`), so stale hashed assets no longer accumulate and bloat the packed release zips.

## [0.1.0] - 2026-06-09

### Added
- Initial release — a popup-only Chrome and Firefox MV3 extension that brings SnowRaven's weather and tide onto the eBird checklist page. On a checklist's Edit Comments page, one open resolves that checklist's coordinates and date/time through the eBird API (SnowRaven's region-centre-first fallback, not the page's map pin), fetches historical weather from OpenWeather One Call 3.0, formats it byte-for-byte identical to the SnowRaven desktop app, and auto-copies the weather block to the clipboard with a "Copied to clipboard" confirmation.
- Tide from the nearest NOAA CO-OPS station (keyless) shows below the weather with its own Copy button for US coastal checklists; out-of-range or non-US checklists get a quiet notice with an override to look up anyway. Tide is never auto-copied — it's yours to add.
- Options page for two bring-your-own API keys (eBird and OpenWeather), masked with a reveal toggle and stored only in `chrome.storage.local`. No backend, no accounts, no telemetry — each key is sent only to its own service.
- Minimal MV3 permissions (`activeTab`, `clipboardWrite`, `storage`); access to the three API hosts is optional and requested on demand from a user click. On a checklist view page the popup offers a "Show weather anyway" button and a link to the Edit Comments page. Accessibility-first: keyboard-operable, screen-reader labelled, visible focus, AA-contrast palette, and an OS-driven dark theme.
