# Product Context — SnowRaven Mini

## What It Is
A Chrome and Firefox browser extension that brings [SnowRaven](https://github.com/dtgibson/snowraven)'s weather and tide onto the eBird checklist page. On a checklist's Edit Comments page, one click copies SnowRaven's exact weather block to the clipboard and shows tide below — a lightweight, in-browser companion to the SnowRaven desktop app.

## Who It's For
Birders who do their eBird checklist editing in the browser and want SnowRaven's weather/tide comment blocks without launching the desktop app. They bring their own free eBird and OpenWeather API keys.

## Features
- **Checklist weather & tide** — *shipped, v0.1.0.* On `ebird.org/edit/effort?subID=…`, resolves the checklist's location and time via the eBird API, fetches historical weather (OpenWeather One Call timemachine) and tide (NOAA), formats them byte-for-byte like SnowRaven, auto-copies the weather (with a visible "Copied to clipboard" confirmation), and shows tide with its own copy button. On a checklist view page (`/checklist/S…`), offers an Edit-Comments link and a "show weather anyway" button.

## How It Works
- Popup-only Manifest V3; one codebase and manifest serve both Chrome and Firefox. No backend, no content script, no background worker.
- Bring-your-own keys (eBird + OpenWeather) stored in `chrome.storage.local`, each sent only to its own API host. Tide uses the keyless NOAA API.
- Weather, tide, and formatting logic ported byte-for-byte from SnowRaven's TypeScript; the desktop seams (Tauri fetch / clipboard / storage / native timezone) are swapped for browser equivalents (in-browser timezone via `@photostructure/tz-lookup`).
- Minimal permissions: `activeTab`, `clipboardWrite`, `storage`, plus on-demand `optional_host_permissions` for the three API hosts.

## Stack
React + Vite + TypeScript, Vitest. No component library — hand-authored CSS on the design-system tokens (`pipeline/design-system.md`) with inline SVG icons. The bundled, trimmed NOAA station list (~347 KB) is the only large asset.

## Distribution
GitHub: <https://github.com/dtgibson/snowraven-mini> — source on `main`, **v0.1.0** release with Chrome and Firefox zips. Not yet submitted to the Chrome Web Store or Firefox Add-ons.

## Deferred
- Showing tide on its own when only the OpenWeather key is missing (v1 requires both keys).
- A combined one-button weather+tide copy, and a duplicate-block guard (skip if the comment already contains a weather block).
- Store submissions (Chrome Web Store, Firefox Add-ons).
