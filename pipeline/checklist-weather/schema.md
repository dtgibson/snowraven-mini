# Schema — Weather and Tide on the eBird Checklist Page

## Path

**Frontend Only — No data layer changes required.**

## Confirmation

There is no database, no tables, no migrations, and no backend of any kind. The feature reads three external HTTP APIs directly from the popup (eBird, OpenWeather, NOAA CO-OPS) and persists exactly two bring-your-own API keys in `chrome.storage.local`. All weather/tide/lookup logic is ported byte-for-byte from SnowRaven's pure TypeScript; the only at-rest state is the two keys.

> **Note on file references:** the extension has no code yet. Every extension file named in this document (`manifest.json`, `vite.config.ts`, `package.json`, `src/*`, `scripts/*`) is a file **The Engineer creates in Stage 5**. Where the text says "the committed `manifest.json`" or cites a line in `vite.config.ts`/`package.json`, read it as *the proposed file specified here*, not an existing artifact. Only SnowRaven (`/home/parallels/snowraven`) is an existing codebase, and its file:line citations are real.

## External Data Sources

All three are direct `fetch` calls from the popup document. None requires a key except the two BYO keys below; host access for all three is held only under `optional_host_permissions` and granted at runtime in one combined request (see Manifest & Permissions). All run inside the secure extension context (`chrome-extension://` / `moz-extension://`), so CORS is governed by the granted host permissions, not page-origin CORS.

### 1. eBird API (`https://api.ebird.org/v2`) — checklist resolution (shared by weather AND tide)
Key: user's eBird key, sent as header `X-eBirdApiToken` (FR-40, FR-05). Calls, in `fetchChecklist` order (port of `weatherService.ts:20-83`, with the ONE new status branch noted below and detailed in Error Architecture):
- `GET /product/checklist/view/{checklistId}` — reads `obsDt`, `locId`, `locName`, `durationHrs` (default `1`). Status handling: `404` → throw `Checklist not found. Check the ID and try again.` (internal `status:400`); **`401`/`403` → throw `eBird API key invalid. Check it in Settings.` (NEW FR-36 branch, see Error Architecture; NOT present in SnowRaven source);** any other non-OK → throw `Could not fetch checklist data. Please try again.` (internal `status:502`). (FR-05, FR-36)
- Coordinate fallback chain, stop at first lat+lng (FR-06): (1) PRIMARY `GET /ref/region/info/{locId}` → bounding-box centre `lat=(minY+maxY)/2`, `lng=(minX+maxX)/2`; (2) FALLBACK `GET /product/lists/{locId}?maxResults=1` → `loc.lat|latitude` / `loc.lng|longitude|lon`; (3) LAST RESORT `GET /data/obs/{locId}/recent?back=365` → first obs `lat`/`lng`. Region-info is best-effort (failure falls through, never cached — FR-07). No lat+lng anywhere → throw `Could not find coordinates for location {locId}.` (internal `status:502`, FR-06a). **Never** uses the page map pin.

### 2. OpenWeather One Call 3.0 `timemachine` (`https://api.openweathermap.org/data/3.0`) — weather
Key: user's OpenWeather key, sent as query param `appid` (FR-40, FR-11). Call (port of `weatherService.ts:85-90,157-161`):
- `GET /onecall/timemachine?lat={lat}&lon={lng}&dt={unixSeconds}&appid={owmKey}&units=imperial`. **One** call when `startTs === endTs`, **two** concurrent calls (`startTs` then `endTs`) otherwise, results passed to the formatter in `[start, end]` order. Only `data[0]` of each is consumed. Status handling: **`401`/`403` → throw `OpenWeather API key invalid. Check it in Settings.` (NEW FR-36 branch, see Error Architecture; NOT present in SnowRaven source);** any other non-OK → throw `Weather data unavailable for this checklist.`. **The response-root `timezone` field is NOT used** — the zone must be known *before* this fetch to pick the hour (FR-08a).

### 3. NOAA CO-OPS datagetter (`https://api.tidesandcurrents.noaa.gov/api/prod/datagetter`) — tide (keyless)
No key (FR-20). Three concurrent GETs sharing `datum=MLLW&units=english&time_zone=lst_ldt&format=json&application=SnowRaven` (port of `tideService.ts:30-78`): (1) `product=water_level` over `[start,end]`; (2) `product=predictions&interval=6` over `[start,end]`; (3) `product=predictions&interval=hilo` over `[start−24h, end+24h]`. NOAA returns HTTP 200 with a top-level `error` body for no-data/throttle; `getJson` returns `null` on any throw and the parsers return `[]` on an error/malformed body, degrading to tide `unavailable` (NEVER the `error` state — FR-25).

CORS/host note: each fetch hits a host listed in `optional_host_permissions`; the combined grant is requested once from the click gesture before any of these fire (FR-43a). No other network request of any kind is permitted (FR-45).

## Local Storage

Single store: `chrome.storage.local` (requires the manifest `storage` permission — `chrome.storage` is `undefined` without it). Two string keys (FR-40):

```
chrome.storage.local = {
  ebird:       string | undefined,   // eBird API key (BYO)
  openweather: string | undefined    // OpenWeather API key (BYO)
}
```

Read/write contract (`ext/storage.ts`, replacing `storage.ts`; keeps only the three key methods of `StorageAdapter` at `storage.ts:13-16`, drops all file/settings/CSV methods which are desktop concerns):
- `getApiKey('ebird'|'openweather'): Promise<string|null>` — `chrome.storage.local.get([service])`, returns the value when non-empty else `null` (matches `TauriStorage.getApiKey`, `storage.ts:121-129`: empty string → `null`).
- `setApiKey(service, value): Promise<void>` — `chrome.storage.local.set({ [service]: value })`.
- `deleteApiKey(service): Promise<void>` — `chrome.storage.local.remove([service])`.

