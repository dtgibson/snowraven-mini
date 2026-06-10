# Security Review — Weather and Tide on the eBird Checklist Page
**Date:** 2026-06-09
**Feature:** checklist-weather
**Stack:** none (no backend; frontend react-vite)
**Checklist:** reference/checklists/security-react-vite.md
**Outcome:** PASSED

## Summary

SnowRaven Mini is a popup-only MV3 browser extension (Chrome + Firefox) that puts SnowRaven's weather/tide comment blocks on the eBird checklist edit page. It has no backend, no server, and ships no developer-owned secret. The user supplies their own eBird and OpenWeather API keys, stored in `chrome.storage.local` (device-local), each transmitted only to its own API host. NOAA tide is keyless.

I worked through every item in the React + Vite security checklist against the actual code plus the extension-specific checks in the task. The review found **no Critical, High, Medium, or Low findings**. `npm audit` reports 0 vulnerabilities. The three trust boundaries that matter for this threat model all hold:

- **Key isolation:** the eBird key is sent only as the `X-eBirdApiToken` header to `api.ebird.org` (4 call sites in `weatherService.ts`/`regionInfo.ts`), and the OpenWeather key only as the `appid` query param to `api.openweathermap.org` (`weatherService.ts:101`). No key is ever attached to any other host. NOAA receives no key. There are no fetch/XHR targets other than the three documented API hosts.
- **No DOM injection from API content:** there is no `dangerouslySetInnerHTML`, `innerHTML`, `eval(`, or `new Function` anywhere in `src/`. All API-derived data (`locName`, the formatted weather/tide blocks, error messages, the literal HTML `<a>` attribution) is rendered as React JSX text children — inside `<pre className="sr-mono">{text}</pre>` (`WeatherTidePanel.tsx:17`) and `{loc}` / `{weather.message}` — so React auto-escapes it. A hostile eBird field cannot inject DOM; the `<a>` attribution appears as literal angle-bracket text, as designed.
- **No open-redirect / scheme injection in the edit link:** the "Open Edit Comments" href (`Popup.tsx:274`) is `https://ebird.org/edit/effort?subID=${checklistIdRef.current}` with a hardcoded scheme+host; the interpolated ID is only ever a value that passed `isValidChecklistId` (`/^S\d+$/`, `checklistId.ts:10`), which cannot contain `:`, `/`, `?`, `&`, `#`, whitespace, or `javascript:`.

The "all API calls go through a backend" checklist item is correctly **N/A** for this deliberately-documented threat model: there is no shared secret to expose; the only key on the wire is the user's own, sent to its own service. Manifest permissions, the production build (no source maps, no app console logs, no dev code paths), telemetry (none), and dependency hygiene all pass.

