# SnowRaven Mini

Weather and tide for your eBird checklist, one click, right in your browser.

SnowRaven Mini is a lightweight Chrome and Firefox extension, the in-browser companion to the [SnowRaven](https://github.com/dtgibson/snowraven) desktop app. On an eBird checklist's **Edit Comments** page, one click looks up that checklist's historical weather and tide, formats them the same way SnowRaven does, and copies the weather to your clipboard, ready to paste into your comment.

## What it does

- **Weather** is copied to your clipboard the moment you open the popup on a checklist Edit Comments page, with a "Copied to clipboard" confirmation. Paste it straight into your comment.
- **Tide** from the nearest NOAA station shows right below it, with its own Copy button (US coastal checklists).
- On a checklist view page, you get a link to the Edit Comments page plus a "Show weather anyway" option.

That is the whole extension. For a full walkthrough, see [docs/HELP.md](docs/HELP.md).

## Privacy

It runs entirely in your browser and collects nothing: no backend, no servers, no accounts, no analytics. Your two API keys stay on your device, and each is sent only to its own service. See the [Privacy Policy](PRIVACY_POLICY.md).

## Requirements

Two free API keys, entered once on the Options page:

- **eBird API key**, free from [ebird.org/api/keygen](https://ebird.org/api/keygen).
- **OpenWeather API key**, free from [openweathermap.org/api](https://openweathermap.org/api) (subscribe to the "One Call by Call" plan).

NOAA tide data needs no key.

## Install

SnowRaven Mini is on the **Chrome Web Store**: [install it here](https://chromewebstore.google.com/detail/snowraven-mini/dfbphfbhbehdlfepoigechmjbifpndhc). On **Microsoft Edge** and other Chromium browsers, install from the same listing after turning on "Allow extensions from other stores." It's also on the **Firefox Add-ons** store: [install it here](https://addons.mozilla.org/firefox/addon/snowraven-mini/) (Firefox 128 or newer). Prefer not to use a store? Download a zip from the [latest release](https://github.com/dtgibson/snowraven-mini/releases) and load it unpacked (`about:debugging`). Then add your keys in Options. Full step-by-step instructions — including Edge and building from source — are in [docs/HELP.md](docs/HELP.md).

## More

- [docs/HELP.md](docs/HELP.md): how to use it, screen by screen.
- [PRIVACY_POLICY.md](PRIVACY_POLICY.md): what is and is not sent off your device.
- [ACCESSIBILITY.md](ACCESSIBILITY.md): the WCAG 2.1 AA accessibility statement.
- [SnowRaven](https://github.com/dtgibson/snowraven): the full desktop app this is a companion to.

## License

GNU Affero General Public License v3.0 (AGPL-3.0). See [LICENSE](LICENSE).