Keys leave the device only as the eBird `X-eBirdApiToken` header and the OpenWeather `appid` param (FR-40, NFR-02). No bundled/shared/default key ships. Storage is unencrypted, which is accepted for BYO keys under the no-backend model (PRD Open Question "Exact at-rest key storage"); the Options fields are masked (FR-40).

## Module & Port Map

Three tiers: **AS-IS** (copy byte-for-byte, no edits), **REWORKED** (logic verbatim except the explicitly named seam/branch edits), **REPLACED** (new ext-glue). Destination root is `extension/src/`.

| SnowRaven module (file:line) | Tier | Destination | Change |
|---|---|---|---|
| `weatherFormatter.ts:1-144` | AS-IS | `src/lib/weatherFormatter.ts` | None. Pure, zero imports. `ATTRIBUTION` (:33), `formatWeather` (:142-144), `bankersRound`, `cardinal`, `formatLocalTime` (Intl). FR-13..FR-19. |
| `tideFormatter.ts:1-65` | AS-IS | `src/lib/tideFormatter.ts` | None. Imports only `./tide` + `./weatherFormatter`. Retains `formatTideBody`/`buildCombined`/`COMBINED_ATTRIBUTION` dead-but-faithful (FR-51). FR-28/FR-28a. |
| `tide.ts:1-241` | AS-IS | `src/lib/tide.ts` | None. Imports only `./tideStations` (type). NOAA parse + `computeTideReading` + `normalizeObsDt`/`shiftLocal`/`toNoaaDate`/`ft`. FR-22..FR-27. |
| `tideStations.ts:1-93` | AS-IS | `src/lib/tideStations.ts` | None. Imports only `../assets/noaa-tide-stations.json` via the **default JSON import** (unchanged — `import stationData from '../assets/noaa-tide-stations.json'` and `(stationData as {stations}).stations`; see Build & Bundle for why NO `?url`). `nearestStation`/`classifyTideLocation`/`isInUS`/`TIDE_MAX_MILES`. FR-22/FR-23/QA-20. |
| `tideNotice.ts:1-19` | AS-IS | `src/lib/tideNotice.ts` | None. Zero imports. `tideTooFarNotice`/`tideOverrideLabel`. FR-38. |
| `checklistId.ts:1-11` | AS-IS | `src/lib/checklistId.ts` | None. Zero imports. `extractChecklistId`/`isValidChecklistId` (`/^S\d+$/`). FR-02/FR-03. |
| `assets/noaa-tide-stations.json` (346,916 B, 3,241 stations, 6 fields `id/name/lat/lng/state/obs`) | AS-IS | `src/assets/noaa-tide-stations.json` | Copy the **exact shipped bytes** (recommended over re-fetching, to guarantee QA-20/QA-29 parity and avoid quarterly drift). FR-29. |
| `tauri/weatherService.ts:1-169` | REWORKED | `src/lib/weatherService.ts` | `fetchChecklist` (:20-83), `parseLocalDateTimeInZone` (:92-127), `getWeather` (:136-169) logic preserved **except** (a) seam imports swapped and (b) the NEW FR-36 401/403 status branch (see below). Swap imports: `tauriFetch` (:1)→`extFetch` from `./ext/http`; `storage` (:3)→`./ext/storage`; **DELETE** `invoke('get_timezone')` (:2,:150) → `import { getTimezone } from './timezone'; const tzName = getTimezone(checklist.lat, checklist.lng)` (sync). **NEW (NOT a verbatim body):** in the eBird non-OK handling (`fetchChecklist`, ~:23-25) and the OWM non-OK handling (`getWeather`/`fetchHistorical`, ~:88), add a status check that detects `res.status===401||403` and throws the FR-36 key-invalid string for that service via the shared `ext/errorMap.ts` helper, BEFORE falling through to the existing generic throw. All other branches and the formatter output stay byte-identical. FR-05..FR-11, FR-36. |
| `tauri/tideService.ts:1-95` | REWORKED | `src/lib/tideService.ts` | `getTide`/`noaaUrl`/`getJson` (:30-95) **byte-identical**. Swap: `tauriFetch` (:7)→`extFetch`; `storage` (:8)→`./ext/storage`. `import { fetchChecklist } from './weatherService'` (:9) unchanged (now points at reworked Tier-B). The new eBird 401/403 throw originates in `fetchChecklist` and escapes `getTide` before the `getJson` seam → tide `error` state (FR-37a, unchanged shape). FR-20/FR-21/FR-24..FR-39. |
| `tauri/regionInfo.ts:1-35` | REWORKED (small body edit) | `src/lib/regionInfo.ts` | NOT a pure seam swap. SnowRaven's `getRegionInfo` (:20-34) is `return cachedGet(key, async () => {...})` and is non-async; dropping `cachedGet` (:8,:21) requires a structural one-line change: make the function `async` and return the inner closure's result directly — `export async function getRegionInfo(locId, key){ const res = await extFetch(...); if(!res.ok) return null; const body = await res.json(); ... return {...} }`. Swap `tauriFetch` (:7)→`extFetch`. No cache (popup is single-shot; trivially satisfies FR-07 "failed region-info not cached"). The fetch/parse/return logic inside the closure is preserved verbatim. |
| `tauri/http.ts:1-37` + `transport.ts` | REPLACED | `src/lib/ext/http.ts` | New thin wrapper over global `fetch(url, init)` returning the native `Response` (services read `.status`/`.ok`/`.json()` unchanged). Keep the `AbortController` 10s-timeout shape (http.ts:17-37) but on `fetch`, not `@tauri-apps/plugin-http`. `transport.ts` path-dispatcher DELETED (popup calls `getWeather`/`getTide` directly). `networkCache.ts` NOT ported. |
| `storage.ts:13-141` | REPLACED | `src/lib/ext/storage.ts` | New `chrome.storage.local` adapter: only `getApiKey`/`setApiKey`/`deleteApiKey` (see Local Storage). File/settings/CSV methods dropped. FR-40. |
| `clipboard.ts:16-49` | REPLACED | `src/lib/ext/clipboard.ts` | New `copyText(text):Promise<boolean>` = the WEB branch only (`navigator.clipboard.writeText` then `textarea`+`execCommand` fallback, never throws). Drop the `isTauri()`/`@tauri-apps` branch (:13-25). **The source comment (`clipboard.ts:3-11`) documenting post-`await` activation loss is load-bearing — see Data Flow Phase 7 for the activation strategy and FR-31/FR-48a for the designed-for failure path.** FR-30/FR-31/NFR-06. |
| — (no SnowRaven analog) | NEW | `src/lib/ext/activeTab.ts` | `chrome.tabs.query({active:true,currentWindow:true})` → tab URL; enforce `https` + `ebird.org` host; feed `extractChecklistId`/`isValidChecklistId`. FR-01/FR-02/FR-04. |
| — | NEW | `src/lib/ext/permissions.ts` | `chrome.permissions.request({origins:[3 api hosts]})` (single combined, from gesture) + `chrome.permissions.contains` pre-check. Returns boolean. FR-43/FR-43a/FR-44. |
| — | NEW | `src/lib/ext/options.ts` | `chrome.runtime.openOptionsPage()`. FR-41. |
| — | NEW | `src/lib/ext/errorMap.ts` | **NEW owner of the FR-36 status→message mapping** (no SnowRaven analog; the desktop `WeatherTideSection.tsx:37-39` surfaced `err.detail`/`err.message` with no status branching and the 401/403 key-invalid strings do not exist anywhere in source). Pure helper: given a service (`'ebird'|'openweather'`) and a non-OK `res.status`, returns the FR-36 string — `404`→`Checklist not found. Check the ID and try again.`; eBird `401`/`403`→`eBird API key invalid. Check it in Settings.`; OWM `401`/`403`→`OpenWeather API key invalid. Check it in Settings.`; otherwise the service's generic message. Called from the reworked branches in `weatherService.ts` so the new strings live in ONE place. FR-36/FR-42. |
| — (replaces `invoke('get_timezone')`) | NEW | `src/lib/timezone.ts` | In-browser coord→IANA via **`@photostructure/tz-lookup`** (see Timezone Resolution). Exposes **synchronous** `getTimezone(lat, lng): string` (UTC fallback) so `getWeather` can compute `startTs`/`endTs` before the OWM fetch (FR-08a). Pure JS, no WASM/init step. |
| — | NEW | `src/lib/types.ts` | Shared UI state types incl. `TideStatus = 'ok'|'too-far'|'outside-us'|'unavailable'|'error'` (FR-37a divergence). |
| `WeatherTidePanel.tsx` | REWORKED (UI) | `src/components/WeatherTidePanel.tsx` | Single-checklist view: one side, per-block Copy buttons, the 5 tide states, `<pre white-space:pre>`. Drop A/B badge, IdentityHeader, ReconciliationNote, CombinedCopyButton. FR-32/FR-34/FR-37/FR-48. |
| `WeatherTideSection.tsx` | REWORKED (UI) | `src/components/Popup.tsx` | Orchestrator (see Data Flow). Invert the desktop "Load-then-no-copy" model: auto-runs on open, **best-effort** auto-copies weather within activation, owns FR-35 loading / FR-41 nudges / FR-44 retry. NO Load button, NO combined copy button. The manual weather Copy button is the **guaranteed** copy path (FR-48a). |
| — | NEW | `src/components/Options.tsx` | Two masked key fields + free-key links + save confirm. FR-40. |
| `globals.css` | REWORKED | `src/globals.css` | Port `--sr-*` tokens + `.spin`/`.sr-only`/reduced-motion AS-IS, but **rebind dark tokens from `[data-theme="dark"]` to `@media (prefers-color-scheme: dark)`** (no in-app toggle). FR-49. |

