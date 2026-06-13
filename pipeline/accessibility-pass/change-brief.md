# Change Brief — Accessibility Pass

## What is changing
A WCAG 2.1 AA pass on the extension's popup and Options UI, clearing the 15
findings the in-session audit confirmed (0 critical, 2 serious, 6 moderate,
7 minor). The edits are markup and CSS only: one dark-theme contrast token,
a screen-reader announcement when the popup resolves into its key / permission
/ checklist states, document structure (a `<main>` landmark, a real `<h1>`,
and labelled sections on both surfaces), keyboard access to the weather/tide
output block, and a few smaller CSS/markup fixes. No change to the weather,
tide, or formatting logic.

## Why now
The accessibility audit run this session graded the popup "substantially
conformant" but found a handful of concentrated AA gaps. Clearing them brings
the UI to a clean AA bar in one pass, while the audit context is fresh.

## User-facing impact
None for sighted users — no visible layout, copy, or behaviour change.
Assistive-tech users gain: readable hover-state buttons and links in dark
mode, spoken state changes, heading/landmark navigation, and keyboard access
to the weather/tide output. The only new text is screen-reader-only
announcement copy (e.g. "API keys not set yet").

## Decisions touched
None reversed. Honors the byte-for-byte SnowRaven parity contract (the
2026-06-11 night-weather decision): the weather/tide block is made
keyboard-reachable via `tabindex`, never rewrapped, so the copied bytes stay
identical and the golden tests stay green. Keeps the minimal-permission,
no-backend, small-bundle posture — no new dependencies or permissions.

## What done looks like
All 15 findings resolved; `npm test` (including the golden parity tests) and
`npm run build` green; both themes pass AA contrast; popup and Options each
expose a `<main>` landmark, an `<h1>`, and announce their async state changes.

---

## Findings to fix
15 confirmed findings, collapsing to 12 distinct edits (the two contrast
findings share one token; the missing-`<main>` and missing-`<h1>` were each
flagged by two dimensions). Locations are starting points — verify against
current source.

### Serious
- **S1 · Dark-theme hover contrast (1.4.3).** `--sr-primary-hover` is declared
  only in `:root`, never the dark `@media` block, so on hover primary button
  labels fall to 2.44:1 and link / "Get a free key" text to 2.90:1. Fix: add a
  dark-theme `--sr-primary-hover` (≈`#10b981`, verified to clear AA for the
  button fill, `.sr-link-action:hover`, and `.sr-getkey:hover`).
  globals.css ~:10 / :269 / :308 / :507.
- **S2 · Async resolve never announced (4.1.3).** The popup opens "Loading…"
  then silently swaps into missing-keys / permission-blocked / not-on-checklist
  / checklist-view; AT hears nothing. Fix: `announce()` a one-line summary as
  each terminal state is set. Popup.tsx ~:159/181/193/202/214, panels 248–356.

### Moderate
- **M1 · Light input border 2.79:1 (1.4.11).** Darken `--sr-input-border` to
  ≈`#8a8a93` (light theme only; dark already passes). globals.css:24.
- **M2 · Weather/tide block not keyboard-reachable (2.1.1).** The scrollable
  `<pre>` has no tabindex. Fix: `tabIndex={0}` + `role="group"` + an aria-label
  — do NOT rewrap (parity). WeatherTidePanel.tsx:16–18, globals.css:100–111.
- **M3 · Options page has no headings (1.3.1).** Promote the title span to
  `<h1>`. Options.tsx:90–98.
- **M4 · Weather/Tide titles are spans, not regions (1.3.1).** Wrap each block
  in `<section aria-labelledby>` using the eyebrow as the label.
  WeatherTidePanel.tsx:43/79/125.
- **M5 · Per-block status regions mount already-populated (4.1.3).** Loading /
  "no tide" / tide-error rows may not announce. Route through the persistent
  `announce()` channel. WeatherTidePanel.tsx:91–96/138–143/167–179.

### Minor
- **m1 · Arrow glyphs pollute accessible names (4.1.2).** `→` / `↗` are read
  aloud. Use the existing aria-hidden `ArrowRightIcon`, or wrap the glyph in an
  aria-hidden span. Options.tsx:30, WeatherTidePanel.tsx:113.
- **m2 · Popup has no `<h1>` (1.3.1).** Brand is a span; headings start at h3.
  Promote brand to `<h1>` and the state h3s to h2 (update `.sr-info-state h3`
  / `.sr-perm h3` selectors). Popup.tsx:31–48/253/263/336.
- **m3 · No `<main>` landmark (1.3.1).** Wrap primary content in `<main>` on
  both surfaces. Popup.tsx:235, Options.tsx:99.
- **m4 · Brand header is a div, not `<header>` (1.3.1).** Change the wrapper to
  `<header>` for a banner landmark. Popup.tsx:33, Options.tsx:90.
- **m5 · Options inputs clip at 200% zoom (1.4.4).** `height:42px` with no
  vertical padding clips enlarged text. Use `min-height` + vertical padding.
  globals.css:509–522.
