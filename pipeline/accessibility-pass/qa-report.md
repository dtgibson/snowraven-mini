# QA Report — Accessibility Pass

**Date:** 2026-06-14
**Test Runner:** vitest
**Result:** PASSED

## Test Suite Results
89 tests passing, 0 failing (9 files). Includes the weather/tide golden parity
locks (weatherFormatter.golden 36, tideFormatter.golden 2, tide 18), so the
copied output remains byte-identical to SnowRaven — no parity regression.
`npm run build` (tsc -b + vite) is clean.

## Acceptance Criteria Verification

| Criterion | Result | Notes |
|---|---|---|
| All 15 audit findings resolved | ✓ Pass | Verified per finding below |
| `npm test` green | ✓ Pass | 89/89 |
| `npm run build` green | ✓ Pass | tsc -b + vite, no errors |
| Both themes pass AA contrast | ✓ Pass | dark button-hover 5.88, dark link-hover 6.98, light input border 3.42 — all clear threshold |
| Popup + Options expose a `<main>` landmark | ✓ Pass | `<main>` present on both |
| Popup + Options expose an `<h1>` | ✓ Pass | brand promoted to `<h1>` on both |
| Async state changes announced | ✓ Pass | 8 `announce()` calls via the shared polite live region |

### Findings resolved
- **Serious:** dark-theme hover contrast (S1), async state announcements (S2)
- **Moderate:** light input border (M1), keyboard-reachable output block (M2),
  Options heading (M3), labelled Weather/Tide regions (M4), reliable status
  announcements (M5)
- **Minor:** arrow glyphs hidden from accessible names (m1), popup `<h1>` + h2
  hierarchy (m2), `<main>` landmark (m3), `<header>`/banner (m4), zoom-safe
  inputs (m5)

## Regression Check
- Golden parity tests green → weather/tide/formatting output is unchanged.
- Build clean → no type or import breakage from the landmark/markup changes.
- No logic changes; the weather/tide block keeps `white-space: pre` (tabindex
  added, never rewrapped), so the clipboard bytes are unchanged.

## Edge Cases Tested
- No residual literal arrow glyphs in link/button accessible names (grep: 0).
- No leftover `console.log`/`console.debug` in components (grep: 0).

## Known Limitations
Source-level plus automated verification. Full assistive-tech behaviour
(screen-reader announcement timing across NVDA/VoiceOver, 400% reflow) is best
confirmed by loading the unpacked build; the audit's coverage caveats
(composite error-fallback state, full 400% reflow, Label-in-Name) remain
untested by automation and are candidates for a future manual pass.
