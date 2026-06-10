# Security Review: Store Submission Prep

**Date:** 2026-06-10
**Feature:** store-submission-prep
**Stack:** none (no backend; frontend react-vite)
**Checklist:** reference/checklists/security-react-vite.md
**Outcome:** PASSED WITH NOTES

---

## Summary
An adversarial audit (four independent passes: secret-leak hunt, disclosure-accuracy check, attack-surface and dependency review, and store-policy compliance) found no Critical or High issues and nothing that blocks release. The feature changed no extension runtime code; it added the store listing package, a build-time asset script, embedded Inter fonts, and a manifest version bump plus the `data_collection_permissions` declaration. No secrets were found anywhere in the working tree, the full git history, the source archive, or the shipped bundles. `npm audit` reports zero vulnerabilities, and no new permission, host, dependency, or remote-code path was introduced. Reviewer-reproducibility was verified end to end: a clean `npm ci && npm run build` from the source archive produced output identical to the shipped Chrome zip. All actionable notes below were resolved during this stage.

---

## Findings

### 1. Privacy policy / listing contact email inconsistency
**Severity:** Low
**Location:** `store/firefox-submit-checklist.md` (had `dave@dtgibson.com`)
**Description:** The published privacy policy and accessibility statement use `developer@dtgibson.com`, but the new Firefox checklist had introduced a different address. Stores expect the listed contact to be a real, monitored mailbox, and the published documents must agree.
**Remediation:** The maintainer confirmed `developer@dtgibson.com` is the contact for projects. The checklist was corrected to match the privacy policy and accessibility statement.
**Status:** Resolved

### 2. NOAA host justification understated the request payload
**Severity:** Low
**Location:** `store/permissions-and-privacy.md` (NOAA justification)
**Description:** The justification stated only that coordinates are not sent, omitting that the resolved station ID and the checklist's date and time window are sent. Accurate but incomplete.
**Remediation:** Reworded to state exactly what each request sends (the station's NOAA ID and the date/time window), while keeping the true point that exact coordinates are never sent.
**Status:** Resolved

### 3. eBird host justification said "the checklist ID only"
**Severity:** Informational
**Location:** `store/permissions-and-privacy.md` (eBird justification)
**Description:** Beyond the checklist ID, the eBird-returned location ID is sent to follow-up eBird endpoints. All requests still go only to eBird; the word "only" understated the request set.
**Remediation:** Reworded to note the checklist ID and the derived location ID, all sent only to eBird.
**Status:** Resolved

### 4. `.gitignore` lacked an explicit `.env` pattern
**Severity:** Informational
**Location:** `.gitignore`
**Description:** No `.env` file exists, but a bare `.env` was not ignored (only `*.local` was), leaving a future accidental-commit gap.
**Remediation:** Added `.env` and `.env*` to `.gitignore`.
**Status:** Resolved

### 5. Privacy policy URL depends on the repo staying public
**Severity:** Informational
**Location:** Privacy policy URL used in both listings (GitHub blob page)
**Description:** The privacy policy URL resolves only while the repository is public, and points at the branch tip, so future edits change what reviewers see. Not a current violation; a GitHub-rendered page is an acceptable host for both stores.
**Remediation:** Keep the snowraven-mini repo public for the life of the listing (it is AGPL and public already). Optionally pin to a tag or GitHub Pages later.
**Status:** Accepted

---

## Checks Performed

| Check | Result |
| --- | --- |
| Secret-leak scan: source files, full git history, source archive, shipped bundles | Pass (no keys, tokens, .env, private keys, or credentials) |
| No hardcoded/default/fallback API key in runtime code | Pass (keys read from chrome.storage.local at runtime only) |
| Embedded Inter woff2 fonts are genuine font binaries, not payloads | Pass (wOF2 magic header verified) |
| Disclosures name exactly the hosts the code contacts (eBird, OpenWeather, NOAA) | Pass |
| "No data collected / nothing to the developer" is truthful | Pass (storage limited to the two BYO keys; no telemetry; no server) |
| "No remote code" is truthful | Pass (offline timezone, JSON-only fetches, no eval/import/importScripts) |
| `data_collection_permissions {"required":["none"]}` is honest and present in both zips | Pass |
| Per-permission justifications (activeTab, storage, clipboardWrite) match code | Pass |
| Per-host justifications match code | Pass after wording fixes (findings 2 and 3) |
| No new manifest permissions or optional host permissions vs prior version | Pass |
| No new runtime dependencies; sharp/Chromium are build-time only, not bundled | Pass |
| `npm audit` | Pass (0 vulnerabilities) |
| dist/ has no source maps and no secret-bearing logs | Pass |
| Build-time assets (script, fonts) absent from dist/ and the shipped zips | Pass |
| Chrome Limited Use certifications truthfully claimable | Pass |
| No remotely hosted code (MV3 / AMO) | Pass |
| Screenshots show the genuine UI | Pass (rendered from the real component CSS) |
| No false affiliation / trademark misuse | Pass |
| AMO source provided and buildable; reproduces the shipped package | Pass (verified by clean rebuild) |
| Privacy policy URL reachable | Pass (HTTP 200) |
| Contact email consistent across published documents | Pass after fix (finding 1) |

## Convention Flags
None for `CLAUDE.md` beyond the Engineer's flags (store package layout and `npm run store:assets`).
