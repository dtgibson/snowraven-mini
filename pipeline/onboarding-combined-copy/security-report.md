# Security Review — Onboarding & Combined Copy

**Date:** 2026-06-15
**Feature:** onboarding-combined-copy
**Stack:** react-vite (popup-only MV3 browser extension, backend: null — no server)
**Checklist:** reference/checklists/security-react-vite.md (React + Vite frontend) plus browser-extension (MV3) least-privilege / key-handling checks
**Outcome:** PASSED

---

## Summary

Reviewed the full working-tree diff for both additions — the first-run key
walkthrough and the combined "Copy weather & tide together" button — against
the React+Vite checklist and the MV3 least-privilege and BYO-key handling
posture. The change is purely additive UI: no new permissions, no manifest
change, no network calls, no DOM-injection sinks, no secrets, and no new
at-rest state. The walkthrough reads only *which* keys are missing, never a
key value, and routes the user to the existing Settings/Options page; the
combined block reaches the DOM only as React-escaped text in a `<pre>` and
the clipboard only as plain text. Clean pass with no findings.

---

## Findings

No security issues found in this feature.

---

## What Was Reviewed (and why each concern is clear)

**Secrets / BYO-keys (Pass).** The diff adds no API key, token, or secret
literal. The only key-shaped strings introduced are UI labels (`'eBird API
key'`, `'OpenWeather API key'`) and the static provider key-page URLs in
`KEY_META` (`Popup.tsx:56-59`). No `VITE_`-bundled secret, no embedded shared
key — consistent with the founding "BYO-keys, no embedded keys" posture
(CLAUDE.md). The two real keys remain solely in `chrome.storage.local` via the
untouched `src/lib/ext/storage.ts` adapter.

**Permissions / least privilege (Pass).** `git diff` over the manifest is
empty — `permissions` (`activeTab`, `clipboardWrite`, `storage`) and
`optional_host_permissions` are unchanged (NFR-04 / QA-25). The diff adds no
`chrome.permissions`, `chrome.storage`, or new `chrome.runtime` call; the only
chrome API the walkthrough touches is the pre-existing `openOptions()`
(`chrome.runtime.openOptionsPage`, `src/lib/ext/options.ts:5`). The get-key
links are plain `<a target="_blank">` anchors, which navigate without firing
`chrome.permissions.request` — honoring the popup-load rule in CLAUDE.md
("`chrome.permissions.request` fires only from a user click").

**Key handling / privacy (Pass).** The `Walkthrough` component receives only
`missingKeys: MissingKey[]` (`Popup.tsx:62`) — a list of *which* services are
unset, derived from the existing key gate. It never reads, stores, or
transmits a key value; it only renders state labels (Needed/Set), links out,
and routes to Settings via `openOptions()` (FR-07 / QA-07). Key entry stays
solely on the Options page. Keys still leave the device only as their own
service header/param (unchanged — no service code touched).

**DOM injection / XSS (Pass).** Grep across `src/` finds no
`dangerouslySetInnerHTML`, `innerHTML`/`outerHTML`/`insertAdjacentHTML`,
`document.write`, `eval`, or `new Function` — none pre-existing, none added.
The combined block built by `buildCombined()` contains the literal
`<a href="https://github.com/dtgibson/snowraven">SnowRaven</a>`
(`tideFormatter.ts:13-16`), and that string reaches the UI only via
`<pre>{text}</pre>` in `MonoBlock` (`WeatherTidePanel.tsx:21-26`), where React
escapes it as text — never as raw HTML — and reaches the clipboard only via
`copyText()` as a plain string. There is no new raw-HTML render path; the
attribution renders as a live link only after the user pastes it into eBird,
which is the intended parity behavior and outside the extension's trust
boundary.

