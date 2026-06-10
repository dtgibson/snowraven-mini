# SnowRaven Mini

A Chrome and Firefox browser extension that brings [SnowRaven](https://github.com/dtgibson/snowraven)'s weather and tide onto the eBird checklist page. On a checklist's **Edit Comments** page, one click copies the SnowRaven weather block to your clipboard and shows tide below — byte-for-byte identical to the SnowRaven desktop app — so you can paste it straight into your checklist comment.

## What it does

- On a checklist Edit Comments page (`https://ebird.org/edit/effort?subID=S…`), click the toolbar button: the extension resolves that checklist's location and time through the eBird API (the same region-centre-first logic SnowRaven uses), fetches historical weather from OpenWeather and tide from NOAA, formats them exactly like SnowRaven, and **auto-copies the weather** to your clipboard with a visible confirmation.
- **Tide** shows below with its own copy button (for US coastal checklists within NOAA's range).
- On a checklist **view** page (`/checklist/S…`), it points you to the Edit Comments page and offers a **Show weather anyway** button.

## Privacy and permissions

- Runs **entirely on your device**. No backend, no servers, no telemetry.
- You supply your **own free** eBird and OpenWeather API keys, stored locally in the browser; each key is sent only to its own API. The keys never leave your machine otherwise.
- Minimal permissions: `activeTab`, `clipboardWrite`, `storage`, plus on-demand access to the three API hosts (eBird, OpenWeather, NOAA), requested the first time you look something up.

## Setup

1. Get two free keys:
   - **eBird API key** — <https://ebird.org/api/keygen>
   - **OpenWeather One Call 3.0 key** — <https://openweathermap.org/api> (subscribe to "One Call by Call"; the free tier is sufficient)
2. Install (below), open the extension's **Options**, paste both keys, and Save.

## Install (load unpacked)

Download the packaged zip from the [Releases](https://github.com/dtgibson/snowraven-mini/releases) page, or build it yourself:

```bash
npm install
npm run build      # produces dist/
```

- **Chrome:** `chrome://extensions` → enable Developer mode → **Load unpacked** → select `dist/`.
- **Firefox:** `about:debugging` → This Firefox → **Load Temporary Add-on** → select `dist/manifest.json`.

## Develop

```bash
npm run dev     # vite build --watch into dist/ (reload the unpacked extension after changes)
npm test        # vitest — includes byte-exact golden tests against SnowRaven's output
npm run build   # type-check + production build
npm run pack    # build the Chrome Web Store and Firefox Add-ons zips into artifacts/
npm run icons   # regenerate the toolbar icons from brand/icon.svg (requires sharp)
```

## How it's built

The weather, tide, and formatting logic is ported byte-for-byte from SnowRaven's pure TypeScript; the desktop-only seams (Tauri fetch, clipboard, storage, and native timezone) are swapped for browser equivalents. It ships popup-only — no content script, no background worker, no component library — to keep the footprint small. The full strategy, requirements, architecture, design, and QA/security records are under [`pipeline/`](pipeline/).

## License

MIT — see [LICENSE](LICENSE).
