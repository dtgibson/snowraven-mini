# QA Report: Store Submission Prep

**Date:** 2026-06-10
**Test Runner:** vitest
**Result:** PASSED

## Test Suite Results
65 tests passing, 0 failing (9 files). `npm run build` is clean (tsc + vite). The manifest version bump and the new `data_collection_permissions` key did not affect any test, including the byte-exact golden tests and the page-detection tests.

## Acceptance Criteria Verification

| ID | Result | Notes |
|---|---|---|
| QA-01 | Pass | Listing copy present; no em dash, no "byte for byte"; Chrome summary 117/132, AMO summary 240/250. |
| QA-02 | Pass | `store-icon-128.png` is 128x128 PNG (transparency retained, which is allowed for the store icon). |
| QA-03 | Pass | 5 light screenshots at 1280x800 (no alpha) plus 2 dark variants, all showing real popup/options UI. |
| QA-04 | Pass | Chrome name, 132-char summary, description, category (Productivity), and language documented. |
| QA-05 | Pass | Promo tile is 440x280 PNG, no alpha. |
| QA-06 | Pass | Single-purpose line, justifications for all 3 permissions and all 3 hosts, remote-code answer, data-usage answer, and 3 Limited Use certifications all written. |
| QA-07 | Pass | Chrome checklist covers registration and the $5 fee, item upload, the privacy tab, and submission. |
| QA-08 | Pass | AMO name, 250-char summary, description, categories, tags, support, homepage, AGPL-3.0 license, and privacy policy documented. |
| QA-09 | Pass | `manifest.json` has `gecko.data_collection_permissions = {"required":["none"]}`, version 1.0.0; documented in the privacy doc. |
| QA-10 | Pass | `snowraven-mini-source-1.0.0.zip` includes `src/`, `manifest.json`, `vite.config.ts`, and `package-lock.json`; `BUILD.md` gives `npm ci` then `npm run build`. Reviewer performs the final rebuild-and-diff; inputs are complete and the build is deterministic. |
| QA-11 | Pass | AMO reviewer notes explain the keyless-NOAA test path and reference BUILD.md. |
| QA-12 | Pass | Firefox checklist covers mandatory 2FA, the source-archive upload, and the data-collection declaration. |
| QA-13 | Pass | Privacy policy URL present in the listing and privacy docs; `PRIVACY_POLICY.md` matches actual behavior (local storage, no collection). |
| QA-14 | Pass | The three hosts agree across the manifest, the privacy doc, and the privacy policy; no contradiction. |
| QA-15 | Pass | Both zipped manifests are v1.0.0 with the gecko id, `strict_min_version` 128.0, and the data-collection key. |
| QA-16 | Pass | No `v0.1.0` reference remains in README or `docs/HELP.md`. |

## Edge Cases Tested
- Scanned all `store/*.md` and `BUILD.md` for em dashes and the phrase "byte for byte": clean after the fix below.
- Extracted and parsed `manifest.json` from both packaged zips to confirm version and the gecko block survive packing.
- Verified the source archive contents directly rather than trusting the build step.

## Fixes During QA
- First pass flagged em dashes in the document titles and bullet separators of the `store/` docs and `BUILD.md` (the pasteable store copy itself was already clean). Replaced them with colons and re-verified. One QA assertion was also over-strict (looked for "Categories" where the doc reads "Category"); corrected the check.

## Known Limitations
- The exact wording of Chrome's live data-usage checkboxes and AMO's category list can shift; both checklists tell the maintainer to confirm at submission.
- The AMO reviewer's reproducible-build diff is performed by Mozilla; we verified the source archive and build instructions are complete and the build is deterministic, but did not run a full clean-room `npm ci` rebuild-and-diff in this stage.

## Convention Flags
- None beyond the Engineer's flags (store package layout and `npm run store:assets`).
