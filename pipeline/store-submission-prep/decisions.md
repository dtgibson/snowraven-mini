# Decisions — Store Submission Prep

## 2026-06-10 — Version 1.0.0 for the store debut (both browsers)
**Decision:** Both the Chrome Web Store and Firefox Add-ons packages ship as a single **v1.0.0** build, rather than Chrome v0.1.1 / Firefox v0.1.2. Future updates resume incrementing by 0.1 (1.1, 1.2, ...).

**Why:** The maintainer chose 1.0 for parity and because a public debut reads better as 1.0 than 0.1.1. A single version also keeps one build serving both browsers, which the project already requires.

**Cascade:** Updated PRD FR-07, FR-09, FR-15, FR-16, QA-15, and resolved Open Question 6. The Firefox-only manifest change (gecko.data_collection_permissions, AMO requirement) is folded into the same v1.0.0 build; Chrome ignores the gecko block. Both packages now require a rebuild (Chrome can no longer reuse the v0.1.1 zip unchanged because the version string changes).

## 2026-06-10 — Published v1.0.0 to GitHub
**Action:** Committed the store-submission-prep work to `main` (commit e8d4ee8), pushed, and created the public GitHub release **v1.0.0** with three assets: `snowraven-mini-chrome-1.0.0.zip`, `snowraven-mini-firefox-1.0.0.zip`, and `snowraven-mini-source-1.0.0.zip`.

**Why:** The source archive and the privacy policy must be publicly reachable for the Chrome Web Store and Firefox AMO reviews. This GitHub release is the deployment for a browser extension; the actual store submissions remain the maintainer's manual step, guided by `store/chrome-submit-checklist.md` and `store/firefox-submit-checklist.md`.

**Verification:** Release marked Latest, not a draft or prerelease; all three assets attached; `main` at e8d4ee8; working tree clean.