**Adversarial pass:** An independent skeptic re-reviewed all six requested attack surfaces against the no-backend / BYO-key threat model and **found no new findings** — no genuine Critical or High issue that the original audit missed. The skeptic specifically attempted to break key isolation via the one attacker-influenceable value reaching a key-bearing URL (the raw `locId` from eBird JSON interpolated into the three eBird path URLs) and confirmed the WHATWG URL parser cannot escape the `api.ebird.org` host via path traversal, `@`, CRLF, or fragment injection; because the eBird key lives in a request header (not the URL), it is neither log-leakable nor cross-wireable to NOAA/OpenWeather/a third party. Crafted lat/lng likewise cannot move the OWM host. The shipped `dist` contains only the three API hosts plus inert link/attribution URLs; the `innerHTML`/`dangerouslySetInnerHTML`/`javascript:` matches in `dist` are the bundled React runtime (including React's own `javascript:`-URL sanitizer), not app code. The `ebird.org` host check correctly rejects `evilebird.org` and `ebird.org.evil.com`. `@photostructure/tz-lookup@11.5.0` is the legitimate package with no runtime deps and no install scripts; the only postinstall scripts (esbuild, sharp) are build-time devDeps that do not ship. Keys in `chrome.storage.local` are unreachable by web pages or other extensions (no `storage.sync`, no message passing, no web-accessible resources); the clipboard only ever receives the user's own weather/tide text. The skeptic concurs with all three INFO items below and had nothing of higher severity to add. I re-verified the load-bearing claims (DOM sinks, key-to-host binding, manifest permissions, edit-link host, telemetry absence, `npm audit`) directly against the code and confirm them.

## Findings

No Critical, High, Medium, or Low findings.

### Informational

**INFO-1 — `sharp` and its native binaries appear as extraneous prod-tree entries**
- **Severity:** Informational
- **Location:** `node_modules` (`npm ls --prod` shows `sharp@0.34.5 extraneous` + `@img/sharp-*`); used by `scripts/make-icons.mjs`
- **Description:** `sharp` is a build-time icon rasterizer (as-built note 7) and is not declared in `package.json` (neither deps nor devDeps); it shows as `extraneous` in the installed tree. It is never imported by any `src/` module and is excluded from the shipped bundle (the dist contains only React + ported modules + tz-lookup + the inlined station data). No security impact — it does not ship — but the undeclared/extraneous state is untidy and could drift. The adversarial pass confirmed its only effect is a build-time postinstall script that does not reach the shipped artifact.
- **Remediation:** Add `sharp` to `devDependencies` (or remove the unused install) so the dependency graph is explicit and reproducible. Optional.
- **Status:** Open (cosmetic)

**INFO-2 — `chrome.storage.local` stores BYO keys unencrypted**
- **Severity:** Informational
- **Location:** `src/lib/ext/storage.ts` (`chrome.storage.local.set/get`)
- **Description:** The two user-supplied keys are stored unencrypted in `chrome.storage.local`. This is an explicitly accepted design decision (PRD Open Question "Exact at-rest key storage": the extension cannot replicate the desktop OS keychain, and `chrome.storage.local` is acceptable for two bring-your-own keys under the no-backend model). The Options fields are masked (`type="password"`, `Options.tsx:34`). Keys never leave the device except as their own service's auth. The adversarial pass confirmed the storage is unreachable by web pages or other extensions (no `storage.sync`, no message passing, no web-accessible resources). No action needed; recorded for completeness.
- **Remediation:** None required; documented and accepted.
- **Status:** Accepted by design

**INFO-3 — Minor doc drift in build helper comments (no security impact)**
- **Severity:** Informational
- **Location:** `scripts/make-icons.mjs` (comment says `public/icon.svg`, code reads `brand/icon.svg`)
- **Description:** A build-script comment names a different source path than the code uses. Build-only, never shipped. Noted only so it isn't mistaken for a finding.
- **Remediation:** Align the comment with the code. Optional.
- **Status:** Open (cosmetic)

## Checks Performed

| # | Check (checklist item / extension-specific) | Result |
|---|---|---|
| **API Keys & Secrets** | | |
| 1 | No API keys/tokens/secrets in any source file | **Pass** — grep for literal secret assignments returns none; the only "key"/"token" references are handling code (`getApiKey`, `X-eBirdApiToken`) and UI labels |
| 2 | Only `VITE_` vars used client-side | **Pass (N/A)** — no `VITE_` vars and no `.env`; keys are runtime BYO values in `chrome.storage.local`, not build-time env |
| 3 | `VITE_` vars contain only non-sensitive values | **Pass (N/A)** — no `VITE_` vars exist |
| 4 | `.env` / `.env.local` in `.gitignore` | **Pass (N/A)** — no `.env` files exist; `.gitignore` covers `*.local`, `dist/`, `node_modules/` |
| 5 | No credentials in `vite.config.ts` or committed config | **Pass** — `vite.config.ts`, `manifest.json`, `package.json`, tsconfigs contain no secrets |
| **CORS & API Communication** | | |
| 6 | API calls go through backend / no direct key-exposing third-party calls | **Pass (N/A by design)** — no backend exists; documented threat model. Only the user's own key reaches its own host. eBird key → `X-eBirdApiToken` to `api.ebird.org` only; OWM key → `appid` to `api.openweathermap.org` only; NOAA keyless |
| 7 | API base URLs are env vars, not hardcoded | **Pass (acceptable deviation)** — `EBIRD_BASE`/`OWM_BASE`/`NOAA` are hardcoded constants. Correct for an extension: the hosts are fixed and pinned in `optional_host_permissions`; env-var bases would weaken, not strengthen, the host allow-list |
| 8 | API error responses handled gracefully; no raw details to users | **Pass** — `errorMap.ts` maps statuses to fixed friendly strings; `extFetch` wraps timeouts; services throw typed messages; UI shows curated copy (`WeatherTidePanel.tsx` role=alert/status) |
| 9 | Auth headers appropriate; no Bearer tokens in localStorage | **Pass** — auth is the user's own API key as header/query param to its own service; no Bearer/JWT, no localStorage; keys in `chrome.storage.local` |
| **Authentication State** | | |
| 10 | Tokens in httpOnly cookies / in-memory, not localStorage | **Pass (N/A)** — no app auth/session; the extension has no login |
| 11 | Logout clears all auth state | **Pass (N/A)** — no auth session to clear (Options "delete key" removes a key from storage) |
| 12 | Protected routes redirect unauthenticated users | **Pass (N/A)** — no routing/server; popup is a single surface |
| 13 | Token refresh handles expiry gracefully | **Pass (N/A)** — no tokens to refresh; an invalid key (401/403) surfaces "key invalid. Check it in Settings." (`errorMap.ts:25,29`) |
| **Input Handling** | | |
| 14 | UGC rendered as HTML uses sanitization; no `dangerouslySetInnerHTML` with unsanitized input | **Pass** — zero `dangerouslySetInnerHTML`/`innerHTML`; all API data rendered as escaped JSX text in `<pre>`/`<div>`. The HTML `<a>` attribution is inert literal text |
| 15 | URLs from user/external data validated before `href`/`src`; no `javascript:` URLs | **Pass** — the only dynamic href (`Popup.tsx:274`) interpolates an `/^S\d+$/`-validated ID into a hardcoded `https://ebird.org/...` URL; external links use `target="_blank" rel="noreferrer"`. Adversarial pass confirmed no `javascript:`/open-redirect path |
| 16 | Form inputs affecting navigation/state validated before submission | **Pass** — Options trims key values before storing (`Options.tsx:77-81`); checklist ID validated before any fetch (`activeTab.ts:47,53`) |
| **Dependencies** | | |
| 17 | No known vulnerable packages in `package.json` | **Pass** — `npm audit`: 0 vulnerabilities (info/low/moderate/high/critical all 0) |
| 18 | `react`, `vite`, direct deps on current supported versions | **Pass** — React 19.2.7, react-dom 19.2.7, Vite 6.4.3, vitest 3.2.6, @photostructure/tz-lookup 11.5.0 — all current; adversarial pass confirmed tz-lookup has no runtime deps and no install scripts |
| 19 | No unused dependencies present | **Pass** — runtime deps (React, react-dom, tz-lookup) all used; desktop-heavy deps excluded via `rollupOptions.external`. See INFO-1 re: extraneous build-tool `sharp` |
| **Build Output** | | |
| 20 | Source maps not deployed to production | **Pass** — no `.map` files and no `sourceMappingURL` in `dist/` |
| 21 | Console logs with sensitive data removed before prod build | **Pass** — no app-authored `console.*` in `src/`; the 6 `console.error` in the dist `Icons` chunk are React/scheduler internals (minified prod runtime), not app code or sensitive data |
| 22 | Prod build excludes dev-only code/debug tooling | **Pass** — dist is the minified production React build (uses `react.dev/errors/` code lookup, the prod-only error path); HTML loads only local `./assets/*`, no inline scripts, no CDN, no HMR |
| **Extension-specific checks** | | |
| E1 | `npm audit` (note devDep dominance; shipped bundle excludes devDeps) | **Pass** — 0 vulnerabilities. Tree: prod 5 / dev 213 / optional 52; build-only `sharp` + `@img/sharp-*` natives dominate the optional/extraneous tree and are excluded from the shipped bundle |
| E2 | grep src: hardcoded keys/secrets | **Pass** — none |
| E3 | grep src: `dangerouslySetInnerHTML` / `innerHTML` / `eval(` / `new Function` | **Pass** — none in `src/`; none in `dist/` either (re-verified; `dist` matches are bundled React runtime, including React's own `javascript:`-URL sanitizer) |
| E4 | grep src: any fetch/XHR host other than the 3 API hosts | **Pass** — every `extFetch`/`fetch` targets `api.ebird.org`, `api.openweathermap.org`, or `api.tidesandcurrents.noaa.gov`. Other URLs (github.com attribution, ebird.org/openweathermap.org link hrefs, w3.org SVG ns) are never fetch targets |
| E5 | grep src: telemetry / analytics | **Pass** — none (no sentry/posthog/ga/sendBeacon/mixpanel/etc. in code; re-verified) |
| E6 | eBird key only to api.ebird.org; OWM key only to api.openweathermap.org | **Pass** — `X-eBirdApiToken` header bound to `EBIRD_BASE` in all 4 eBird calls (`weatherService.ts:34,61,77`; `regionInfo.ts:22`); `appid` bound to `OWM_BASE` (`weatherService.ts:101`); NOAA keyless (`tideService.ts`). Adversarial pass confirmed a hostile `locId` cannot escape the eBird host via the WHATWG URL parser, and the header-borne key is not cross-wireable or log-leakable |
| E7 | Popup never renders API responses via innerHTML/dangerouslySetInnerHTML (only `<pre>` text) | **Pass** — `MonoBlock` renders `<pre>{text}</pre>`; all other API data is escaped JSX text; hostile `locName`/fields cannot inject DOM |
| E8 | "Open Edit Comments" href built only from `/^S\d+$/`-validated ID (no `javascript:`/open-redirect) | **Pass** — `Popup.tsx:274`; ID sourced only from `isValidChecklistId`-gated `tab.checklistId`; hardcoded https+ebird.org |
| E9 | Manifest permissions exactly `["activeTab","clipboardWrite","storage"]`; host access only under `optional_host_permissions`; no content_scripts/background | **Pass** — `manifest.json:6` matches exactly; the 3 hosts only under `optional_host_permissions` (`:7-11`); no `background`/`service_worker`/`content_scripts`/`web_accessible_resources`/`externally_connectable` keys; built `dist/manifest.json` is identical. Adversarial pass confirmed the `ebird.org` host check rejects `evilebird.org` and `ebird.org.evil.com` |
| E10 | Production build: source maps / sensitive console.logs / dev-only code | **Pass** — none (covered by checks 20-22) |