**NOT PORTED (excluded from any runtime path, FR-50/NFR-04):** `commentBlocks.ts` + `commentText.ts`/`decodeEntities` (duplicate-guard, Out of Scope); `transport.ts`; `networkCache.ts`; `platform.ts`; `storage.ts` file/settings methods; all desktop deps (`@tauri-apps/*`, `maplibre-gl`, `react-map-gl`, `recharts`); Python backend twins; `lucide-react` (replace with inline SVG).

## Source Structure

```
extension/
  manifest.json                      # MV3, both browsers (see Manifest & Permissions)
  popup.html                         # action.default_popup → src/popup.tsx
  options.html                       # options_ui.page  → src/options.tsx
  vite.config.ts                     # multi-input build + inline manifest-copy plugin + vitest block
  tsconfig.json
  package.json
  scripts/
    pack.mjs                         # post-build: zip dist/ → chrome + firefox named archives (npm run pack → scripts/pack.mjs)
    build-tide-stations.mjs          # ported; ONE output target (drop backend twin)
  public/
    icons/icon-{16,32,48,128}.png    # manifest icons (to be authored)
  src/
    popup.tsx                        # React entry — mounts <Popup/>
    options.tsx                      # React entry — mounts <Options/>
    globals.css                      # --sr-* tokens, OS-dark via media query, reduced-motion
    components/
      Popup.tsx                      # orchestrator (reworked WeatherTideSection)
      WeatherTidePanel.tsx           # single-checklist view (reworked)
      Options.tsx                    # two key fields + free-key links
    lib/
      weatherFormatter.ts            # AS-IS
      tideFormatter.ts               # AS-IS
      tide.ts                        # AS-IS
      tideStations.ts                # AS-IS (default JSON import)
      tideNotice.ts                  # AS-IS
      checklistId.ts                 # AS-IS
      weatherService.ts              # REWORKED (seam swaps + FR-36 401/403 branch)
      tideService.ts                 # REWORKED
      regionInfo.ts                  # REWORKED (async inline lookup, no cache)
      timezone.ts                    # NEW (@photostructure/tz-lookup seam, sync getTimezone)
      types.ts                       # NEW (TideStatus union incl. 'error')
      ext/
        http.ts                      # global fetch + AbortController timeout
        storage.ts                   # chrome.storage.local key adapter
        clipboard.ts                 # web-branch copyText
        activeTab.ts                 # chrome.tabs.query gesture URL read
        permissions.ts               # combined chrome.permissions.request
        options.ts                   # chrome.runtime.openOptionsPage
        errorMap.ts                  # NEW FR-36 status→message mapper
    assets/
      noaa-tide-stations.json        # 346,916 B, 3,241 stations, 6 fields
    test/
      setup.ts                       # jsdom + clipboard/execCommand stubs
  src/**/*.test.ts                   # vitest goldens (weatherFormatter, tideFormatter, tide, ...)
```

