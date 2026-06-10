# Product Context — SnowRaven Mini

## What It Is
A Chrome and Firefox browser extension that brings [SnowRaven](https://github.com/dtgibson/snowraven)'s weather and tide onto the eBird checklist page. On a checklist's Edit Comments page, one click copies SnowRaven's exact weather block to the clipboard and shows tide below — a lightweight, in-browser companion to the SnowRaven desktop app.

## Who It's For
Birders who do their eBird checklist editing in the browser and want SnowRaven's weather/tide comment blocks without launching the desktop app. They bring their own free eBird and OpenWeather API keys.

## Features
- **Checklist weather & tide** — *shipped, v0.1.0.* On `ebird.org/edit/effort?subID=…`, resolves the checklist's location and time via the eBird API, fetches historical weather (OpenWeather One Call timemachine) and tide (NOAA), formats them exactly like SnowRaven, auto-copies the weather (with a visible "Copied to clipboard" confirmation), and shows tide with its own copy button. On a checklist view page (`/checklist/S…`), offers an Edit-Comments link and a "show weather anyway" button.
- **Popup & Options polish** — *shipped, v0.1.1.* A shared footer with "SnowRaven Mini" (repo) and "Help" links on both the popup and the Options page, an in-app header mark that matches the toolbar icon (the SnowRaven raven on its green tile), and a light divider between the weather and tide sections so the "Copied to clipboard" confirmation reads as weather-only. The manifest/store description was also tidied to "Weather and tide for your eBird checklist, just like SnowRaven, in one click."
- **Store submission prep** — *shipped, v1.0.0.* The Chrome Web Store and Firefox Add-ons listing packages under `store/`: copy, screenshots and a 440x280 promo tile (generated reproducibly with `npm run store:assets`), permission and privacy disclosures, and per-store submit checklists. Bumped to v1.0.0 for parity across both stores and added the AMO-required `gecko.data_collection_permissions` manifest key. Published as the v1.0.0 GitHub release with Chrome, Firefox, and source zips (the source archive plus `BUILD.md` satisfy Firefox's reproducible-build review). The store submissions themselves are a manual maintainer step.
- **Landing website** — *shipped.* A static marketing site under `website/`, mirroring the SnowRaven app site, deployed to GitHub Pages at `snowravenmini.dtgibson.com`. Hero, a privacy band, feature rows that render the live popup UI, an install section with "coming soon" store buttons and the GitHub-release path, and a footer. Hand-authored HTML/CSS/JS, system fonts, no build, light/dark. Live at <https://snowravenmini.dtgibson.com/> with HTTPS. The stores stay "coming soon" until the listings publish.

## How It Works
- Popup-only Manifest V3; one codebase and manifest serve both Chrome and Firefox. No backend, no content script, no background worker.
- Bring-your-own keys (eBird + OpenWeather) stored in `chrome.storage.local`, each sent only to its own API host. Tide uses the keyless NOAA API.
- Weather, tide, and formatting logic ported directly from SnowRaven's TypeScript so the output matches; the desktop seams (Tauri fetch / clipboard / storage / native timezone) are swapped for browser equivalents (in-browser timezone via `@photostructure/tz-lookup`).
- Minimal permissions: `activeTab`, `clipboardWrite`, `storage`, plus on-demand `optional_host_permissions` for the three API hosts.

## Stack
React + Vite + TypeScript, Vitest. No component library — hand-authored CSS on the design-system tokens (`pipeline/design-system.md`) with inline SVG icons. The bundled, trimmed NOAA station list (~347 KB) is the only large asset.

## Distribution
GitHub: <https://github.com/dtgibson/snowraven-mini> — source on `main`, **v1.0.0** release with Chrome, Firefox, and source zips. The full store listing package (copy, assets, disclosures, submit checklists) is prepared under `store/`. Not yet submitted to the Chrome Web Store or Firefox Add-ons; the developer-account setup, the one-time $5 Chrome fee, and the uploads are the maintainer's manual step, guided by the checklists in `store/`.

A landing site lives in `website/` and is deployed to GitHub Pages, live at <https://snowravenmini.dtgibson.com/> with HTTPS.

## Deferred
- Showing tide on its own when only the OpenWeather key is missing (v1 requires both keys).
- A combined one-button weather+tide copy, and a duplicate-block guard (skip if the comment already contains a weather block).
- Actually submitting to the stores: the package is prepared and v1.0.0 is released, but creating the developer accounts and uploading are manual.
- A separate Microsoft Edge Add-ons listing. Edge can install from the Chrome listing only via a per-user opt-in, so reaching Edge users by default would be its own submission.
