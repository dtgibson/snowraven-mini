# QA Report — Onboarding & Combined Copy

**Date:** 2026-06-15
**Test Runner:** vitest
**Result:** PASSED

## Test Suite Results
90 tests passing, 0 failing (9 files). `npm run build` (tsc + vite) green.
The combined-copy golden parity tests live in `src/lib/tideFormatter.test.ts`
(9 tests) and `src/lib/tideFormatter.golden.test.ts` (2 tests); the unspaced
night moon run is locked in `src/lib/weatherFormatter.golden.test.ts` (36 tests).

```
Test Files  9 passed (9)
     Tests  90 passed (90)
```

## Acceptance Criteria Verification

Verified against the actual working tree, not the PRD's wording or the
Engineer's notes. The lib-level parity rows have real `.toBe` golden tests;
the UI-behavioral and a11y rows have no component render tests, so they were
verified by reading the code and the CSS tokens and reasoning about them. Where
a row could only be established by inspection that is flagged below the table.

| ID | Criterion | Result | Notes |
|---|---|---|---|
| QA-01 | Walkthrough replaces bare notice | ✓ Pass | `missing-keys` page state renders `<Walkthrough>` only — `Popup.tsx:392`. The old plain notice is gone. |
| QA-02 | Both keys named | ✓ Pass | `KEY_META` names "eBird API key" and "OpenWeather API key", rendered in every row — `Popup.tsx:56-58, 96`. |
| QA-03 | Keys described as free | ✓ Pass | Foot line "Both are free to get." / "The {key} key is free to get." plus "Get a free key" per row — `Popup.tsx:115-116, 106`. |
| QA-04 | Where-to-get links, new tab, no permission | ✓ Pass | Plain `<a target="_blank" rel="noreferrer">` to `ebird.org/api/keygen` and `openweathermap.org/api` — `Popup.tsx:99-104`. Anchors request no permission. |
| QA-05 | Open Settings from walkthrough | ✓ Pass | "Go to Settings" button calls the existing `openOptions` — `Popup.tsx:118`. |
| QA-06 | One-key-missing copy | ✓ Pass | `bothMissing` branches the lead ("Your eBird key is set. Add your OpenWeather key…"); the set row shows a check + "Set" and drops its get-key link from the tab order (`tabIndex:-1`, `aria-hidden`) — `Popup.tsx:62-104`. Never tells the user to re-enter a held key. |
| QA-07 | Walkthrough stores no key | ✓ Pass | `Walkthrough` has no inputs and no storage call; key entry is solely on Options via `KeyField`. Verified by inspection — no write path exists in the component. |
| QA-08 | Walkthrough clears after setup | ✓ Pass | The key gate pushes to `missing` only when a key is absent; with both set the flow falls through to `checklist-view`/`permission-blocked`/`result` and never sets `missing-keys` — `Popup.tsx:284-298`. |
| QA-09 | Other page states unchanged | ✓ Pass | `not-on-checklist`, `checklist-view`, `permission-blocked`, `resolving`/`loading`, `result` render blocks are untouched by this feature — only the `missing-keys` branch changed. Verified by reading the full render tree, `Popup.tsx:332-431`. |
| QA-10 | Combined button only when both present | ✓ Pass | Rendered only on `weather.status === 'success' && tide.status === 'ok'` — `WeatherTidePanel.tsx:234`. |
| QA-11 | Combined button hidden otherwise | ✓ Pass | Same gate: any non-success weather or any tide state other than `ok` (`loading`/`too-far`/`outside-us`/`unavailable`/`error`) drops the button — `WeatherTidePanel.tsx:234`. |
| QA-12 | Per-block buttons preserved | ✓ Pass | Weather `BlockEyebrow` (copy `weather.formatted`) and Tide `BlockEyebrow` (copy `tide.formatted`) are unchanged and independent of the combined button — `WeatherTidePanel.tsx:126-139, 174-187`. |
| QA-13 | Exact button label | ✓ Pass | Label is the literal `Copy weather & tide together` — `WeatherTidePanel.tsx:102`. |
| QA-14 | Clipboard contents | ✓ Pass | Click writes `buildCombined(weatherFormatted, tideBody)` where `weatherFormatted = weather.formatted` and `tideBody = tide.body` — `WeatherTidePanel.tsx:87, 236-238`. Built from `tide.body`, never `tide.formatted`. |
| QA-15 | Byte-for-byte parity, golden `.toBe` | ✓ Pass | `tideFormatter.test.ts` asserts `buildCombined(realWeather, realTideBody).toBe(expected)` where `expected` is built from the **independent** `formatWeatherBody` primitive (not `buildCombined`'s own formula), with the `weather === ${body}\n${ATTRIBUTION}` precondition asserted first. Non-circular; see note [a]. |
| QA-16 | Manual only, no auto-fire | ✓ Pass | The only combined `copyText` is inside the button's click `handle` — `WeatherTidePanel.tsx:86-87`. Popup's auto-copy copies `res.formatted` (weather only), never the combined block — `Popup.tsx:173`. No combined copy on open or on any state change. |
| QA-17 | Weather auto-copy unchanged | ✓ Pass | Auto-copy path (`copyText(res.formatted)`, once per open via `autoCopiedRef`, "Weather copied to clipboard." announce, `sr-copied-banner`) is untouched — `Popup.tsx:170-178`, `WeatherTidePanel.tsx:147-152`. |
| QA-18 | Success confirmation (~2000 ms) | ✓ Pass | On `ok` the button flips to "Copied!" and reverts via `setTimeout(…, 2000)` — same affordance as `BlockEyebrow` — `WeatherTidePanel.tsx:88-92`. |
| QA-19 | Failed copy honesty | ✓ Pass | `if (!ok) return;` before setting copied/announce — a false `copyText` shows no success and announces nothing — `WeatherTidePanel.tsx:88`. |
| QA-20 | Night moon-phase preserved | ✓ Pass | Weather block emits `${emoji}${moon}` unspaced (`weatherFormatter.ts:182`), locked by `.toBe` in `weatherFormatter.golden.test.ts:170-183` (`☁️🌗` N, `☁️🌓` S). `buildCombined` strips only the trailing attribution line, so the moon run passes through untouched. |
| QA-21 | Single attribution | ✓ Pass | `buildCombined` strips `\n${ATTRIBUTION}` (the weather standalone line) and appends one `COMBINED_ATTRIBUTION` — `tideFormatter.ts:63-64`. Test asserts exactly one combined attribution and `not.toContain('\n'+ATTRIBUTION)` — `tideFormatter.test.ts:73-80`. |
| QA-22 | Tide body threaded to UI | ✓ Pass | `TideState` `ok` carries `body: string` (`types.ts:39`); set at BOTH `ok` sites — main lookup (`Popup.tsx:192`) and the out-of-range override (`Popup.tsx:231`). The combined copy reads `tide.body`, which keeps the inline NOAA credit and no `· via SnowRaven`. |
| QA-23 | A11y — reach, label, focus, contrast | ✓ Pass (by inspection) | All controls are real `<a>`/`<button>` (keyboard-reachable); the combined button and per-key links carry `aria-label`; global `:focus-visible` ring applies to every control (`globals.css:115`). Contrast measured AA in both themes — see note [b]. |
| QA-24 | A11y — announcements | ✓ Pass | Combined success announces "Weather and tide copied to clipboard." via the shared `announce` polite region (`WeatherTidePanel.tsx:90`); walkthrough state announces on open (`Popup.tsx:290-296`). `announce` clears then re-sets in a microtask so it doesn't clobber, and weather/tide settle into one combined announcement — `Popup.tsx:146-150, 216-217`. |
| QA-25 | No new permissions | ✓ Pass | `manifest.json` `permissions` = `activeTab, clipboardWrite, storage`; `optional_host_permissions` = the three API hosts — unchanged. Walkthrough links are plain anchors. |
| QA-26 | Build & tests green | ✓ Pass | `npm test` 90/90; `npm run build` (tsc + vite) clean. |
| QA-27 | Cross-browser | ✓ Pass | Single shared manifest (with the `gecko` block) and one build; the additions use only standard DOM/React and `chrome.*` seams already shipped — no browser-specific code path added. |

## Notes on inspection-only rows

[a] **QA-15 assertion shape (hardened post-QA).** The golden `expected` is now
built from an **independent** primitive: `formatWeatherBody(...)` (the
no-attribution weather block, golden-tested separately against SnowRaven in
`weatherFormatter.golden.test.ts`) joined with the two blank lines and the single
`COMBINED_ATTRIBUTION` — it does **not** re-apply `buildCombined`'s own
`weather.replace(...)` expression. The test first asserts the precondition
`weather === ${weatherBody}\n${ATTRIBUTION}`, which makes the strip meaningful, then
`.toBe` locks the emitted bytes (attribution strip, the two blank-line joins, the
inline NOAA credit, the single combined attribution). A same-direction drift in
`buildCombined`'s strip/join logic now fails the test rather than passing
silently. The companion assertions (exactly one `COMBINED_ATTRIBUTION`,
`not.toContain('\n'+ATTRIBUTION)`, `not.toContain(TIDE_ATTRIBUTION)`,
`endsWith(COMBINED_ATTRIBUTION)`) pin the structure independently. The original
derived-`expected` circularity the QA pass flagged is resolved.

[b] **QA-23 contrast (measured, both themes).** All new color pairs clear WCAG AA
(≥4.5:1 normal text). Lowest pair: muted-fg on muted = 4.81:1 (light). Combined
button accent-fg/accent = 7.12:1 (light) / 7.75:1 (dark); is-copied state
9.22:1 (dark) / 7.98:1 (light); is-set keystate accent-fg/bg = 7.98:1 (light) /
9.22:1 (dark). Focus and reduced-motion are handled globally: `:focus-visible`
(`globals.css:115`) rings every control, and `@media (prefers-reduced-motion)
* { transition: none !important }` (`globals.css:149-151`) freezes the combined
button's transition, satisfying NFR-07 without per-component code.

## Edge Cases Tested
- One-key-missing in both directions (eBird set / OpenWeather missing and the
  reverse): correct lead copy, correct "Set" row, get-key link removed from the
  tab order on the set row.
- Combined button gating across every tide state, confirming it is absent in
  `loading`/`too-far`/`outside-us`/`unavailable`/`error` and present only on `ok`.
- The override path (`onTideOverride`) threads `body` so the combined button works
  after a user forces an out-of-range station — the second `ok` site that is easy
  to miss.
- Failed clipboard write (`copyText` → false): no "Copied!" flip, no announce.

## Known Limitations
- The walkthrough, the combined button, and the announcements have no component
  render test — they are covered by code inspection plus the lib-level golden
  tests. A jsdom/React Testing Library smoke test for the `missing-keys` →
  `Walkthrough` render and the combined-button gate would convert several
  inspection-only rows into automated coverage. Not a blocker for this feature;
  see Convention Flags.
- (Resolved post-QA) QA-15's golden `expected` was originally derived from
  `buildCombined`'s own expression; it now builds from the independent
  `formatWeatherBody` primitive with the attribution precondition asserted, so it
  is no longer circular (note [a]). Full suite still 90/90 green.

## Convention Flags
- Establish a lightweight component-render smoke layer (jsdom + React Testing
  Library) so popup page-state branches and button-gate conditions get automated
  coverage instead of inspection-only QA. The lib/golden discipline is excellent;
  the gap is purely at the component boundary.
- For parity golden tests, the expected value must be built independently of the
  function under test (a hand-typed literal, or — as applied here — composed from a
  different, separately-golden-tested primitive), never from the function's own
  expression, so a same-direction edit to both can't pass silently. Applied to
  QA-15 this stage; worth making a standing rule.