**FR-area → module map:** detect (FR-01..04) = `ext/activeTab.ts` + `checklistId.ts`, gated in `Popup.tsx` · eBird resolve (FR-05..09) = `weatherService.ts#fetchChecklist` + `regionInfo.ts` + `timezone.ts` · weather (FR-10..19) = `weatherService.ts#getWeather` + `weatherFormatter.ts` · weather/tide error messages (FR-36) = `ext/errorMap.ts` (called by `weatherService.ts`) surfaced in `Popup.tsx`/`WeatherTidePanel.tsx` · tide (FR-20..39) = `tideService.ts` + `tide.ts` + `tideStations.ts` + `tideNotice.ts` + `tideFormatter.ts` + JSON · popup/copy (FR-30..37,47..49) = `Popup.tsx` + `WeatherTidePanel.tsx` + `ext/clipboard.ts` + `ext/permissions.ts` + `globals.css` · options (FR-40..42) = `Options.tsx` + `ext/storage.ts` + `ext/options.ts`.

## Manifest & Permissions

One manifest serves both browsers; Chrome ignores `browser_specific_settings` (FR-46). `permissions` is **`["activeTab", "clipboardWrite", "storage"]`** — `activeTab` to read the active-tab URL on click, `clipboardWrite` so the post-lookup weather auto-copy is reliable (without it the post-`await` `writeText` can lose user activation and fail), and `storage` because `chrome.storage.local` (the two BYO keys, FR-40) is undefined without it. No host permission, no `tabs`; all host access is under `optional_host_permissions` and granted on demand. No `background`/`service_worker`/`content_scripts` keys (NFR-01, QA-54). This block is the source of truth for the manifest The Engineer will author (`options_ui.open_in_tab: true`).

```json
{
  "manifest_version": 3,
  "name": "SnowRaven Mini",
  "version": "0.1.0",
  "description": "Weather and tide on the eBird checklist page — byte-for-byte SnowRaven, one click.",
  "permissions": ["activeTab", "clipboardWrite", "storage"],
  "optional_host_permissions": [
    "https://api.ebird.org/*",
    "https://api.openweathermap.org/*",
    "https://api.tidesandcurrents.noaa.gov/*"
  ],
  "action": {
    "default_popup": "popup.html",
    "default_title": "SnowRaven Mini",
    "default_icon": {
      "16": "icons/icon-16.png",
      "32": "icons/icon-32.png",
      "48": "icons/icon-48.png",
      "128": "icons/icon-128.png"
    }
  },
  "options_ui": { "page": "options.html", "open_in_tab": true },
  "icons": {
    "16": "icons/icon-16.png",
    "32": "icons/icon-32.png",
    "48": "icons/icon-48.png",
    "128": "icons/icon-128.png"
  },
  "browser_specific_settings": {
    "gecko": {
      "id": "snowraven-mini@dtgibson.com",
      "strict_min_version": "128.0"
    }
  }
}
```

**`options_ui.open_in_tab` is `true`** (aligned with the committed `manifest.json:28`). Rationale: a full-tab Options page is the more robust cross-browser choice for a two-field key page (Firefox's embedded options panel has historically been the quirkier surface), and the FR-41 "Go to Settings →" flow via `chrome.runtime.openOptionsPage()` opens the page consistently in both browsers. The doc and the committed manifest are now identical on this value.

**Combined three-origin request flow (FR-43a, FR-44):** On the first lookup click, inside the click handler before any `await`: (1) `chrome.permissions.contains({origins:[...3 hosts]})` pre-check; (2) if not held, ONE `chrome.permissions.request({origins:[...all three]})`. All-or-nothing — granted → proceed; denied/not-yet-granted → the `permission-blocked` recoverable state with a keyboard-reachable **Grant** control that re-fires the request from a fresh gesture. No per-origin or partial-grant state exists in v1. The denial blocks BOTH weather and tide.

**Firefox floor (FR-46a) — UNVERIFIED HYPOTHESIS until QA-53a:** `gecko.strict_min_version` is pinned to **`128.0`** with an email-form `gecko.id` as a **documentation-pinned hypothesis, not a confirmed floor**. Working rationale: Firefox 128 (July 2024, current ESR) is believed to be where the `optional_host_permissions` manifest key and its Add-ons-Manager grant UI are present, and where `navigator.clipboard.writeText` succeeds in the popup's secure `moz-extension://` context within transient activation without `clipboardWrite`. **This version number is load-bearing and is stated with more confidence than a doc-only pin warrants** — Firefox's MV3 host-permission and `permissions.request` behavior has shifted across releases, and the specific 128 attribution has NOT been empirically verified. **Residual risk stated plainly:** if FF128's runtime combined host-permission grant from a popup gesture requires an Add-ons-Manager interaction that breaks the gesture chain, the grant-then-auto-copy flow (the product's core promise) fails on the pinned floor. **Stage 5 MUST EXERCISE the full combined-grant-then-auto-copy flow on a running Firefox 128 (QA-53a) and raise the floor — never lower it — if either capability fails.** Optionally, verify the exact version against current MDN / Firefox release notes before locking, since this is a launch-gating cross-browser claim (FR-46/NFR-07).

