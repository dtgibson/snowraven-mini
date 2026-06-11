# CLAUDE.md — SnowRaven Mini

Conventions for building this project. Keep this lean.

## Core conventions
- **Parity with SnowRaven is a hard requirement.** Weather, tide, and formatting must be byte-for-byte identical to the SnowRaven desktop app (`github.com/dtgibson/snowraven`, also at `/home/parallels/snowraven`). Port its pure TypeScript modules as-is rather than re-implementing, and lock parity with golden tests that assert the exact output strings via `.toBe`. Night weather blocks append a moon-phase emoji to the condition emoji as a single **unspaced** emoji run (`☁️🌗`) — keep it unspaced; that one-run format is the parity contract.
- **No backend, ever.** Everything runs in the browser. The user supplies their own API keys, stored in `chrome.storage.local`, each sent only to its own API host. No shared or embedded keys, no telemetry, no servers.
- **Minimal permissions.** Popup-only MV3; keep `permissions` as small as possible (currently `activeTab`, `clipboardWrite`, `storage`). Host access is `optional_host_permissions`, requested on demand from a user gesture. No content script or background worker unless genuinely required.
- **`chrome.permissions.request` fires only from a user click** — never on popup auto-load (it throws and hangs the popup). Check `permissions.contains()` on open; request from a button.
- **Smallest possible bundle.** No component library; hand-authored CSS on the design-system tokens (`pipeline/design-system.md`) and inline SVG icons. Keep heavy deps out of the bundle (enforced via Rollup `external`).
- **One codebase for Chrome + Firefox.** A single manifest with the `browser_specific_settings.gecko` block, one build, two zips.

## Page detection
The Edit Comments page (the paste target) carries the checklist ID in the **query string** (`/edit/effort?subID=S…`); the checklist **view** page carries it in the **path** (`/checklist/S…`). Read both.

## Verify before shipping
`npm test` (Vitest, includes the golden parity tests) and `npm run build` (tsc + vite) must be green.

## Releases & store
- **Versioning:** store releases use clean numbers (v1.0.0 was the public debut); routine updates increment by 0.1. One shared version and one build serve both stores.
- **Store package** lives in `store/` (listing copy, disclosures, submit checklists, assets). Regenerate the image assets with `npm run store:assets` (headless Chromium renders the real component CSS, sharp flattens to no-alpha PNGs). `BUILD.md` documents the AMO reproducible build.
- Keep `gecko.data_collection_permissions` in the manifest — Firefox AMO requires the data-collection declaration for new submissions.
- **Contact email is `developer@dtgibson.com`** anywhere a project address is needed. Never use a personal address.
- **Marketing site** lives in `website/` and deploys to GitHub Pages via `.github/workflows/pages.yml` on push to `main`; custom domain `snowravenmini.dtgibson.com` (a `CNAME` file plus a DNS CNAME to `dtgibson.github.io`). It mirrors `snowraven.dtgibson.com`, uses system fonts, renders the popup as live HTML rather than screenshots, and has no build step. Leave `docs/` untouched.
