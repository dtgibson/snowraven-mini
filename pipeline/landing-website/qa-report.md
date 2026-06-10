# QA Report: Landing Website

**Date:** 2026-06-10
**Test Runner:** vitest (extension regression) + static verification
**Result:** PASSED

## Test Suite Results
The extension's suite remains green: 65 tests passing, 0 failing, and `git status docs/` confirms this feature did not touch the extension code or the `docs/` folder. The website is static (no test runner of its own); it was verified against the PRD's QA criteria directly.

## Acceptance Criteria Verification

| ID | Result | Notes |
|---|---|---|
| QA-01 | Pass | `index.html` has header, hero, `#privacy`, `#features`, `#install`, and footer landmarks. |
| QA-02 | Pass | Styles use the `--accent #2D8653` token and a system font stack; copy has no em dashes and no "byte for byte" (see fix below). |
| QA-03 | Pass | Plain HTML/CSS/JS; no framework, CDN, or build step. |
| QA-04 | Pass | Hero has the purpose line, the `#install` CTA, the GitHub secondary, and the meta line. |
| QA-05 | Pass | Privacy band states keys stay on device, with four supporting points. |
| QA-06 | Pass | Four feature rows, each rendering the live popup UI; headings present, including the renamed "Also get the tides." |
| QA-07 | Pass | Chrome and Firefox shown as "Coming soon" with no live store links; the GitHub-release path is present. |
| QA-08 | Pass | Footer links the repo, Help, privacy policy, accessibility, and the SnowRaven app. |
| QA-09 | Pass | `favicon.svg` and `assets/og-image.png` exist and are referenced. |
| QA-10 | Pass | Title, description, canonical, OG/Twitter tags with image, color-scheme meta, and the anti-flash theme script all present. |
| QA-11 | Pass | Dark token block, theme toggle, `localStorage` persistence, and `prefers-color-scheme` follow. |
| QA-12 | Pass | Responsive breakpoints at 920px and 720px; skip-link, ARIA labels, decorative `aria-hidden` SVGs, and reduced-motion handling. |
| QA-13 | Pass | `website/CNAME` is `snowravenmini.dtgibson.com`, `.nojekyll` present, and the Pages Actions workflow deploys `website/`; `docs/` is unchanged. |
| QA-14 | Pass | Store buttons are discrete `store-btn` blocks with `aria-disabled`, so the swap to live links is localized. |

## Edge Cases Tested
- Rendered the built site (external CSS/JS) headless and confirmed it matches the approved mockup.
- Confirmed balanced `<section>` markup and that the external stylesheet and script are correctly linked (no leftover inline blocks).
- Verified `docs/` is untouched by this feature.

## Fixes During QA
- The `<title>` and `og:title` carried an em dash from the mockup ("SnowRaven Mini — Weather and tide..."). Replaced with a colon and re-verified both files are clean of em dashes.

## Known Limitations
- The custom domain and the social-card URL resolve only after deployment and the DNS record are in place. The live Pages deploy is verified at the Deployer step; locally the site renders correctly from `website/`.

## Convention Flags
- The static site lives in `website/` and deploys via `.github/workflows/pages.yml`; future site edits push there.
