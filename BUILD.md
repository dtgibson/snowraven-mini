# Build Instructions: SnowRaven Mini

This add-on is built with TypeScript and Vite (Rollup), which bundles and minifies the source. Per Mozilla's source-code submission policy, this archive contains the full source and the steps a reviewer needs to reproduce the exact files in the submitted package.

## What the submitted package contains
The uploaded add-on zip is the contents of `dist/`, produced by `npm run build`. `dist/manifest.json` is copied verbatim from the repo-root `manifest.json` by a small Vite plugin (see `vite.config.ts` -> `emitExtensionFiles`). No other transformation is applied to the manifest.

## Build environment used
- OS: Ubuntu Linux (the build is platform independent; it also reproduces on macOS)
- Node.js: v24.16.0
- npm: 11.16.0

These match Mozilla's reviewer default environment (Ubuntu 24.04, Node 24.x / npm 11.x). Any Node 24.x with npm 11.x reproduces the build.

## Tools
- Node.js 24.x and npm 11.x, installed from <https://nodejs.org> or via nvm (`nvm install 24`). Both are open source and run locally.
- No other tools and no web-based build services. Every dependency is pinned in `package-lock.json` and fetched from the public npm registry by `npm ci`.

## Steps to reproduce
From the root of this source archive:

1. `npm ci`          installs the exact dependency versions from `package-lock.json`
2. `npm run build`   runs `tsc -b && vite build`, writing the extension to `dist/`

The contents of `dist/` then match the uploaded package exactly. The reviewer can diff `dist/` against the submitted zip to confirm there are no differences.

## Notes for the reviewer
- The extension is popup only: no content scripts, no background or service worker, and no remotely hosted code. All logic ships inside the package.
- It fetches JSON data (not executable code) from `api.ebird.org`, `api.openweathermap.org`, and `api.tidesandcurrents.noaa.gov`, and only after the user grants the optional host permissions from a click. The eBird and OpenWeather keys are supplied by the user, stored in `chrome.storage.local`, and each is sent only to its own host. NOAA is keyless.
- To exercise the popup you need a free eBird API key (<https://ebird.org/api/keygen>) and a free OpenWeather "One Call by Call" key (<https://openweathermap.org/api>). Tide output (NOAA) needs no key, so it can be demonstrated on a US coastal checklist without any key.
- `manifest.json` carries the `browser_specific_settings.gecko` block (id, `strict_min_version`, and `data_collection_permissions` set to `{"required":["none"]}` because the add-on collects no data). Chrome ignores this block; Firefox reads it.
- Source layout: application code in `src/`, the popup and options HTML at the repo root, the static manifest at the repo root, the raven icon source in `brand/icon.svg`, and the rasterized toolbar icons in `public/icons/`.
- License: AGPL-3.0-or-later (see `LICENSE`).
