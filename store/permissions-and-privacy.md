# Permissions and Privacy: SnowRaven Mini

Paste-ready answers for the stores' privacy and permission forms. All of it reflects the extension's real behavior: bring-your-own keys stored locally, each sent only to its own API host, no backend, no telemetry, no servers.

## Single purpose (Chrome single-purpose field)
> SnowRaven Mini generates a weather and tide summary for the eBird checklist you are editing and copies it to your clipboard to paste into the checklist comment.

## Permission justifications (Chrome lists one box per manifest permission)

**activeTab**
> Read the URL of the current tab when you click the toolbar icon, so the extension can tell whether you are on an eBird checklist page and recover that checklist's ID (it appears in the page's query string on the Edit Comments page and in the path on the checklist view page). It reads only the active tab's URL, only when you open the popup. There is no content script and no background access to other tabs or page content.

**storage**
> Save your two API keys (eBird and OpenWeather) with `chrome.storage.local` so you enter them once instead of on every lookup. These are the only stored values, they stay on your device, and there is no server to sync them to. Clearing a field deletes the stored key.

**clipboardWrite**
> Write the formatted weather block to your clipboard automatically when a lookup succeeds, and back the per-block Copy buttons for the weather and tide cards. The extension only writes text it generated; it never reads the clipboard.

## Host permission justifications (declared as optional, requested on a click)

**https://api.ebird.org/**
> Resolve the checklist's location, coordinates, time, and duration, which the weather and tide lookups both need. Sends your eBird API key (in a request header) plus the checklist ID and the location ID eBird returns for it, all only to eBird.

**https://api.openweathermap.org/**
> Fetch the historical weather for the checklist's coordinates and hour (One Call timemachine endpoint). Sends the coordinates, timestamp, and your OpenWeather API key only to OpenWeather.

**https://api.tidesandcurrents.noaa.gov/**
> Fetch observed water levels, predictions, and high and low tides for the nearest US tide station (NOAA CO-OPS). Keyless. The nearest station is chosen on your device from a bundled list, so your exact coordinates are never sent. Each request sends that station's NOAA ID and the checklist's date and time window to NOAA.

> Note: these three are declared under `optional_host_permissions` and requested at runtime from your click on "Grant access", so there is no broad host-access warning at install and the extension makes no network calls until you allow it.

## Remote code (Chrome remote-code field)
> No, I am not using remote code. All logic ships inside the package. The extension fetches JSON data from the three APIs above; it does not load or run any remotely hosted code.

## Data usage (Chrome "Data usage" section)
- **Data collected:** none to disclose. The eBird and OpenWeather keys you enter stay on your device and are sent only to their own services; the developer has no server and receives no data. (If the live dashboard's definition of "collect" leads you to check "Authentication information," that is a defensible reading because keys are handled locally; the certifications below still hold. Confirm against the dashboard wording at submission.)
- **Certifications (check all three):**
  - I do not sell or transfer user data to third parties, outside of the approved use cases.
  - I do not use or transfer user data for purposes that are unrelated to my item's single purpose.
  - I do not use or transfer user data to determine creditworthiness or for lending purposes.

## Firefox data-collection declaration
Already in the manifest: `browser_specific_settings.gecko.data_collection_permissions = { "required": ["none"] }`. This is the "collects no data" declaration AMO now requires for new submissions. No web form to fill; AMO reads it from the manifest and shows it on the listing and the install prompt.

## Firefox reviewer notes (paste into "Notes to reviewer")
> SnowRaven Mini is popup only: no content scripts, no background or service worker, no remotely hosted code. It fetches JSON (not code) from api.ebird.org, api.openweathermap.org, and api.tidesandcurrents.noaa.gov, and only after the user grants the optional host permissions from a click.
>
> To test the weather: get a free eBird API key (ebird.org/api/keygen) and a free OpenWeather "One Call by Call" key (openweathermap.org/api), enter both on the Settings page, then open the popup on an eBird checklist's Edit Comments page (ebird.org/edit/effort?subID=...). Tide (NOAA) is keyless, so tide output can be seen on a US coastal checklist without any key.
>
> The build is bundled and minified by Vite/Rollup. Source plus reproduce-the-build steps are attached; see BUILD.md (npm ci, then npm run build, reproduces dist/). Keys are stored in chrome.storage.local and each is sent only to its own host; there is no backend, telemetry, or analytics. The manifest declares data_collection_permissions: { required: ["none"] }.

## Privacy policy URL (both stores)
<https://github.com/dtgibson/snowraven-mini/blob/main/PRIVACY_POLICY.md>
