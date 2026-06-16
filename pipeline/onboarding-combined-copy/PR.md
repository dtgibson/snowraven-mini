## Onboarding & Combined Copy

### What this does
Two additive popup improvements shipped together. The first-run walkthrough
replaces the bare missing-keys notice with a guided setup card that names both
free keys, gives each one a "Get a free key" link, and offers a one-click path to
Settings. The combined-copy button adds a full-width "Copy weather & tide
together" control below the two result blocks that copies a single block matching
SnowRaven desktop's `buildCombined()` output byte-for-byte. Nothing about the
existing weather lookup, tide lookup, per-block Copy buttons, or weather auto-copy
changes.

### How to test
1. `npm test` — 90 tests pass, including the new `.toBe` parity assertion in
   `src/lib/tideFormatter.test.ts`.
2. `npm run build` — `tsc -b` and `vite build` both clean.
3. Load `dist/` as an unpacked extension (Chrome: `chrome://extensions` →
   Developer mode → Load unpacked; Firefox: `about:debugging` → This Firefox →
   Load Temporary Add-on → pick `dist/manifest.json`).
4. With no keys set, open an eBird checklist's Edit Comments page and click the
   toolbar icon. You should see the walkthrough: "Two free keys and you're set",
   a row per key marked "Needed" with a "Get a free key" link (opens the
   provider's key page in a new tab, no permission prompt), and "Go to Settings".
5. Set just one key on Settings, reopen the popup. The walkthrough switches to
   "One free key to go", shows the set key with a green check and "Set", hides
   that row's get-key link, and names only the missing key in the foot line.
6. Set both keys, grant host access, and open a checklist that has both weather
   and tide. Below the Tide block, the "Copy weather & tide together" button
   appears. Click it — it flips to "Copied!" for ~2 seconds and a screen reader
   announces "Weather and tide copied to clipboard." Paste into a comment: one
   block, one SnowRaven attribution at the bottom, the inline NOAA credit kept.
7. Open a checklist with no tide (or an out-of-range station). The combined
   button is absent; the per-block Copy buttons and weather auto-copy are
   unchanged.

### Notes for reviewer
- The combined block is built from `weather.formatted` + `tide.body`, never
  `tide.formatted`. `formatted` ends in `· via SnowRaven`, which would
  double-attribute and break byte parity. `body` keeps the inline NOAA credit and
  ends in the bare NOAA credit line, which is what `buildCombined` expects.
- `tide.body` is now threaded through the UI state at both `ok` write sites in
  `Popup.tsx` — the main lookup and the tide-override success branch. Missing the
  second would silently hide the combined button after a user overrides an
  out-of-range tide.
- `buildCombined` was not re-ported; it already lives at `tideFormatter.ts:63`.
  The test change is one added `.toBe` assertion on the full combined string,
  built from the existing fixtures; the prior assertions are kept.
- No manifest change. No new `permissions` or `optional_host_permissions`. The
  walkthrough's get-key links are plain `target="_blank"` anchors that navigate
  without `chrome.permissions.request`.
- New CSS lives in `src/globals.css`, ported verbatim from the approved mockup's
  "NEW (this feature)" block. Every value resolves to an existing `--sr-*` token;
  no new colors. The walkthrough's per-row get-key style is scoped under
  `.sr-keyrow .sr-getkey` so the Options page's existing `.sr-getkey` is
  untouched.
- The combined button is secondary (accent-tinted with a structural border), not
  filled green — per decisions.md D-01, filled green stays reserved for the one
  primary action per surface.
- Accessibility: the button and every walkthrough control are real
  `<button>`/`<a>` elements, keyboard-reachable with the global focus ring; the
  set key's hidden get-key link is removed from the tab order
  (`tabindex="-1" aria-hidden`); success and walkthrough state announce through
  the shared polite live region; the "Copied!" flip rides the global
  reduced-motion transition-disable rule.