**Outbound-link safety (Pass).** Both new walkthrough anchors carry
`rel="noreferrer"` (`Popup.tsx:103`), preventing reverse-tabnabbing and
referrer leakage on the `target="_blank"` open. Hrefs are static `https://`
literals (`https://ebird.org/api/keygen`, `https://openweathermap.org/api`),
not user-controlled, so there is no `javascript:`-URL or open-redirect surface.
This matches the existing `Options.tsx:28` and `Footer.tsx:10,14` pattern.

**Clipboard (Pass).** Both copy paths (`buildCombined(...)` for the combined
button, `weather.formatted`/`tide.formatted` for the per-block buttons) write
plain text only. No key, token, or sensitive value is ever placed on the
clipboard — the combined string is weather + tide + the public SnowRaven
attribution. `copyText()` is unchanged and never throws (returns
true/false); the button honestly shows no success on a false return (FR-19).

**Network / exfiltration / telemetry (Pass).** No `fetch`, `XMLHttpRequest`,
`sendBeacon`, or `WebSocket` in the changed files; no new endpoint, no
analytics or telemetry added. The feature performs zero network I/O of its
own — consistent with the "no telemetry, no servers" posture.

**Input handling (Pass).** No user-supplied input is rendered as HTML or used
to build an `href`/`src`. All rendered strings are static UI copy or
service-produced output shown as escaped text. The walkthrough has no form
inputs (key entry stays on Options).

**Build output / dev paths (Pass).** No new dependency (NFR-05), no
debug-only code path, no console logging of sensitive data introduced. The CSS
change is additive and resolves to existing `--sr-*` tokens.

---

## Checks Performed

| Check | Result |
|---|---|
| No API keys/tokens/secrets in source — none added by diff | Pass |
| Only non-sensitive values would be client-bundled (no `VITE_` secret added) | Pass |
| No credentials in vite.config / committed config (config untouched) | Pass |
| `.env`/`.env.local` gitignored (no new env usage introduced) | Pass |
| No direct third-party API call exposing a key added (no network in diff) | Pass |
| API base URLs not hardcoded as secrets (only static public key-page URLs) | Pass |
| Error responses not leaking raw detail to users (no new error surface) | Pass |
| Auth tokens not in localStorage/sessionStorage (keys stay in `chrome.storage.local`) | Pass |
| Walkthrough never reads/stores/transmits a key value (gets only `MissingKey[]`) | Pass |
| `dangerouslySetInnerHTML` not used (none in `src/`) | Pass |
| `innerHTML`/`outerHTML`/`insertAdjacentHTML`/`document.write` not used | Pass |
| `eval` / `new Function` not used | Pass |
| Combined block (literal `<a>…SnowRaven</a>`) rendered only as escaped `<pre>` text | Pass |
| Combined block reaches clipboard only as plain text | Pass |
| User input not used in `href`/`src`; no `javascript:` URLs | Pass |
| `target="_blank"` walkthrough anchors carry `rel="noreferrer"` (no reverse-tabnabbing) | Pass |
| Get-key hrefs are static `https://` literals, not user-controlled | Pass |
| Clipboard write carries no key/token/sensitive data | Pass |
| No new `fetch`/XHR/WebSocket/sendBeacon endpoint added | Pass |
| No analytics/telemetry added | Pass |
| Manifest `permissions` unchanged (diff empty) | Pass |
| Manifest `optional_host_permissions` unchanged (diff empty) | Pass |
| No new `chrome.permissions.request` / no popup-load permission prompt | Pass |
| No new `chrome.storage` write / no new at-rest state | Pass |
| No new runtime dependency added | Pass |
| No new dev-only/debug code path or sensitive console logging | Pass |
| Source maps / build config unchanged (no production source-map exposure introduced) | Pass |

---

## Convention Flags

(none — the existing `rel="noreferrer"` on `target="_blank"` anchors, plain-text
clipboard, and BYO-key-never-leaves-Options handling are already established
conventions in CLAUDE.md and were correctly followed; nothing new to codify.)
