# Bug Brief — popup-shrinks-after-lookup

## What is broken
After a successful weather/tide lookup, the popup window progressively narrows
until it collapses to an unreadable vertical bar. It reproduces on one of the
user's two Macs but not the other, with the same installed build. The popup
looks normal in every pre-result state and only collapses once the result
renders.

## Root cause
`.sr-popup` (src/globals.css:162-167) is `width: 380px; max-width: 100%`. In an
MV3 popup the browser auto-sizes the window to its content, so `max-width: 100%`
is a percentage resolved against a containing block whose width is itself derived
from the content — a circular dependency with no hard pixel floor on `.sr-popup`,
`#root`, `body`, or `html`. The result state is the only one tall enough to
overflow the popup's max height and summon a vertical scrollbar; on a Mac set to
"Show scroll bars: Always" that scrollbar reserves ~15px, dropping the viewport
below 380, so `max-width: 100%` clamps `.sr-popup` under 380 and the popup
auto-sizer ratchets it down toward min-content. On the other Mac (overlay
scrollbars, 0px reserved) the viewport never dips below 380, so the loop never
starts. No app JS is involved (no ResizeObserver/resize code exists) — it is a
pure CSS + popup-auto-sizer feedback loop, latent since v0.1.0 (commit 9b9f916).

## Steps to reproduce
1. On the affected Mac, set System Settings > Appearance > "Show scroll bars" to
   "Always" (classic, width-reserving).
2. Open an eBird Edit Comments page (`/edit/effort?subID=S…`) and open the popup
   — it looks normal (~380px) before any lookup.
3. Let the lookup complete so the weather + tide `<pre>` blocks render (the only
   state tall enough to overflow vertically).
4. The reserved vertical scrollbar subtracts width → viewport < 380 →
   `max-width: 100%` clamps `.sr-popup` → it re-measures narrower and ratchets
   down to a vertical bar.
5. On the other Mac with overlay scrollbars ("When scrolling") there is no
   collapse. Quick confirm on the failing Mac: switching to "When scrolling"
   stops it.

## Expected behavior
After a lookup the popup holds its intended ~380px width and never narrows over
successive relayouts — identically on both Macs, regardless of the macOS
scrollbar setting, browser zoom, or display scaling.

## Blast radius
Confined to the popup window. `.sr-popup` is popup-only; the Options page uses
`.sr-options-*` and opens in a real browser tab with a fixed viewport, so it
cannot collapse. The fix touches only the `.sr-popup` width rule; the weather/
tide `<pre>` (`white-space: pre`, `overflow-x: auto`, `tabIndex`, text) is not
touched, so SnowRaven byte/clipboard parity and the golden tests are unaffected.

## Recommended fix (for The Engineer)
Give the popup shell a hard pixel floor so the auto-sized window can never clamp
it below its intended width. In `.sr-popup` (src/globals.css:162-167), remove
`max-width: 100%` and add `min-width: 380px` (per spec `min-width` wins over
`max-width` on conflict, and 380 < Chrome's 800px popup max, so the popup never
needs to shrink below 380). Single-rule, popup-only CSS change. Do NOT alter
`.sr-mono`, the `<pre>`, its `white-space`/`overflow-x`/`tabIndex`, or its text.

## What done looks like
- After a lookup the popup stays ~380px and does not narrow over successive
  relayouts, on both Macs, regardless of the macOS "Show scroll bars" setting,
  browser zoom, or display scaling.
- The weather/tide `<pre>` is byte-for-byte unchanged (still `white-space: pre`,
  `overflow-x: auto`, `tabIndex={0}`); clipboard + on-screen parity intact.
- The Options page is visually unchanged.
- `npm test` (Vitest golden parity tests) and `npm run build` (tsc + vite) stay
  green.
