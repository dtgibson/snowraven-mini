# Privacy Policy: SnowRaven Mini

**Effective date:** June 9, 2026

## Overview

SnowRaven Mini is a browser extension for Chrome and Firefox, the lightweight, in-browser companion to the SnowRaven desktop app. It runs entirely inside your browser, with no backend and no server of its own. This policy describes what happens to your data. The short version: it stays with you.

## Your Data Stays on Your Device

SnowRaven Mini keeps your data on your own device by choice and design. You keep it, and you control it.

- The two API keys you enter (your eBird key and your OpenWeather key) are stored only on your device, in your browser's local extension storage (`chrome.storage.local`). They are never uploaded to the developer or to any service the developer runs.
- All of the extension's work happens locally, in your browser, while you use it: reading the active checklist tab, formatting the weather and tide blocks, and copying to your clipboard.
- There is no SnowRaven Mini account, no login, and no developer-operated server sitting between you and your data.
- You can delete your stored keys at any time from the extension's Options page, or by removing the extension entirely.

## No Data Collection

SnowRaven Mini collects nothing about you.

- No analytics, usage tracking, or telemetry of any kind.
- No crash-reporting services.
- No advertising networks.
- No accounts, profiles, or identifiers.

## Connections to Bird and Weather Services

SnowRaven Mini's job is to fetch weather and tide information for your checklist, so the extension does make requests to a few outside services, using your own API keys, and only to get the data you ask for. These requests go directly from your browser to the provider, and each key is sent only to its own provider's host. There is no SnowRaven Mini server in the middle, and nothing is logged or retained by the developer.

- **eBird**, to look up the checklist's location and time so weather and tide can be fetched for the right spot. Uses your own eBird API key, sent only to eBird. See [eBird's terms](https://www.birds.cornell.edu/home/ebird-api-terms-of-use/).
- **OpenWeather**, to fetch the historical weather for the checklist's hour. Uses your own OpenWeather API key, sent only to OpenWeather. See [OpenWeather's privacy policy](https://openweathermap.org/privacy-policy).
- **NOAA Tides & Currents (CO-OPS)**, to fetch the historical tide for the checklist's location and time. No key or account; a U.S. government service. See [NOAA's privacy policy](https://www.noaa.gov/protecting-your-privacy).

What you send to these services (a checklist ID, a location, a time) is governed by each provider's own privacy policy. SnowRaven Mini only relays the request you initiated; it does not add tracking and does not keep a copy.

## Permissions

SnowRaven Mini asks for the narrowest set of browser permissions it needs to do its one job:

- **`activeTab`**, to read the URL of the eBird checklist tab you're on, so it can find the checklist ID.
- **`clipboardWrite`**, to copy the weather block (and, on request, the tide block) to your clipboard for pasting into eBird.
- **`storage`**, to save your two API keys locally in this browser.
- **Host access** (`api.ebird.org`, `api.openweathermap.org`, `api.tidesandcurrents.noaa.gov`), requested on demand, only when you first run a lookup, so the extension can reach the three services above. Nothing else is contacted.

## Children

SnowRaven Mini does not collect data from anyone, including children under 13.

## Changes to This Policy

If this policy ever changes, the updated version will be posted here with a revised effective date.

## Contact

Questions about privacy? Reach out at [developer@dtgibson.com](mailto:developer@dtgibson.com).