## Build & Bundle

**Mechanism:** manual multi-page Vite build (`popup.html` + `options.html` as `rollupOptions.input`) + a hand-authored static `manifest.json` copied into `dist/` by a tiny inline `closeBundle` plugin + a `scripts/pack.mjs` zip step. **NOT `@crxjs/vite-plugin`** — crxjs's value is content-script/service-worker HMR and manifest-as-entry asset graphing; this extension has none of those (NFR-01 popup-only), so crxjs adds beta-channel churn and Firefox-quirk surface against the FR-46 identical-behavior lock for near-zero benefit. Required Vite settings: `base: './'` (HTML must reference `./assets/*`; absolute `/assets` 404s in the popup), `build.cssCodeSplit: false` (one shared `globals.css`, FR-50), deterministic `assetFileNames`.

**One build vs two:** ONE `dist/`. `scripts/pack.mjs` emits two identically-contented zips named per store purely for upload clarity; the single manifest's `gecko` block is ignored by Chrome (FR-46). No per-browser fork.

**Excluded deps (enforced, not reviewed):** list `maplibre-gl`, `react-map-gl`, `recharts`, `/^@tauri-apps\//` under `rollupOptions.external` so an accidental import is a BUILD ERROR (QA-50/QA-55). Icons are hand-authored inline SVG (no `lucide-react`).

