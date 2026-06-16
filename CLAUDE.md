# CLAUDE.md — SnowRaven Mini

Conventions for building this project. Keep this lean.

## Core conventions
- **Parity with SnowRaven is a hard requirement.** Weather, tide, and formatting must be byte-for-byte identical to the SnowRaven desktop app (`github.com/dtgibson/snowraven`, also at `/home/parallels/snowraven`). Port its pure TypeScript modules as-is rather than re-implementing, and lock parity with golden tests that assert the exact output strings via `.toBe`. A golden test's `expected` value must be built **independently of the function under test** — a hand-typed literal, or composed from a different, separately-golden-tested primitive — never from the function's own expression, so a same-direction edit to both can't pass silently. Night weather blocks append a moon-phase emoji to the condition emoji as a single **unspaced** emoji run (`☁️🌗`) — keep it unspaced; that one-run format is the parity contract.
- **No backend, ever.** Everything runs in the browser. The user supplies their own API keys, stored in `chrome.storage.local`, each sent only to its own API host. No shared or embedded keys, no telemetry, no servers.
- **Minimal permissions.** Popup-only MV3; keep `permissions` as small as possible (currently `activeTab`, `clipboardWrite`, `storage`). Host access is `optional_host_permissions`, requested on demand from a user gesture. No content script or background worker unless genuinely required.
- **`chrome.permissions.request` fires only from a user click** — never on popup auto-load (it throws and hangs the popup). Check `permissions.contains()` on open; request from a button.
- **Smallest possible bundle.** No component library; hand-authored CSS on the design-system tokens (`pipeline/design-system.md`) and inline SVG icons. Keep heavy deps out of the bundle (enforced via Rollup `external`).
- **One codebase for Chrome + Firefox.** A single manifest with the `browser_specific_settings.gecko` block, one build, two zips.
- **Accessibility: WCAG 2.1 AA on the popup + Options.** Keep semantic landmarks (`<main>`/`<header>`/`<h1>`), labelled Weather/Tide regions, AA contrast in both themes, and announce async state changes through the shared polite live region. The weather/tide `<pre>` stays keyboard-reachable via `tabindex`, never rewrapped — clipboard parity rides on the copied string, but `tabindex` also keeps the on-screen block identical to the desktop.

## Page detection
The Edit Comments page (the paste target) carries the checklist ID in the **query string** (`/edit/effort?subID=S…`); the checklist **view** page carries it in the **path** (`/checklist/S…`). Read both.

## Verify before shipping
`npm test` (Vitest, includes the golden parity tests) and `npm run build` (tsc + vite) must be green.

## Releases & store
- **Versioning:** store releases use clean numbers (v1.0.0 was the public debut); routine updates increment by 0.1. One shared version and one build serve both stores.
- **Changelog:** every release adds a dated `## [version]` entry at the top of `CHANGELOG.md` (Keep a Changelog format — `### Added`/`### Changed`/`### Fixed`, newest first), landed in the same commit as the version bump so the file never lags the manifest. Match the entry voice to the SnowRaven repo's changelog: a short bold lead sentence then plain prose for notable user-facing changes, plainer bullets for minor ones; informative, not salesy; em dashes are fine here (unlike store/README copy). Omit pure housekeeping (context-update files, asset regen) unless genuinely notable.
- **Store package** lives in `store/` (listing copy, disclosures, submit checklists, assets). Regenerate the image assets with `npm run store:assets` (headless Chromium renders the real component CSS, sharp flattens to no-alpha PNGs). `BUILD.md` documents the AMO reproducible build.
- Keep `gecko.data_collection_permissions` in the manifest — Firefox AMO requires the data-collection declaration for new submissions.
- **Contact email is `developer@dtgibson.com`** anywhere a project address is needed. Never use a personal address.
- **Marketing site** lives in `website/` and deploys to GitHub Pages via `.github/workflows/pages.yml` on push to `main`; custom domain `snowravenmini.dtgibson.com` (a `CNAME` file plus a DNS CNAME to `dtgibson.github.io`). It mirrors `snowraven.dtgibson.com`, uses system fonts, renders the popup as live HTML rather than screenshots, and has no build step. Its icons are hand-authored inline SVGs (Lucide glyphs plus the Chrome/Firefox logos from Simple Icons) — render the page and eyeball them before shipping, since a trimmed path renders as a broken glyph. Leave `docs/` untouched.
