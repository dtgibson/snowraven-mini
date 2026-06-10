# SnowRaven Mini

Weather and tide on the eBird checklist page — one click, byte-for-byte SnowRaven, right in your browser.

SnowRaven Mini is a lightweight Chrome and Firefox extension: the in-browser companion to the [SnowRaven](https://github.com/dtgibson/snowraven) desktop app. It does one thing well — on an eBird checklist's **Edit Comments** page, a single click resolves that checklist's location and time, looks up the historical weather and tide, formats them exactly like SnowRaven, and copies the weather straight to your clipboard so you can paste it into your comment. No desktop app, no data files, no fuss.

## What it does

- **Checklist weather** — on an Edit Comments page (`https://ebird.org/edit/effort?subID=S…`), the popup resolves the checklist's location and time through the eBird API, fetches the historical weather for that hour from OpenWeather, and formats it byte-for-byte like SnowRaven (temperature, wind, humidity, dew point, sunrise/sunset). The weather block is **auto-copied to your clipboard** the moment the lookup finishes, with a visible "Copied to clipboard" confirmation and a polite screen-reader announcement — paste it straight into your checklist comment. A **Copy** button is there to re-copy.
- **Tide** — shown below the weather, with its own **Copy** button, pulled from the nearest NOAA CO-OPS station (observed or predicted, with the surrounding high/low tides). For inland or non-US spots the popup shows a calm notice instead, with a "show it anyway" override. Tide is never copied automatically.
- **On a checklist view page** (`https://ebird.org/checklist/S…`) — the popup points you to the Edit Comments page (an **Open Edit Comments →** link) and offers a **Show weather anyway** button if you just want to read the conditions.

That's the whole extension: weather and tide on the checklist page, nothing more.

## Privacy

SnowRaven Mini runs **entirely in your browser** and **collects nothing** — no backend, no servers, no accounts, no analytics, no telemetry. Your two API keys are stored in `chrome.storage.local` on your own device, and each key is sent **only to its own API host**: the eBird key goes to eBird, the OpenWeather key goes to OpenWeather, and that's it. The only network calls are made directly to eBird, OpenWeather, and NOAA Tides & Currents (keyless), when you ask for a lookup. There's no content script and no background worker — the extension is asleep until you open the popup. See the [Privacy Policy](PRIVACY_POLICY.md) and [Accessibility statement](ACCESSIBILITY.md).

## Requirements

Two free API keys, entered once on the extension's **Options** page (they stay on your device):

- **eBird API key** — free, from [ebird.org/api/keygen](https://ebird.org/api/keygen). Used to resolve the checklist's location and time; needed for both weather and tide.
- **OpenWeather API key** — free, from [openweathermap.org/api](https://openweathermap.org/api). You must subscribe to the **One Call by Call** plan (this gives you a **One Call 3.0** key — free for the first 1,000 calls/day) or weather lookups return an error.

NOAA tide data is keyless — no third key required.

## Installation

SnowRaven Mini isn't on the Chrome Web Store or Firefox Add-ons yet, so install it from the release zip or by loading it unpacked.

Download `snowraven-mini-chrome.zip` or `snowraven-mini-firefox.zip` from the [v0.1.0 release](https://github.com/dtgibson/snowraven-mini/releases) and unzip it, or [build from source](#build-from-source) to produce `dist/`. Then:

- **Chrome** (or any Chromium browser — Edge, Brave, …): open `chrome://extensions`, turn on **Developer mode**, click **Load unpacked**, and select the unzipped folder (or `dist/`). Pin SnowRaven Mini to the toolbar so the popup is one click away.
- **Firefox** (version 128 or newer): open `about:debugging#/runtime/this-firefox`, click **Load Temporary Add-on…**, and select the `manifest.json` inside the unzipped folder (or `dist/manifest.json`). Temporary add-ons clear on restart — just load it again.

The same build works in both browsers — one codebase, one manifest. Chrome ignores the Firefox-specific `gecko` block; Firefox reads it.

After installing, open the extension's **Options**, paste your two keys, and **Save**. The first time you run a lookup, the popup asks to reach eBird, OpenWeather, and NOAA — click **Grant access** (one grant covers all three).

## Build from source

Requires [Node.js](https://nodejs.org/). Clone the repo, then:

```bash
npm install        # first time only
npm run build      # type-check + production build into dist/
npm run pack       # build the Chrome and Firefox release zips into artifacts/
npm test           # vitest — includes byte-exact golden tests against SnowRaven's output
npm run dev        # vite build --watch into dist/ (reload the extension after each rebuild)
npm run icons      # regenerate the toolbar icons from brand/icon.svg (requires sharp)
```

`dist/` is the unpacked extension — load it as described under [Installation](#installation).

## How it's built

Popup-only Manifest V3, React + Vite + TypeScript, no component library — hand-authored CSS on the design-system tokens with inline SVG icons. The weather, tide, and formatting logic is ported byte-for-byte from SnowRaven's pure TypeScript; the desktop-only seams (Tauri fetch, clipboard, storage, and native timezone) are swapped for browser equivalents (in-browser timezone via `@photostructure/tz-lookup`). Minimal permissions — `activeTab`, `clipboardWrite`, `storage`, plus on-demand `optional_host_permissions` for the three API hosts — and no content script or background worker. The full strategy, requirements, architecture, design, and QA records live under [`pipeline/`](pipeline/).

## Docs

- **[docs/HELP.md](docs/HELP.md)** — how to use the extension, screen by screen.
- **[PRIVACY_POLICY.md](PRIVACY_POLICY.md)** — what is and isn't sent off your device.
- **[ACCESSIBILITY.md](ACCESSIBILITY.md)** — the WCAG 2.1 AA accessibility statement.
- **[SnowRaven](https://github.com/dtgibson/snowraven)** — the full desktop app this is a companion to.

## Attribution

Weather: [OpenWeather](https://openweathermap.org/) · Tide: [NOAA Tides & Currents](https://tidesandcurrents.noaa.gov/) · Checklist data: [eBird](https://ebird.org/).

## License

MIT — see [LICENSE](LICENSE).