**Station JSON (default import, NO `?url`):** copy the confirmed 346,916-byte asset verbatim. `tideStations.ts` imports it AS-IS with a **default JSON import** (`import stationData from '../assets/noaa-tide-stations.json'`, then `(stationData as {stations}).stations`) — a `?url` import would return a URL string, so `stationData.stations` would be `undefined` and the nearest-station lookup would break, AND it would violate the FR-20/QA-20 byte-for-byte AS-IS port mandate (the two are mutually exclusive). Emission as a single hashed asset is therefore controlled at the bundler level, NOT at the import site: set **`build.assetsInlineLimit: 0`** so Vite never inlines the file. (Vite's default 4 KB inline threshold already emits a 347 KB JSON as a separate hashed asset; `assetsInlineLimit: 0` makes that guarantee explicit and future-proof against a default change, and removes the previous `?url` instruction entirely from both the doc and `vite.config.ts`.) `build-tide-stations.mjs` is ported with only the second output target dropped (`build-tide-stations.mjs:85-92` — keep the single `src/assets/noaa-tide-stations.json` target, no backend twin); its `US_BOXES` (:32-40) MUST stay in sync with `tideStations.ts#isInUS`. Never fetched at runtime (FR-29).

> **vite.config.ts reconciliation (REQUIRED edit to the committed file):** the committed `vite.config.ts:32-37` comment and the `emitExtensionFiles` plugin currently say the station asset is imported with `?url`. That comment must be DELETED and replaced with the `assetsInlineLimit: 0` approach above. The plugin's `copyFileSync` of `src/manifest.json` → `dist/manifest.json` stays; the manifest source path must be wherever the hand-authored manifest lives (root `manifest.json` per Source Structure, or `src/manifest.json` — pick one and make the copy path match).

**Vitest goldens:** inline `test` block in `vite.config.ts` (`environment:'jsdom'`, `globals:true`, `setupFiles:['src/test/setup.ts']`, `include:['src/**/*.{test,spec}.{ts,tsx}']`). Port `weatherFormatter.golden.py` → `weatherFormatter.golden.test.ts` and add `tideFormatter.golden.test.ts`, encoding the **exact FR-19 and FR-28a byte strings** (including the U+2013 en-dash and the literal HTML `<a>` attribution) as `expect(...).toBe(...)`. SnowRaven's existing `tide.test.ts`/`tideFormatter.test.ts` are the precedent.

**Dev loop:** MV3 popups have no Vite dev server (they run from `chrome-extension://`/`moz-extension://`, not localhost): `vite build --watch` into `dist/`, load-unpacked once, Reload after each rebuild.

**Bundle estimate:** the dominant asset is the NOAA JSON (~347 KB raw / ~75 KB gz) — **the single largest asset, satisfying NFR-04/QA-55's "the trimmed NOAA station JSON shall be the only large asset."** `@photostructure/tz-lookup` is ~72 KB incl. its boundary data / ~50 KB gz (isolated in the `vendor-tz` chunk so its weight is visible in the chunk report and counted against the NFR-04 budget, and so `options.html` does not pull it in). React 19 + ReactDOM ~45 KB gz, ported pure modules + UI + seams ~10-15 KB gz, one stylesheet ~2 KB gz. No multi-MB asset ships; the founding "nearly invisible footprint" decision (product-brief.md:13,21) holds.

## Timezone Resolution

**Mechanism (single recommendation): `@photostructure/tz-lookup`** — a browser-safe, dependency-free coordinate→IANA lookup with bundled boundary data (~72 KB incl. data / ~50 KB gz). This is the option already declared in the committed `package.json:19` and isolated as `vendor-tz` in `vite.config.ts:88`, and it is the PRD's locked **default** for the still-open implementation question (PRD Open Questions: "ship a trimmed coordinate→IANA lookup (bundled tz-boundary data or a small library)"). Wrapped behind a `getTimezone(lat, lng): string` seam that replaces `invoke('get_timezone')` (`weatherService.ts:150`).

**Why this and NOT tzf-wasm (the prior draft's blocker):** stock `tzf-wasm` is ~8.2 MB uncompressed / ~3.76 MB gzipped — roughly **50× the NOAA JSON's ~75 KB gz** — which makes the WASM, by a wide margin, the largest asset and **fails NFR-04/QA-55 as written** ("the trimmed NOAA station JSON shall be the only large asset") and blows the founding "nearly invisible footprint" decision (product-brief.md:13,21). A multi-MB tz binary cannot ship in this extension. `@photostructure/tz-lookup` keeps the timezone mechanism in the tens-of-KB range, where NFR-04/QA-55 is satisfiable. (`geo-tz` is Node-only / reads data from disk and is bundler-hostile; `browser-geo-tz` fetches data over HTTP at runtime, violating FR-45 and the offline model — both rejected.)

**Parity bound — HONEST DOWNGRADE from "zero-byte by construction" to "zero-byte ON THE FR-08a ACCEPTANCE SET, verified at Stage 5":** FR-08/FR-08a require the resolved zone to produce ZERO byte difference versus the golden, because the zone selects which OpenWeather hour is fetched AND formats sunrise/sunset. The golden is produced by the desktop's `tzf_rs::DefaultFinder.get_tz_name(lng, lat)` (`src-tauri/src/lib.rs:8,12-14,43-44`) over `tzf-rs 0.4.13` + `tzf-rel 0.0.2025-c` (= timezone-boundary-builder 2025c; `Cargo.lock:5068-5086`). `@photostructure/tz-lookup` uses a different (lossy-compressed) boundary representation, so parity with `timezonefinder`/`tzf-rs` is **NOT guaranteed by construction**; it is a **testable claim on a fixed acceptance set**. The requirement is therefore satisfied as: *the chosen mechanism produces zero byte difference versus the golden across the FR-08a acceptance set — interior points, DST-boundary dates, and coordinates within a few km of an IANA tz border — verified at Stage 5 (QA-08a).* **Documented residual border risk:** because the library acknowledges lossy boundaries (its docs note a fraction of near-border points can diverge), a real-world coordinate within a few km of a tz border that is NOT in the acceptance set could resolve to a neighboring zone and shift the historical hour / mis-format local times. Mitigations: (1) the acceptance set MUST include adversarial near-border and DST cases so any divergence is caught at Stage 5; (2) if any acceptance-set point fails, the fallback is to expand the acceptance set, pin a library version that passes, or escalate to a custom-trimmed `tzf` build (land-only, 2025c data) — but ONLY with an actually-measured size that still satisfies NFR-04 (tens-to-low-hundreds of KB), never the multi-MB stock WASM; (3) the UTC fallback below ensures weather always formats even on a miss.

**API and timing:** `getTimezone(lat, lng)` is **synchronous** (so `getWeather` computes `startTs`/`endTs` before the OWM fetch). `@photostructure/tz-lookup` is itself synchronous and needs no `init()`/WASM compile step (unlike tzf-wasm), so no eager warm-up is required and no compile sits between the gesture and the clipboard write. **Argument-order note (the #1 silent-bug risk):** the desktop calls `get_tz_name(lng, lat)` (`lib.rs:44`), but `@photostructure/tz-lookup`'s exported function takes `(latitude, longitude)`. The `getTimezone(lat, lng)` seam therefore calls `tzlookup(lat, lng)` (lat-first) — DO NOT mechanically copy the desktop's `(lng, lat)` order; the seam's own `(lat, lng)` signature is the contract and is fed straight through in library order. Lock the library version in `package.json` and re-verify the FR-08a golden whenever EITHER runtime bumps tz data (QA-08a).

**UTC fallback (FR-08):** the seam coerces a `null` / empty-string return, a thrown error, or any failure to `'UTC'` before returning, mirroring SnowRaven's `... or "UTC"` default, so weather still formats.

**Size impact:** ~72 KB incl. boundary data / ~50 KB gz — counted against the NFR-04 budget (the `vendor-tz` chunk) and well under the NOAA JSON, so the JSON remains the only large asset. This is the price of an ACCEPTANCE-SET-verified parity bound rather than a by-construction one; the prior draft's multi-MB tzf-wasm is explicitly rejected. **package.json, vite.config.ts, and this section now all agree on `@photostructure/tz-lookup` — the prior internal contradiction (doc said tzf-wasm; the committed build shipped tz-lookup) is resolved in favor of the committed build and the size ceiling.**

## Data Flow & State

End-to-end control flow (popup open IS the user gesture; popup script runs in the popup document, no content script, no worker):

- **Phase 0 — Resolve keys (FR-41).** On mount, read both keys via `ext/storage.ts`. (No WASM/init step — the timezone library is synchronous JS with no warm-up.) `keyStatus===null` means *resolving*, NEVER *missing* — no fetch/permission/copy fires.
- **Phase 1 — Read active tab + validate (synchronous, FR-01..04).** `chrome.tabs.query` → URL; require `https` + `ebird.org` host, then `extractChecklistId` + `isValidChecklistId` (`/^S\d+$/`). `chrome://`/`about:`/non-ebird/invalid → `not-on-checklist` (calm info, no fetch/copy/permission). Distinct from no-coordinates (FR-06a).
- **Phase 2 — Key gate (FR-41/42).** Required key `null` → `missing-keys` (one nudge per missing key, "Go to Settings →" via `chrome.runtime.openOptionsPage`). Missing eBird blocks both; missing OpenWeather blocks weather only (tide may proceed, NOAA keyless).
- **Phase 3 — Combined permission request (FR-43a/44).** One `chrome.permissions.request` for all three origins from the gesture. Denied → `permission-blocked` recoverable retry; blocks both.
- **Phase 4 — Shared eBird resolution (FR-05/06/06a/07).** One `fetchChecklist` for BOTH blocks (region-centre-first chain; no page pin). A 401/403 here throws the FR-36 eBird key-invalid string (via `ext/errorMap.ts`).
- **Phase 5 — Timezone (FR-08/08a).** `getTimezone(lat,lng)` (sync, `@photostructure/tz-lookup`) BEFORE the OWM fetch; same zone feeds `parseLocalDateTimeInZone` (hour selection) AND sunrise/sunset formatting; UTC fallback.
- **Phase 6 — Weather + tide in parallel (FR-35, NFR-05).** Two independent chains, each catching its own error so neither rejects the other. Weather: `startTs`/`endTs` → 1-or-2 concurrent timemachine calls in `[start,end]` order → `formatWeather`. Tide: reuse the shared checklist → `nearestStation` → `classifyTideLocation` → 3 concurrent NOAA calls → `computeTideReading` → `formatTide`. Tide NEVER blocks weather.
- **Phase 7 — Auto-copy weather is RELIABLE via `clipboardWrite` (FR-30/31/48a/NFR-06).** On weather success ONLY, `copyText(formatWeather output)`; because the manifest holds `clipboardWrite`, the write succeeds even though it follows the awaited lookup (the permission removes the transient-activation requirement). Tide is NEVER auto-copied. `copyText` returns boolean, never throws; on `false`, no "Copied!" flip, the block stays visible/selectable, and the polite live region announces the FR-48a failure guidance pointing at the focus-ordered manual Copy button — **this failure path is a designed-for, expected outcome on slow networks, not a rare edge.**

### Auto-copy activation — resolved by `clipboardWrite`

**Decision (locked):** the manifest holds `clipboardWrite`, which removes the transient-activation requirement for `navigator.clipboard.writeText`, so the post-lookup auto-copy is reliable and is the contractual one-click path. The analysis below records *why* the permission was added; the manual Copy button remains as an accessibility affordance and a fallback for an unexpected write failure. Stage 5 verifies the end-to-end copy on both engines against reliable auto-copy + manual affordance (QA-30/QA-31/QA-48a/NFR-06).

The weather clipboard write necessarily follows multiple awaited network round-trips (eBird checklist view + coordinate chain + 1–2 OWM calls). SnowRaven's own `clipboard.ts:3-11` documents exactly this hazard: a `navigator.clipboard.writeText` that runs AFTER an `await` can lose user activation and throw `NotAllowedError` — which is precisely why the desktop uses the native Tauri clipboard plugin instead of the web branch this extension is forced to keep. "First microtask after weather resolves" preserves microtask ordering but does **not** by itself restore an activation that prior network `await`s may have consumed.

**Honest position:** transient activation has a window (~5 s in Chromium) but is **consumed** by a prior `writeText`, and ~1–2 s of network on a fresh popup activation can leave the write inside or outside the window depending on network. The architecture does NOT assume the activation always survives. Instead:

1. **Designed-for primary path (guaranteed):** the **manual weather Copy button** (FR-32/FR-48a) is the guaranteed copy path. It is always rendered on weather success, is in the focus order with its FR-48 accessible name (`Copy weather to clipboard`), and a press is a fresh user gesture so its `writeText` is always inside activation. The headline "one click → on the clipboard" is delivered by auto-copy when activation survives, and reliably recoverable by the manual button when it does not.
2. **Best-effort auto-copy:** attempted as described, success announced `Weather copied to clipboard` (FR-48a); on failure the live region announces `Weather ready — use the Copy weather button to copy` and does NOT say "copied" (FR-48a). FR-31's failure path is treated as **expected on slow networks**, not an edge case.
3. **Stage-3 verification task (REQUIRED, blocking before implementation sign-off):** empirically determine, on current Chromium and Gecko in an extension popup, whether transient user activation persists across awaited fetches long enough for the post-network `writeText` to succeed, and whether the `execCommand('textarea')` fallback in `copyText` succeeds when `navigator.clipboard.writeText` does not. If activation does NOT reliably survive ~1–2 s of network, the auto-copy is documented as best-effort-only and the manual button is the contractual path; QA-30/QA-31/QA-48a/NFR-06 are validated against THAT designed behavior (best-effort auto-copy + guaranteed manual recovery), not against an assumed always-succeeds auto-copy.

**Popup state machine — top-level (mutually exclusive):** `not-on-checklist` (FR-04) · `missing-keys` (FR-41/42) · `permission-blocked` (FR-44) · `loading` (combined "Loading weather & tide…" only while NOTHING resolved, FR-35) · `result` (renders the two independent sub-machines).

**Weather sub-machine:** `loading` → `success` (renders `formatWeather` `<pre>`, manual Copy button always present; best-effort auto-copy attempted once on this transition) | `error` (role=alert, FR-36 message via `ext/errorMap.ts`; nothing auto-copied).

**Tide sub-machine** (`TideStatus='ok'|'too-far'|'outside-us'|'unavailable'|'error'`): `loading` → `ok` (`formatTide` `<pre>` + Copy button, active only here, never auto-copied) | `too-far`/`outside-us` (amber `tideTooFarNotice` with `toFixed(0)` + `tideOverrideLabel` override button re-running with `force=true`) | `unavailable` (quiet role=status "No tide reading available.") | `error` (quiet role=status "Tide data unavailable right now."). `unavailable`/`error` are NEVER alerts and NEVER block weather.

State ownership: `Popup.tsx` owns `keyStatus`, `pageState`, `weatherState`, `tideState`. The desktop "idle"/Load-button state collapses into `loading` (popup auto-runs on open, so the gesture's activation is spent on the best-effort auto-copy, not a second click).

## Error Architecture

Weather messages key off the eBird/OpenWeather **RESPONSE status** (and the thrown error MESSAGE for no-coords/missing-key), **NOT** the remapped numeric thrown status (FR-36; `weatherService.ts:23-25,88`). The 401/403 key-invalid strings are **NEW logic** that does not exist in SnowRaven source — they are owned by `src/lib/ext/errorMap.ts` and emitted by a small reworked branch in `weatherService.ts` (see Module & Port Map). All OTHER mappings are the existing ported throws. Taxonomy → message map:

| Trigger | Detect | WEATHER block (role=alert) | TIDE result | New vs ported |
|---|---|---|---|---|
| eBird checklist 404 | `res.status===404` | `Checklist not found. Check the ID and try again.` | `error` (fetchChecklist throw escapes getTide pre-seam, FR-37a) | ported |
| eBird 401/403 | `res.status` 401/403 | `eBird API key invalid. Check it in Settings.` | `error` | **NEW** (errorMap.ts branch in `fetchChecklist`) |
| Any other non-OK eBird (incl. 429) | `!res.ok` | `Could not fetch checklist data. Please try again.` | `error` | ported |
| No coordinates (all 3 sources) | lat/lng null | `Could not find coordinates for location {locId}.` | `error` — BOTH blocks from one throw (FR-06a) | ported |
| OpenWeather 401/403 | OWM `res.status` 401/403 | `OpenWeather API key invalid. Check it in Settings.` | UNAFFECTED (FR-35) | **NEW** (errorMap.ts branch in `getWeather`) |
| Any other non-OK OpenWeather (incl. 429) | `!res.ok` | `Weather data unavailable for this checklist.` | UNAFFECTED | ported |
| Missing OpenWeather key | key null at gate | `missing-keys` nudge (FR-41), not an alert; weather blocked, tide proceeds | proceeds | ported gate |
| Missing eBird key | key null | `missing-keys` nudge blocks BOTH | `error` if reached (FR-37a #1); normally pre-empted by `missing-keys` | ported gate |
| NOAA error body / fetch / parse throw | `getJson`→null; parse→`[]`; reading→null | UNAFFECTED | `unavailable` — NEVER `error` (FR-25/FR-37a) | ported |
| Nearest station null (empty bundle) | `nearestStation` null | UNAFFECTED | `unavailable` | ported |
| Network failure / timeout on eBird | fetch throws | `Something went wrong. Please try again.` | `error` | ported |
| Combined permission denied | `request` false | NOT a weather alert — `permission-blocked` TOP state; neither block fetches (FR-44) | — | ext-glue |

**Why the 401/403 rows are NEW (correcting the prior draft's "byte-identical via FR-36" claim):** in SnowRaven source, `fetchChecklist` (`weatherService.ts:25`) lumps EVERY non-404 non-OK eBird response (including 401/403) into `Could not fetch checklist data. Please try again.`, and `fetchHistorical` (`weatherService.ts:88`) throws `Weather data unavailable for this checklist.` for ANY non-OK OWM (401/403 included). The desktop UI (`WeatherTideSection.tsx:37-39`) just surfaces `err.detail`/`err.message` with no status branching. The strings `eBird API key invalid` / `OpenWeather API key invalid` **do not exist anywhere in the SnowRaven frontend.** FR-36's 401/403 key-invalid taxonomy is therefore genuinely NEW code that must inspect `res.status` and emit new strings — it cannot be a byte-identical port. `weatherService.ts` is thus marked REWORKED-with-a-named-branch (not "bodies byte-identical"), and `ext/errorMap.ts` is the single owner of the new status→message mapping. The `formatWeather`/`formatTide` byte output is unaffected and remains byte-identical (FR-13..FR-19, FR-28/FR-28a goldens unchanged).

**Tide status union & the `error` divergence (FR-37a):** the ported tide SERVICE returns four statuses (`ok`/`too-far`/`outside-us`/`unavailable`); the UI adds a fifth, `error`, declared in `types.ts`. `error` is produced ONLY when `getTide` throws **before** the `getJson` seam — exactly two causes: (1) missing eBird key (`tideService.ts:52-53`), (2) any `fetchChecklist` throw (eBird 404, eBird 401/403, non-OK eBird, or no-coords). EVERY NOAA-side failure is swallowed by `getJson`→null / parse→`[]` / `computeTideReading`→null and degrades to `unavailable`, never `error`. (The new eBird 401/403 throw lands in cause #2 and surfaces as tide `error`, consistent with FR-37a.)

**Permission-denied degradation:** under the locked combined model (FR-43a), denial is handled upstream as the `permission-blocked` top state — neither block fetches, so neither reaches an error/unavailable state. The per-origin "only NOAA denied → tide unavailable" matrix is explicitly NOT built in v1.

**Notes:** 429 (rate-limit) deliberately falls into the generic "try again" / "unavailable" buckets, NOT a key-invalid message (QA-36a). The 401/403 "Check it in Settings." messages point to the Options page. On ANY weather error, nothing is auto-copied.

## No Data Layer Work Required

The Engineer proceeds directly to UI/logic implementation; there is no schema, no tables, and no migrations to run.