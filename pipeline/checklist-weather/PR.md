# SnowRaven Mini — Weather & Tide on the eBird checklist page (popup UI + tests + build)

Phase 2 of the MV3 browser extension: the full popup UI, the Options page, the popup
state machine wired to the Phase-1 core/lib, the feature tests, and a green multi-page
build for both Chrome and Firefox.

## What this PR delivers

A popup-only Manifest V3 extension that, on one toolbar click from an eBird checklist
edit page, resolves the checklist's location/time, fetches historical weather
(OpenWeather) and tide (NOAA CO-OPS), renders both as byte-for-byte SnowRaven output,
and auto-copies the weather block to the clipboard. The weather/tide/tide-station logic
is ported AS-IS from the SnowRaven desktop app, so the formatted output is identical by
construction.

### Popup (`src/components/Popup.tsx`, `src/components/WeatherTidePanel.tsx`)

Implements the schema's full Data Flow & State machine:

- **Phase 0 — resolve keys.** Reads both BYO keys from `chrome.storage.local` on open.
  A still-resolving (`null`) status is treated as *resolving*, never *missing* (FR-41).
- **Phase 1 — read active tab + validate.** `chrome.tabs.query` (the `activeTab`
  permission only) → URL → require `https` + `ebird.org` host → `extractChecklistId`
  + `isValidChecklistId` (`/^S\d+$/`). A `chrome://`/`about:`/non-eBird/invalid page
  shows the calm **not-on-checklist** state and fires no fetch, copy, or permission
  request (FR-01..04).
- **Phase 2 — key gate.** A missing required key shows the **missing-keys** nudge,
  naming each missing key with a **Go to Settings →** action (FR-41/42).
- **Phase 3 — combined permission request.** ONE `chrome.permissions.request` for all
  three API origins from the open gesture. Denial → the recoverable **permission-blocked**
  state with a keyboard-reachable **Grant access** button that re-fires from a fresh
  gesture (FR-43a/44).
- **Phase 4 — shared eBird resolution.** One `fetchChecklist` feeds BOTH blocks (region-
  centre-first coordinate chain; never the page map pin).
- **Phase 5 — timezone.** Synchronous `getTimezone(lat,lng)` (`@photostructure/tz-lookup`,
  UTC fallback) BEFORE the OpenWeather fetch, so the right historical hour is selected.
- **Phase 6 — weather + tide in parallel.** Two independent chains, each catching its own
  error so neither blocks the other (FR-35).
- **Phase 7 — auto-copy weather.** On weather success only, `copyText(formatWeather output)`
  fires once; the manifest's `clipboardWrite` makes the post-`await` write reliable. The
  polite live region announces `Weather copied to clipboard` on success, or
  `Weather ready — use the Copy weather button to copy` on failure (the manual Copy button
  is the guaranteed fallback). Tide is NEVER auto-copied (FR-30/31/48a).

Every state renders: **result** (weather `<pre>` + Copy button; tide `ok` `<pre>` + its
own Copy button; tide **too-far**/**outside-us** amber notice + override button running
`force=true`; tide **unavailable**/**error** quiet `role=status` lines), **loading**,
**not-on-checklist**, **missing-keys**, **permission-blocked**, and the weather **error**
alert (`role=alert`, FR-36 errorMap messages, Settings link). Copy buttons flip to
"Copied!" for ~2 s. Decorative icons are `aria-hidden`; errors are `role=alert`; results/
copies/auto-copy announce via a shared polite live region; focus is visible on every
control (FR-47/48/48a/49).

### Options (`src/components/Options.tsx`)

Two masked (`type=password`) key fields (eBird, OpenWeather), each with a reveal toggle
(`aria-pressed`) and a "Get a free key ↗" link, a filled-green **Save keys** button with
a "Saved" confirmation announced via a polite live region, and the "Keys stay on this
device." privacy line. Backed by `ext/storage` (`chrome.storage.local`); an empty field
deletes that key (FR-40).

### Styling (`src/globals.css`)

Component classes (`.sr-popup`, `.sr-btn-copy`, `.sr-notice-amber`, `.sr-alert`,
`.sr-options`, …) ported from `design.html`, rebound onto the existing `--sr-*` tokens so
the OS-driven light/dark theme holds via `prefers-color-scheme` (no in-app toggle). Added
the dark-mode warning/destructive/secondary tokens that the popup surfaces need. Inline
SVG icons live in `src/components/Icons.tsx` (no `lucide-react`).

## No changes to the AS-IS / REWORKED lib

The popup wires against the Phase-1 module APIs unchanged: `getWeather`/`getTide`,
`fetchChecklist`, `readActiveTab`, `requestApiPermissions`/`API_ORIGINS`, `openOptions`,
`copyText`, `storage`, `tideTooFarNotice`/`tideOverrideLabel`. The formatters and the
NOAA station JSON remain byte-identical to SnowRaven.

## Tests (vitest)

`npm test` → **8 files, 59 tests, all green.** New in this PR:

- `checklistId.test.ts` — URL/raw extraction + `/^S\d+$/` validation.
- `ext/errorMap.test.ts` — FR-36 mapping, including the 401/403 key-invalid strings vs the
  429 generic bucket (QA-36a).
- `weatherService.test.ts` — `fetchChecklist` happy path (checklist view + region-info
  bounding-box centre) and the NEW eBird 401 → `eBird API key invalid. Check it in Settings.`
  throw, with global `fetch` + `chrome.storage` mocked.
- `tideService.test.ts` — too-far classification (inland-US point, nearest station > 25 mi,
  NOAA never called) and the missing-eBird-key throw (FR-37a trigger #1).

Carried over and still green: the weather golden (FR-19 byte string, `formatLocalTime`,
banker's rounding), the tide golden (FR-28a U+2013 string), and the ported `tide.test.ts`/
`tideFormatter.test.ts`.

## Build

- `npx tsc --noEmit -p tsconfig.app.json` → exit 0; `npx tsc -b` (both project refs) → exit 0.
- `npx vite build` → exit 0. `dist/` contains `popup.html`, `options.html`, a single shared
  `style-*.css`, per-entry JS chunks, an isolated `vendor-tz-*.js` chunk, and a
  `manifest.json` copied byte-identical to the root manifest. The NOAA station data (the
  dominant payload) is bundled into the popup chunk and never fetched at runtime (FR-29).

## Known deviation

The NOAA station JSON is **bundled (folded) into the popup JS chunk**, not emitted as a
separate `dist/assets/*.json` file. With `resolveJsonModule` + the AS-IS-mandated default
JSON import (`import stationData from '../assets/noaa-tide-stations.json'`), Rollup parses
and inlines the data into the importing chunk; `assetsInlineLimit` governs only URL/asset
imports, not `resolveJsonModule` data imports. The `?url` alternative that would emit a
separate asset is explicitly forbidden by the schema (it would make `stationData.stations`
undefined and break the AS-IS port). The data is present, correct, and the dominant payload
(NFR-04 satisfied in substance); it is simply not a standalone hashed file.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
