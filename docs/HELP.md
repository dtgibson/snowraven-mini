# SnowRaven Mini Documentation

SnowRaven Mini is a lightweight browser extension for birders who use eBird. It runs in Chrome and Firefox as a Manifest V3 extension and does exactly one thing: it puts SnowRaven's weather and tide comment blocks onto the eBird checklist page. Open an eBird checklist's Edit Comments page, click the toolbar icon, and the weather block is fetched, formatted, and copied to your clipboard ready to paste, with the historical tide shown right below it.

This documentation covers what SnowRaven Mini is and how it relates to the SnowRaven desktop app, how to get the two free API keys it needs, how to install it in both browsers, the Options page, how to use it on a checklist, every state the popup can show, the exact output format, privacy and permissions, troubleshooting, how it works under the hood, and development.

## Contents

- [What SnowRaven Mini Is](#what-snowraven-mini-is)
- [How It Relates to SnowRaven](#how-it-relates-to-snowraven)
- [Getting Your Two Free API Keys](#getting-your-two-free-api-keys)
- [Installing](#installing)
- [The Options Page](#the-options-page)
- [Using It on a Checklist](#using-it-on-a-checklist)
- [Popup States](#popup-states)
- [The Weather and Tide Output Format](#the-weather-and-tide-output-format)
- [Privacy and Permissions](#privacy-and-permissions)
- [Troubleshooting](#troubleshooting)
- [How It Works](#how-it-works)
- [Development](#development)

---

## What SnowRaven Mini Is

SnowRaven Mini is a popup-only Manifest V3 extension for Chrome and Firefox. It has one feature: weather and tide on the eBird checklist page.

When you are on a checklist's **Edit Comments** page (`https://ebird.org/edit/effort?subID=S…`), one click on the SnowRaven Mini toolbar icon:

1. Resolves the checklist's location and time by calling the eBird API.
2. Fetches the historical weather for that location and hour from OpenWeather (the One Call "timemachine" endpoint).
3. Fetches the historical tide for that location and time from the nearest NOAA tide station.
4. Formats both in the same format as the SnowRaven desktop app, exactly like SnowRaven.
5. **Automatically copies the weather block to your clipboard**, with a visible "Copied to clipboard" confirmation, so you can paste it straight into your checklist comment.
6. Shows the tide block below the weather, with its own **Copy** button.

On a checklist **view** page (`https://ebird.org/checklist/S…`), where there is no comment field to paste into, it offers an **Open Edit Comments** link and a **Show weather anyway** button.

Everything runs in your browser. There is no backend, no server, no account, no analytics, and no telemetry. You bring your own free eBird and OpenWeather API keys, entered once on the Options page and stored on your device. NOAA's tide service needs no key.

That is the whole product. SnowRaven Mini is intentionally small: a focused companion for birders who do their checklist editing in the browser and just want SnowRaven's weather and tide blocks without launching the desktop app.

---

## How It Relates to SnowRaven

[SnowRaven](https://github.com/dtgibson/snowraven) is a full desktop app (and self-hosted server) with many tabs: weather lookups, life-list analytics and statistics, a map explorer, breeding-code history, Macaulay Library media coverage, species detail, named birds, a list comparer, and more.

SnowRaven Mini is **not** a port of all of that. It is the lightweight, in-browser companion that carries over exactly one piece of SnowRaven: the **weather and tide comment blocks**. The weather, tide, and formatting logic are ported from SnowRaven's TypeScript in the same format SnowRaven produces, so a block produced by SnowRaven Mini is identical to one produced by the desktop app.

SnowRaven Mini does **not** include any of SnowRaven's other features. There are no maps, no geolocation or "use my location," no life list, statistics, or analytics, no Macaulay Library or media tracking, no species detail, no breeding codes, no named birds, no list comparer, and no CSV or data-file imports. If you want those, use the SnowRaven desktop app. If you just want the weather and tide block on a checklist you are editing in your browser, SnowRaven Mini is the quickest path from click to paste.

You can use both: SnowRaven on the desktop for analysis, SnowRaven Mini in the browser for quick checklist annotation. The blocks they produce are interchangeable.

---

## Getting Your Two Free API Keys

SnowRaven Mini is **bring-your-own-key**. You need two free keys, entered once on the Options page. Each key is sent only to its own API host, and both are stored on your device. The third data source, NOAA tide, needs no key.

An API key is a private code that identifies your account when the extension contacts an external service. Think of it like a password the extension uses on your behalf. Both keys are free.

### eBird API key

The eBird API key lets SnowRaven Mini look up the checklist's location and time. It is needed for **both** weather and tide.

To get your key:

1. Sign in to your eBird account at [ebird.org](https://ebird.org).
2. Go to [ebird.org/api/keygen](https://ebird.org/api/keygen).
3. Your key is shown on that page. Copy it.
4. Paste it into the **eBird API key** field on the Options page (see [The Options Page](#the-options-page)).

Keep your key private. It is tied to your eBird account and should not be shared or published.

### OpenWeather API key

The OpenWeather API key lets SnowRaven Mini fetch the historical weather for the checklist's hour.

**Important:** after creating your OpenWeather account, you must subscribe to the **"One Call by Call"** plan separately. The key is **not** activated for the One Call 3.0 API automatically when you create an account. Without this step, weather lookups return an error even though your key is otherwise valid. The free tier covers a generous number of calls per day at no cost, well above what a typical birder needs.

To get your key:

1. Create a free account at [openweathermap.org/api](https://openweathermap.org/api).
2. Go to **API keys** in your account dashboard and copy the default key.
3. Subscribe to **One Call by Call** (this enables the One Call 3.0 timemachine endpoint the extension uses).
4. Paste the key into the **OpenWeather API key** field on the Options page.

A brand-new OpenWeather key can take a little while (often up to a couple of hours) to become active after you create the account. If weather lookups fail immediately after signup, wait and try again.

---

## Installing

SnowRaven Mini is on the **Chrome Web Store** ([listing](https://chromewebstore.google.com/detail/snowraven-mini/dfbphfbhbehdlfepoigechmjbifpndhc)) as **v1.3.0** — the one-click install for Chrome, Microsoft Edge, and other Chromium browsers. It's also on **Firefox Add-ons** ([listing](https://addons.mozilla.org/firefox/addon/snowraven-mini/)) as **v1.3.0** — the one-click install for Firefox. The same build works in both browsers: one codebase, one manifest. Chrome ignores the Firefox-specific `gecko` block in the manifest; Firefox reads it.

### From the Chrome Web Store (recommended for Chrome)

1. Open the [Chrome Web Store listing](https://chromewebstore.google.com/detail/snowraven-mini/dfbphfbhbehdlfepoigechmjbifpndhc).
2. Click **Add to Chrome**, then **Add extension** to confirm.
3. **Pin it to the toolbar** (puzzle-piece icon → pin) so the popup is one click away.

### Install on Microsoft Edge

Edge is built on Chromium, so it installs the Chrome Web Store version directly, once you let Edge use extensions from other stores (a setting that is off by default).

1. In Edge, open the [Chrome Web Store listing](https://chromewebstore.google.com/detail/snowraven-mini/dfbphfbhbehdlfepoigechmjbifpndhc).
2. Edge shows a banner, **"Allow extensions from other stores."** Click **Allow**. (You can also turn it on first: the **Settings and more** (**⋯**) menu → **Extensions** → **Manage extensions**, then switch on **Allow extensions from other stores** at the bottom of the left pane.)
3. Back on the listing, click **Add to Chrome**. It still says "Chrome" in Edge; that is just the Chrome Web Store's own button. Review the permissions, then click **Add extension**.
4. **Pin it to the toolbar** (puzzle-piece icon → pin) so the popup is one click away.

Other Chromium browsers (Brave, Vivaldi, Opera) install the same way from the Chrome Web Store.

### From Firefox Add-ons (recommended for Firefox)

1. Open the [Firefox Add-ons listing](https://addons.mozilla.org/firefox/addon/snowraven-mini/).
2. Click **Add to Firefox**, then **Add** to confirm.
3. **Pin it to the toolbar** so the popup is one click away.

### From the GitHub release (a manual install)

Prefer not to use a store, or want to pin a specific version? Install from the release zip (or build from source below). Both produce the same unpacked extension folder.

1. Go to the [latest release](https://github.com/dtgibson/snowraven-mini/releases/latest) and download the **Chrome** zip or the **Firefox** zip.
2. Unzip it to a folder you will keep (the unpacked extension lives there).
3. Load it unpacked using the browser instructions below.

### Building from source

From the project folder:

```bash
npm install        # first time only
npm run build      # type-checks, then builds into dist/
```

When it finishes you will have a `dist/` folder containing `popup.html`, `options.html`, `manifest.json`, and an `assets/` folder. That `dist/` folder is the unpacked extension. To rebuild automatically while you work, run `npm run dev`; it watches and rebuilds into `dist/`; reload the extension in the browser after each rebuild (see below).

### Load unpacked in Chrome (or any Chromium browser: Edge, Brave, …)

1. Open `chrome://extensions`.
2. Turn on **Developer mode** (top-right toggle).
3. Click **Load unpacked** and pick the unpacked folder (the unzipped release folder, or `dist/`).
4. SnowRaven Mini appears in your extensions. **Pin it to the toolbar** (puzzle-piece icon → pin) so the popup is one click away.
5. If you rebuilt from source, click the **Reload** (↻) icon on the extension card to pick up the changes.

### Load in Firefox (version 128 or newer)

1. Open `about:debugging#/runtime/this-firefox`.
2. Click **Load Temporary Add-on…**.
3. Select the **`manifest.json`** file inside the unpacked folder (the file, not the folder).
4. SnowRaven Mini loads until you restart Firefox. **Temporary add-ons do not persist across restarts**; just load it again after a restart (see the [troubleshooting note](#firefox-forgot-the-extension-after-a-restart)).
5. If you rebuilt from source, click **Reload** next to the add-on on the same page.

Firefox 128 is the minimum supported version (set by the manifest's `strict_min_version`). On older Firefox the add-on will not load.

After installing, add your two keys on the Options page before your first lookup.

---

## The Options Page

The Options page is where you enter and manage your two API keys. It opens in its own browser tab.

To open it:

- **Chrome:** `chrome://extensions` → SnowRaven Mini → **Details** → **Extension options**.
- **Firefox:** `about:addons` → SnowRaven Mini → **Preferences**.
- **Or** when the popup nudges you that a key is missing, click **Go to Settings →**.

The page has two fields (**eBird API key** and **OpenWeather API key**), each with:

- A **Get a free key ↗** link beside its label, opening the right signup/keygen page in a new tab.
- A short help line: the eBird field notes it "resolves the checklist's location and time, needed for both weather and tide"; the OpenWeather field notes it "fetches historical weather for the checklist's hour" and that "tide (NOAA) needs no key."
- A **reveal toggle** (the eye icon). Keys are entered as masked password fields by default; click the eye to show or re-mask a key so you can check what you pasted. The toggle is labeled for screen readers ("Show / Hide eBird API key").

**Entering or updating a key.** Paste (or edit) the key into its field and click **Save keys**. A green **Saved** confirmation appears (and is announced to screen readers). Changes take effect immediately; there is nothing to restart.

**Clearing a key.** Clear the field and click **Save keys**. An empty field deletes the stored key. (Leading and trailing whitespace is trimmed automatically when you save.)

At the bottom, a privacy line reads: **"Keys stay on this device. They're sent only to eBird and OpenWeather as your request's authentication, nowhere else."** Both keys live in `chrome.storage.local` (your browser's local storage on this device) and are never sent to any SnowRaven server, because there isn't one.

The page is fully keyboard-operable: Tab through the fields, reveal toggles, and the Save button, and each control shows a visible green focus ring.

---

## Using It on a Checklist

The intended flow is fast: open the Edit Comments page, click the icon, paste.

1. Open an eBird checklist's **Edit Comments** page. Its URL looks like `https://ebird.org/edit/effort?subID=S12345678`. (From a checklist's view page on eBird, this is the page you reach via the comment-editing controls; SnowRaven Mini can also link you there. See [the checklist-view state](#youre-on-the-checklist-page-checklist-view).)
2. Click the **SnowRaven Mini** toolbar icon to open the popup.
3. The **first time only**, the popup asks permission to reach eBird, OpenWeather, and NOAA. Click **Grant access** (a single grant covers all three; see [the permission state](#allow-snowraven-mini-to-reach-these-permission-needed)).
4. The popup shows **Loading weather & tide…**, then fills in two blocks.

**The weather block.** When the lookup succeeds, the weather block appears as a monospace card under a "Weather" eyebrow, and it is **automatically copied to your clipboard**. A green confirmation banner appears under it (**"Copied to clipboard. Paste it into your checklist comment."**) and a screen-reader announcement says "Weather copied to clipboard." Just switch to the eBird comment field and paste. The auto-copy happens once per popup open; the visible **Copy** button on the weather card is there to re-copy any time (for example if you copied something else in between).

**The tide block.** Below the weather, the tide block appears as its own monospace card under a "Tide" eyebrow, with its own **Copy** button. Tide is **never auto-copied**; copy it with its button when you want it. If your checklist is inland or outside the US, you will see a calm amber notice instead, with an override to show the nearest station anyway (see [the tide notices](#tide-too-far-or-outside-the-us)).

**What gets copied.** The weather block (auto-copied on open, or by the weather **Copy** button) is the weather text only, ending with the SnowRaven attribution line. The tide **Copy** button copies the tide text only, ending with its "Tide data from NOAA CO-OPS · via SnowRaven" credit. The two blocks are copied separately. (In this version there is no single combined "weather + tide together" copy button; copy each block in turn if you want both.) See [the output format](#the-weather-and-tide-output-format) for exactly what each block contains.

If you open the popup on a page that is not an eBird checklist, it tells you so calmly and does nothing else.

---

## Popup States

The popup is small (about 380px wide) and shows exactly one state at a time. Here is every state you can see.

### Loading

A calm **"Loading weather & tide…"** row with a spinner while the lookup runs. The spinner respects reduced-motion settings (it freezes rather than animating when you have reduced motion turned on). Inside the result view, the weather and tide cards each show their own brief "Loading weather…" / "Loading tide…" status while their requests are in flight.

### No checklist on this page

A calm, non-error message: **"No checklist on this page"** with the line **"Open a checklist's Edit Comments page to get its weather."** You see this whenever the active tab is not an eBird checklist (or its URL carries no valid `S…` checklist ID). Nothing else happens.

### Missing-keys nudge

If one or both keys are not set, the popup shows a neutral nudge naming what is missing:

- Both missing: **"eBird and OpenWeather API keys aren't set yet. Add them once and a single click does the lookup."**
- Only eBird missing: **"eBird API key isn't set yet…"** (and it notes "OpenWeather key: set ✓").
- Only OpenWeather missing: **"OpenWeather API key isn't set yet…"** (and it notes "eBird key: set ✓").

A **Go to Settings →** action opens the Options page. Both keys are required in this version; the extension will not run a partial lookup with only one key.

### Allow SnowRaven Mini to reach these? (permission needed)

The first time you run a lookup, the popup shows a one-time permission prompt: **"Allow SnowRaven Mini to reach these?"** with the line "It needs to call eBird, OpenWeather, and NOAA directly from your browser, nothing else," a list of the three hosts (`api.ebird.org`, `api.openweathermap.org`, `api.tidesandcurrents.noaa.gov`), and a filled-green **Grant access** button.

This prompt exists because the browser requires a real click (a "user gesture") to grant host permissions; it cannot be requested automatically when the popup opens. Clicking **Grant access** grants all three hosts at once and immediately runs the lookup. After that first grant, the popup goes straight to the result on later opens. If you dismiss or deny the request, the popup stays on this Grant screen; click **Grant access** again to proceed.

### You're on the checklist page (checklist-view)

If you open the popup on a checklist **view** page (`https://ebird.org/checklist/S…`) rather than the Edit Comments page, there is no comment field to paste into. The popup shows **"You're on the checklist page"** with the line "To paste the weather into a comment, open this checklist's **Edit Comments** page, or show it here anyway," and two actions:

- **Show weather anyway** runs the lookup right there (this click also serves as the gesture for the one-time permission grant, if you have not granted yet). The weather is still auto-copied, even though you cannot paste it on this page.
- **Open Edit Comments →** is a link that opens the same checklist's `…/edit/effort?subID=…` page in a new tab, where you can paste.

### Result: weather and tide

The happy path. The weather block (auto-copied, with its green "Copied to clipboard" banner) sits above the tide block. Each block is a monospace card with its own **Copy** button; pressing a Copy button flips it to **"Copied!"** for about two seconds and announces the copy to screen readers. See [Using It on a Checklist](#using-it-on-a-checklist) and [the output format](#the-weather-and-tide-output-format).

### Tide too far, or outside the US

NOAA covers only the US and its territories, and a station that is far from your spot may not reflect local conditions. The weather block shows normally; the tide slot is replaced by an amber notice:

- **Too far (in the US):** *"The nearest tide station is N miles away (Station Name). Tide data may not reflect your spot."* with a **Show it anyway** button.
- **Outside the US:** *"Tide information is only available in the US. The nearest US station is Station Name, N miles away."* with a **Show nearest US station** button.

The "too far" notice appears when the nearest station is more than 25 miles from your checklist. The override button re-runs the tide lookup with the distance/region check relaxed, using that same nearest station, so you can see its reading anyway if you judge it close enough.

### No tide

If NOAA has no usable tide reading for that spot and time (no station resolves, or the data does not yield a reading), the tide slot shows a calm **"No tide reading available."** The weather block is unaffected.

### Errors

Errors are scoped so one block's failure never blocks the other.

- **Weather error:** an alert card showing the specific message (for example, "eBird API key invalid. Check it in Settings." or "OpenWeather API key invalid. Check it in Settings.") with an **Open Settings →** link. See [Troubleshooting](#troubleshooting) for the full set of messages.
- **Tide error:** a quiet **"Tide data unavailable right now."** row. This appears when the tide lookup itself fails (for example, the underlying checklist resolution failed); weather may still succeed on its own.

If something unexpected happens during the open sequence, the popup falls back to a result view with an error rather than spinning forever.

---

## The Weather and Tide Output Format

The blocks are rendered in SnowRaven's format, the same format SnowRaven produces: literal lines, joined with single newlines, no blank lines, and no trailing newline. The text is shown in a monospace card with `white-space: pre`, so on-screen wrapping never changes the bytes you copy.

One detail to know: the SnowRaven attribution at the end of each block is a literal HTML `<a>` link in the copied text. **On screen it looks like raw HTML; once you paste it into an eBird comment, eBird renders it as a real "SnowRaven" link.** That is expected; copy and paste as-is.

### Weather block

The weather block has, in order: a condition emoji, the condition text, then labeled lines for temperature, wind (Beaufort description), wind direction (8-point compass), cloud cover, humidity, dew point, sunrise, and sunset, and finally the SnowRaven attribution line. Ranges (for example, temperature) appear as `low - high` when the checklist spans more than one hour and the values differ; a single value shows alone. Temperatures and dew point are in °F. Sunrise and sunset are in the **checklist's local time**.

Example weather block:

```
☁️
Overcast clouds
Temperature: 54°F
Wind: Gentle breeze
Wind Direction: W
Cloud Cover: 100%
Humidity: 89%
Dew point: 52°F
Sunrise: 5:08am
Sunset: 6:53pm
Weather generated by <a href="https://github.com/dtgibson/snowraven">SnowRaven</a>
```

A multi-hour checklist with changing conditions produces ranges and dash-joined values, for example `Temperature: 60 - 65°F`, `Wind: Light breeze - Fresh breeze`, and `Wind Direction: E - NE`.

### Tide block

The tide block has, in order: a wave emoji, a **Observed** / **Predicted** label (Observed when a real gauge reading exists, Predicted otherwise), the water level (or level range, in feet), whether the tide was **Rising** or **Falling** (noting "(turned during your checklist)" if it turned), the surrounding previous and next high/low tides with their local times, the station name, ID, and distance, the line **"Relative to MLLW"** (the standard US tide-table reference), and the NOAA + SnowRaven credit line.

Example tide block:

```
🌊
Observed
Water level: 2.3 – 5.6 ft
Tide: Rising (turned during your checklist)
Previous low: 1.8 ft at 7:42am
Next high: 5.6 ft at 1:58pm
Station: The Battery (8518750), 3.4 mi away
Relative to MLLW
Tide data from NOAA CO-OPS · via <a href="https://github.com/dtgibson/snowraven">SnowRaven</a>
```

(The dash in the water-level range is an en dash, and the credit's `·` is a middle dot; both are part of the exact format.)

---

## Privacy and Permissions

SnowRaven Mini has **no backend, no server, no account, no analytics, and no telemetry.** Everything runs in your browser, and your data goes only to the three data providers, with each key only to its own provider.

**Where your keys live.** Your eBird and OpenWeather keys are stored in `chrome.storage.local` on your device. They never leave it except to authenticate your requests:

- The **eBird key** is sent only to `api.ebird.org`.
- The **OpenWeather key** is sent only to `api.openweathermap.org`.
- **NOAA** (`api.tidesandcurrents.noaa.gov`) is keyless; no credential is ever sent there.

**Permissions the extension declares:**

- **`activeTab`**: to read the URL of the tab you are on, so it can find the checklist ID. It does not read page content; only the current tab when you open the popup.
- **`clipboardWrite`**: to copy the weather (and tide, on button press) to your clipboard. Declaring this is what makes the auto-copy reliable.
- **`storage`**: to save your two keys in `chrome.storage.local`.

**Host permissions are optional and on-demand.** The three API hosts are declared as `optional_host_permissions`, not granted at install. The extension requests them only when you first run a lookup, from your click on **Grant access**, and you grant all three at once. Until then it makes no network calls.

There is **no content script and no background worker**: the entire extension is the popup and the Options page. When the popup is closed, nothing is running.

---

## Troubleshooting

### "eBird API key invalid. Check it in Settings." / "OpenWeather API key invalid. Check it in Settings."

The saved key is wrong or expired (the API returned 401/403). Open the Options page (the **Open Settings →** link on the error card takes you there), re-paste the correct key, and click **Save keys**.

### Weather fails right after creating an OpenWeather account (One Call 3.0 not yet activated)

Two common causes:

1. **You have not subscribed to "One Call by Call."** The One Call 3.0 timemachine endpoint the extension uses is a separate subscription from the default key. Go to your OpenWeather account, subscribe to **One Call by Call** (free tier), and try again. See [Getting Your Two Free API Keys](#getting-your-two-free-api-keys).
2. **The key is brand new.** A freshly created OpenWeather key can take up to a couple of hours to activate. Wait and retry.

In this scenario the extension does not surface any special "not activated" message. If the key is genuinely invalid you will get the "OpenWeather API key invalid. Check it in Settings." message, and if the subscription is the issue you will get the generic "Weather data unavailable for this checklist." Both point you back to the same checks.

### "Checklist not found. Check the ID and try again."

The eBird API returned 404 for that checklist ID. Make sure you are on a real checklist page and that the `S…` ID in the URL is correct.

### "Could not find coordinates for location …" (no coordinates for a checklist)

The extension resolves a checklist's coordinates from eBird (location region info, then the exact location's recent lists, then recent observations there). A few checklists, typically very sparse or unusual locations, yield no coordinates at all, and without coordinates there is no weather or tide to fetch. This is rare; there is no workaround within the extension for those checklists.

### Tide shows an amber "too far" / "outside US" notice, or "No tide reading available"

NOAA covers only the US and its territories, and the nearest usable station may be far from your spot. For inland or non-US checklists you will see the amber notice with a **Show it anyway** / **Show nearest US station** override; press it to see the nearest station's reading anyway. "No tide reading available" means NOAA returned nothing usable for that spot and time; your weather block is unaffected.

### Weather copied but tide is unavailable

The weather and tide lookups are independent. If tide fails or has no nearby station, you still get the weather block (auto-copied); copy and paste it as usual; tide is simply omitted.

### Slow network: nothing got copied automatically

The auto-copy is best-effort and happens within the browser's clipboard-activation window after the popup opens. On a very slow lookup the window can lapse before the weather is ready, in which case the auto-copy is skipped and you will hear "Weather ready. Use the Copy weather button to copy." The weather block still appears with no green banner; just press its **Copy** button. That path is always reliable.

### Firefox forgot the extension after a restart

In Firefox, a **temporary add-on** (loaded via `about:debugging`) is cleared when you restart the browser. This is a Firefox limitation for unpacked add-ons, not a bug. Re-load it via `about:debugging#/runtime/this-firefox` → **Load Temporary Add-on…** after each restart. (Your saved keys persist in storage across reloads.)

### The popup spins forever

This should not happen; the extension renders an error state instead of spinning on an unexpected failure. If you do see an endless spinner, close and reopen the popup; if it persists, confirm you granted the host permissions on the Grant access screen.

---

## How It Works

**Ported from SnowRaven in the same format SnowRaven produces.** The weather, tide, and formatting logic are the SnowRaven desktop app's TypeScript, carried over so the output is byte-identical. Only the platform "seams" are swapped for browser equivalents: the desktop's native fetch becomes the browser's fetch, native clipboard/storage become the browser's clipboard and `chrome.storage.local`, and the desktop's native timezone lookup becomes an **in-browser timezone** resolver (`@photostructure/tz-lookup`) that turns the checklist's coordinates into an IANA timezone with no extra network call. That timezone is what makes the sunrise/sunset and tide times read in the checklist's local time.

**The lookup, step by step.** When you open the popup on an Edit Comments page, it resolves your keys and reads the active tab's URL, gates on having both keys and host permission, then calls eBird once to resolve the checklist's location, time, and duration (this single resolution is shared by both blocks). It computes the local timezone from the coordinates, then runs the weather and tide requests **in parallel**: OpenWeather's One Call timemachine for each relevant hour, and NOAA's CO-OPS datagetter for water level, predictions, and high/low tides around your checklist window. Each block catches its own errors, so one failing never blocks the other. Finally, the weather block is auto-copied.

**Edit vs. view detection.** The Edit Comments page carries the checklist ID in the query string (`?subID=S…`); the checklist view page carries it in the path (`/checklist/S…`). The popup recognizes both and behaves accordingly: running the lookup on the edit page, and offering the "Open Edit Comments" link plus "Show weather anyway" on the view page.

**No backend.** There is no SnowRaven server in the loop. The extension talks directly to eBird, OpenWeather, and NOAA from your browser. The only large bundled asset is a trimmed NOAA tide-station list (used to find the nearest station offline, with no extra round-trip).

**Accessibility.** SnowRaven Mini targets WCAG 2.1 AA. The popup and Options page are fully keyboard-operable; copy buttons have ARIA labels; a polite live region announces results and the "Copied to clipboard" confirmation; there is a visible green focus ring; contrast meets AA in both light and dark; the theme follows your operating system (an OS-driven dark theme via `prefers-color-scheme`); and reduced-motion preferences are respected (the spinner freezes and transitions are disabled).

---

## Development

SnowRaven Mini is **React + Vite + TypeScript** with no component library: hand-authored CSS on a shared set of design-system tokens, with inline SVG icons. Tests run on Vitest, including golden parity tests that pin the weather and tide output to the exact byte strings (any drift fails the build). One codebase and one manifest serve both Chrome and Firefox.

To build and run locally:

```bash
npm install        # first time only
npm run build      # type-check + build into dist/
npm run dev        # watch + rebuild into dist/ while you work
```

Load the resulting `dist/` folder unpacked (see [Installing](#installing)). After a rebuild, reload the extension from `chrome://extensions` (Chrome) or `about:debugging` (Firefox) to pick up changes.

Source lives on `main` at [github.com/dtgibson/snowraven-mini](https://github.com/dtgibson/snowraven-mini); the latest release attaches the Chrome and Firefox zips. SnowRaven Mini is on both the [Chrome Web Store](https://chromewebstore.google.com/detail/snowraven-mini/dfbphfbhbehdlfepoigechmjbifpndhc) and [Firefox Add-ons](https://addons.mozilla.org/firefox/addon/snowraven-mini/).
