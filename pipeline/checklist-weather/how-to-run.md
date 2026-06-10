# Seeing SnowRaven Mini locally

A plain-English guide to building the extension and loading it unpacked in Chrome and
Firefox. No account, no server — the extension talks straight to eBird, OpenWeather, and
NOAA from your browser, and your two API keys never leave your device.

## 1. Get your two free API keys (one-time)

The extension is bring-your-own-key. Grab both before you start:

- **eBird API key** — https://ebird.org/api/keygen (used to look up the checklist's
  location and time; needed for both weather and tide).
- **OpenWeather API key** — https://openweathermap.org/api → "API keys" (used to fetch the
  historical weather for the checklist's hour; tide needs no key — NOAA is free and
  keyless).

You'll paste these into the extension's Options page in step 4.

## 2. Build it

From the project folder (`/home/parallels/snowraven-mini`):

```bash
npm install        # first time only
npm run build      # type-checks, then builds into dist/
```

When it finishes you'll have a `dist/` folder containing `popup.html`, `options.html`,
`manifest.json`, and an `assets/` folder. That `dist/` folder is the unpacked extension.

To rebuild automatically while you tinker, run `npm run dev` (it watches and rebuilds into
`dist/`; reload the extension in the browser after each rebuild — see below).

## 3. Load it unpacked

### Chrome (or any Chromium browser — Edge, Brave, …)

1. Open `chrome://extensions`.
2. Turn on **Developer mode** (top-right toggle).
3. Click **Load unpacked** and pick the `dist/` folder.
4. SnowRaven Mini appears in your extensions. Pin it to the toolbar (puzzle-piece icon →
   pin) so the popup is one click away.
5. After a `npm run build` / `npm run dev` rebuild, click the **Reload** (↻) icon on the
   extension card to pick up the changes.

### Firefox (version 128 or newer)

1. Open `about:debugging#/runtime/this-firefox`.
2. Click **Load Temporary Add-on…**.
3. Select **`dist/manifest.json`** (the file, not the folder).
4. SnowRaven Mini loads until you restart Firefox (temporary add-ons don't persist across
   restarts — just load it again).
5. After a rebuild, click **Reload** next to the add-on in the same page.

The same `dist/` works in both browsers — one codebase, one build. Chrome ignores the
Firefox-specific `gecko` block in the manifest; Firefox reads it.

## 4. Add your keys

1. Open the extension's **Options / Settings** page:
   - Chrome: `chrome://extensions` → SnowRaven Mini → **Details** → **Extension options**.
   - Firefox: `about:addons` → SnowRaven Mini → **Preferences**.
   - Or, when the popup nudges you that a key is missing, click **Go to Settings →**.
2. Paste your eBird key and your OpenWeather key (use the eye toggle to check them), then
   click **Save keys**. You'll see a "Saved" confirmation. The keys live only in this
   browser's local storage.

## 5. Use it

1. Open an **eBird checklist edit page** (e.g. `https://ebird.org/checklist/S12345678`).
2. Click the SnowRaven Mini toolbar icon.
3. The first time, the popup asks to reach eBird, OpenWeather, and NOAA — click **Grant
   access** (a single grant covers all three).
4. The popup loads the **weather** and **tide** blocks. The weather block is automatically
   copied to your clipboard — paste it straight into the eBird checklist comment. Each block
   also has its own **Copy** button (the tide block is copied only by its button).
5. Inland or non-US spots show a calm amber notice instead of tide, with a "Show it anyway"
   / "Show nearest US station" override.

If you open the popup on a page that isn't an eBird checklist, it says so calmly and does
nothing else.

## Troubleshooting

- **"eBird API key invalid. Check it in Settings."** — the saved eBird key is wrong or
  expired. Re-paste it on the Options page. (Same for the OpenWeather equivalent.)
- **"No checklist on this page."** — you're not on an eBird checklist edit page, or the URL
  has no valid `S…` checklist ID.
- **Weather copied but tide says "unavailable."** — NOAA had no usable data for that spot/
  time; weather is unaffected.
- **Firefox forgot the extension after restart.** — temporary add-ons are cleared on
  restart; reload it via `about:debugging`.
- **The popup icon is missing an image.** — the toolbar icon PNGs under `icons/` are added
  as a separate asset task; the extension still works without them (the browser shows a
  default icon).
