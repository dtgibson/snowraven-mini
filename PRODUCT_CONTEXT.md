# Product Context — SnowRaven Mini

## What It Is
A Chrome and Firefox browser extension that brings [SnowRaven](https://github.com/dtgibson/snowraven)'s weather and tide onto the eBird checklist page. On a checklist's Edit Comments page, one click copies SnowRaven's exact weather block to the clipboard and shows tide below — a lightweight, in-browser companion to the SnowRaven desktop app.

## Who It's For
Birders who do their eBird checklist editing in the browser and want SnowRaven's weather/tide comment blocks without launching the desktop app. They bring their own free eBird and OpenWeather API keys.

## Features
- **Checklist weather & tide** — *shipped, v0.1.0.* On `ebird.org/edit/effort?subID=…`, resolves the checklist's location and time via the eBird API, fetches historical weather (OpenWeather One Call timemachine) and tide (NOAA), formats them exactly like SnowRaven, auto-copies the weather (with a visible "Copied to clipboard" confirmation), and shows tide with its own copy button. On a checklist view page (`/checklist/S…`), offers an Edit-Comments link and a "show weather anyway" button.
- **Popup & Options polish** — *shipped, v0.1.1.* A shared footer with "SnowRaven Mini" (repo) and "Help" links on both the popup and the Options page, an in-app header mark that matches the toolbar icon (the SnowRaven raven on its green tile), and a light divider between the weather and tide sections so the "Copied to clipboard" confirmation reads as weather-only. The manifest/store description was also tidied to "Weather and tide for your eBird checklist, just like SnowRaven, in one click."
- **Store submission prep** — *shipped, v1.0.0.* The Chrome Web Store and Firefox Add-ons listing packages under `store/`: copy, screenshots and a 440x280 promo tile (generated reproducibly with `npm run store:assets`), permission and privacy disclosures, and per-store submit checklists. Bumped to v1.0.0 for parity across both stores and added the AMO-required `gecko.data_collection_permissions` manifest key. Published as the v1.0.0 GitHub release with Chrome, Firefox, and source zips (the source archive plus `BUILD.md` satisfy Firefox's reproducible-build review). The Chrome Web Store submission first went live at v1.1.0 (now v1.2.0); the Firefox Add-ons submission remains a manual maintainer step.
- **Landing website** — *shipped.* A static marketing site under `website/`, mirroring the SnowRaven app site, deployed to GitHub Pages at `snowravenmini.dtgibson.com`. Hero, a privacy band, feature rows that render the live popup UI, an install section that links to the live Chrome Web Store listing (Firefox "coming soon") and the GitHub-release path, and a footer. Hand-authored HTML/CSS/JS, system fonts, no build, light/dark. Live at <https://snowravenmini.dtgibson.com/> with HTTPS. The Chrome Web Store listing is live and linked; Firefox stays "coming soon" until it publishes.
- **Night weather moon phase** — *shipped, v1.1.0 (live on the Chrome Web Store).* Night checklists' weather blocks now append a moon-phase emoji to the condition emoji, unspaced (e.g. `☁️🌗`), matching SnowRaven 0.5.28 byte-for-byte. Night is any sampled hour outside its sunrise–sunset window; the phase comes from the checklist's first hour and mirrors in the Southern Hemisphere. Hand-ported moon math (no new dependency); day blocks unchanged.
- **Accessibility (WCAG 2.1 AA)** — *shipped, v1.2.0 (live on the Chrome Web Store).* The popup and Options UI meet WCAG 2.1 AA: semantic landmarks and headings, labelled keyboard-reachable Weather/Tide regions, AA contrast in both light and dark themes, and screen-reader announcements for every state. Presentation/ARIA only; weather/tide output and SnowRaven parity unchanged.

## How It Works
- Popup-only Manifest V3; one codebase and manifest serve both Chrome and Firefox. No backend, no content script, no background worker.
- Bring-your-own keys (eBird + OpenWeather) stored in `chrome.storage.local`, each sent only to its own API host. Tide uses the keyless NOAA API.
- Weather, tide, and formatting logic ported directly from SnowRaven's TypeScript so the output matches; the desktop seams (Tauri fetch / clipboard / storage / native timezone) are swapped for browser equivalents (in-browser timezone via `@photostructure/tz-lookup`).
- Minimal permissions: `activeTab`, `clipboardWrite`, `storage`, plus on-demand `optional_host_permissions` for the three API hosts.

## Stack
React + Vite + TypeScript, Vitest. No component library — hand-authored CSS on the design-system tokens (`pipeline/design-system.md`) with inline SVG icons. The bundled, trimmed NOAA station list (~347 KB) is the only large asset.

## Distribution
GitHub: <https://github.com/dtgibson/snowraven-mini> — source on `main` at **v1.2.0**, with the **v1.2.0** release carrying the Chrome, Firefox, and source zips. **Live on the Chrome Web Store** ([listing](https://chromewebstore.google.com/detail/snowraven-mini/dfbphfbhbehdlfepoigechmjbifpndhc)) as v1.2.0; Microsoft Edge and other Chromium browsers install from that same listing after enabling Edge's off-by-default "Allow extensions from other stores" (documented in `docs/HELP.md`). **Firefox Add-ons** is not yet submitted — the v1.2.0 source archive plus `BUILD.md` satisfy AMO's reproducible-build review, and the submit checklists live under `store/`. The full store listing package (copy, assets, disclosures, checklists) is prepared under `store/`.

A landing site lives in `website/` and is deployed to GitHub Pages, live at <https://snowravenmini.dtgibson.com/> with HTTPS.

## Deferred
- Showing tide on its own when only the OpenWeather key is missing (v1 requires both keys).
- A combined one-button weather+tide copy, and a duplicate-block guard (skip if the comment already contains a weather block).
- Submitting to **Firefox Add-ons**: the v1.2.0 source archive and submit checklist are ready; creating the Mozilla account and uploading are the remaining manual step. (Chrome is already live on the Web Store at v1.2.0.)
- A separate Microsoft Edge Add-ons listing. Edge installs from the Chrome listing via a per-user opt-in (now documented in `docs/HELP.md`), so a dedicated Edge submission stays deferred unless there's demand.
