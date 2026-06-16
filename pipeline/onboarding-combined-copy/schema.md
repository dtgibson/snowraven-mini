# Schema / Technical Design — Onboarding & Combined Copy

**Feature:** onboarding-combined-copy
**Stage:** 3 — The Architect
**Path:** Frontend Only
**Source:** `pipeline/onboarding-combined-copy/prd.md` (approved)

---

## 1. Path assessment — Frontend Only

**No data layer changes.** SnowRaven Mini is a popup-only MV3 extension with no
backend, database, ORM, or migrations (CLAUDE.md: "No backend, ever"). Both
additions are pure UI: the walkthrough is a richer render of the existing
`missing-keys` page state, and combined copy threads an already-returned string
(`tide.body`) through in-memory React state into a new button. Nothing is
created, read, updated, or deleted at rest. The only at-rest state in the whole
app is the two BYO keys in `chrome.storage.local` (`src/lib/ext/storage.ts:10-34`),
and this feature does not touch that contract — keys are still entered solely on
Options (FR-07).

`schema.md` therefore documents the **frontend architecture** the Engineer
(Stage 5) implements, not a data model.

---

## 2. Frontend architecture

Two independent changes, no shared state between them. Below, every claim is
anchored to the real code.

### 2a. Combined copy

**The string already exists.** `buildCombined(weatherFormatted, tideBody)` is
ported and live at `src/lib/tideFormatter.ts:63-65`. Do **not** re-port or
re-derive it (PRD Out of Scope; FR-15 covers only tightening the test). It
strips the standalone weather `ATTRIBUTION` line, joins weather body + blank +
tide body + blank + `COMBINED_ATTRIBUTION` (`tideFormatter.ts:16`). The
night-block moon-phase run rides inside `weatherFormatted` untouched, so FR-20
holds for free.

**The tide body already flows out of the service.** `getTide` returns `body`
on the `ok` case (`src/lib/tideService.ts:29,94` — `body: formatTideBody(reading)`).
The gap is purely that the popup discards it. Today `Popup.tsx:114` sets only
`{ status: 'ok', formatted: res.formatted }`. The thread:

1. **Type (FR-22)** — widen the `ok` variant of `TideState` in
   `src/lib/types.ts:39` to carry `body`:
   ```ts
   | { status: 'ok'; formatted: string; body: string }
   ```
2. **Popup state** — at `Popup.tsx:114`, pass `body` through:
   `setTide({ status: 'ok', formatted: res.formatted, body: res.body ?? '' })`.
   Apply the same at the override success branch (`Popup.tsx:153-155`), which
   today rebuilds the `ok` state without `body` — it must thread `res.body` too,
   or the combined button silently disappears after an override.
3. **Prop into the panel** — `WeatherTidePanel` already receives the full
   `tide` object (`WeatherTidePanel.tsx:79`), so `tide.body` is available inside
   the `ok` branch with no new prop.

**Where the button renders.** Default placement (OQ-03): a single **full-width
secondary** button below the Tide slot, after the closing `</section>` of the
Tide block (`WeatherTidePanel.tsx:191`), so it sits visually distinct from the
two per-block `sr-btn-copy` buttons. The Designer settles final styling; reuse
existing tokens — `sr-btn-ghost` (`globals.css:275`) or `sr-btn-primary`
(`globals.css:253`) is the secondary-vs-primary call to hand the Designer. Do
**not** introduce a new button class without Designer sign-off.

**Render condition (FR-10/11).** Gate on both blocks succeeding in the same
open:
```ts
const showCombined = weather.status === 'success' && tide.status === 'ok';
```
Render the button only when `showCombined`. Every other tide state
(`loading`/`too-far`/`outside-us`/`unavailable`/`error`) and every non-success
weather state hides it — covered by the single conjunction above.

**Click handler (FR-14/18/19).** Local `copied` state, same pattern as
`BlockEyebrow` (`WeatherTidePanel.tsx:43-49`):
```ts
const text = buildCombined(weather.formatted, tide.body); // both narrowed by showCombined
const ok = await copyText(text);                          // src/lib/ext/clipboard.ts:13
if (ok) {
  setCombinedCopied(true);
  announce('Weather and tide copied to clipboard.');      // shared polite region
  setTimeout(() => setCombinedCopied(false), 2000);
}
```
On `ok === false`, show no success state and announce nothing (FR-19). The
button label is exactly `Copy weather & tide together` (FR-13). It is
**manual-only** — no `useEffect`, no auto-fire; it copies solely on click
(FR-16). The existing weather auto-copy (`Popup.tsx:94-101`) is untouched (FR-17).

**A small extraction call for the Engineer.** `BlockEyebrow`
(`WeatherTidePanel.tsx:30-66`) already encapsulates the "click → copy →
`Copied!` for 2000ms" pattern. The combined button is full-width below the
slots, not an eyebrow, so it should be its own small component (or inline
block) reusing the same `copied`/`setTimeout` shape — not shoehorned into
`BlockEyebrow`. Lift the timeout pattern; don't duplicate the eyebrow layout.

**Test (FR-15).** The combined golden test already exists at
`src/lib/tideFormatter.test.ts:58-88` but asserts with `.toContain` /
occurrence-counting. FR-15 requires a single `.toBe` on the **full** combined
string. Add one assertion that builds the expected block from the real
`weather` + `tideBody` fixtures already in that file (lines 62-71) and asserts
`expect(combined).toBe(expected)`. Keep the existing assertions. Do **not**
re-port `buildCombined`.

### 2b. Walkthrough

**It replaces one render branch, nothing else.** The `missing-keys` branch at
`Popup.tsx:315-355` becomes the guided panel. The page-state machine, the
`missing` detection (`Popup.tsx:207-221`), and the `MissingKey[]` it produces
are **unchanged** — the walkthrough is a presentation swap on existing state.
All other page states (`not-on-checklist`, `checklist-view`,
`permission-blocked`, `loading`, `result`) are untouched (FR-09).

**No "seen" flag.** Per FR-08/OQ-04, the walkthrough shows whenever a key is
missing and vanishes once both keys are set — that is exactly today's
`missing-keys` gate (`Popup.tsx:210`). There is **no new persisted state**, no
`chrome.storage` write, no dismissal memory.

**Content (FR-02/03/04/05).** The panel must:
- Name **both** keys explicitly: "eBird API key", "OpenWeather API key" (FR-02).
- State both are **free** (FR-03).
- Link out to each provider's key page, **new tab, no permission** — reuse the
  `sr-getkey` / `sr-link-action` anchor pattern with `target="_blank"
  rel="noreferrer"` (already used at `Options.tsx:28-30`, `Popup.tsx:301-309`).
  Default URLs (OQ-02), matching what Options already ships
  (`Options.tsx:104,112`): eBird → `https://ebird.org/api/keygen`,
  OpenWeather → `https://openweathermap.org/api`. A plain `<a target="_blank">`
  navigates without `chrome.permissions.request`, so NFR-04 holds.
- Offer **"Go to Settings"** via the existing `openOptions()`
  (`src/lib/ext/options.ts:5`, already wired at `Popup.tsx:348`). Do not add a
  new options-open path.

**One-key-missing variant (FR-06).** The existing branch already does this at
`Popup.tsx:322-347`: it distinguishes both-missing / eBird-only / OW-only and
shows "set ✓" for the key the user already has. Preserve that three-way logic —
the walkthrough enriches the copy and adds the per-key get-a-key links, but must
keep telling a half-configured user which single key is still needed and which
is already set. Do not collapse it to a generic "add your keys" message.

**Accessibility (NFR-01/02).** 
- Announce on open via the shared polite live region. The `announce(...)` call
  already fires for this state (`Popup.tsx:213-219`) — keep it; ensure the
  spoken text still names the missing key(s) and points to Settings, and does
  not duplicate or clobber the weather/tide announcements (it can't: different
  page state, the live region is written once per state — `Popup.tsx:69-73`).
- Keyboard-reachable controls with visible focus, real `<button>`/`<a>`
  elements (no div-buttons), labelled. AA contrast in both themes is inherited
  by reusing the existing token classes — do not hard-code colors.
- Reuse existing design tokens: `sr-notice` / `sr-notice-neutral`
  (`globals.css:359-374`), `sr-info-state` (`globals.css:334`), `sr-nudge-body`
  / `sr-nudge-actions` / `sr-nudge-meta` (`globals.css:391-401`),
  `sr-link-action` (`globals.css:296`), `sr-strong` (`globals.css:390`). New
  structural CSS, if any, is the Designer's call.

---

## 3. File-level change plan

| File | Change |
|---|---|
| `src/lib/types.ts` | Widen `TideState` `ok` variant to `{ status: 'ok'; formatted: string; body: string }` (FR-22). |
| `src/components/Popup.tsx` | Thread `res.body` into the `ok` tide state at **two** sites — the main lookup (`:114`) and the override success (`:153-155`). Replace the `missing-keys` render branch (`:315-355`) with the guided walkthrough panel (both-keys + one-key variants, per-key new-tab get-key links, "Go to Settings"). Keep the existing `announce` for this state. |
| `src/components/WeatherTidePanel.tsx` | Add the full-width "Copy weather & tide together" button below the Tide section, rendered only when `weather.status === 'success' && tide.status === 'ok'`. Local `copied` + 2000ms revert; `copyText(buildCombined(weather.formatted, tide.body))`; announce success; import `buildCombined` from `../lib/tideFormatter`. Leave both per-block Copy buttons unchanged (FR-12). |
| `src/lib/tideFormatter.test.ts` | Add a single `.toBe` assertion on the full combined string (FR-15) using the existing fixtures (`:62-71`). Keep existing assertions. Do not re-port `buildCombined`. |
| `src/globals.css` | Only if the Designer specifies a new button/panel style. Default reuses existing tokens — prefer zero CSS change. |

**Manifest: no change.** No new `permissions` or `optional_host_permissions`
(NFR-04). Confirm at review that the manifest diff is empty.

---

## 4. Risks / decisions the Engineer must not get wrong

1. **Parity is byte-exact.** The combined block must equal SnowRaven desktop's
   `buildCombined()` output. Do not reformat, re-space, or "tidy" the string;
   feed `weather.formatted` and `tide.body` straight in. The night moon-phase
   emoji run stays unspaced (`☁️🌗`) because it lives inside `weather.formatted`
   untouched — never post-process it (FR-20, CLAUDE.md parity contract).

2. **Use `tide.body`, never `tide.formatted`, for the combined copy.**
   `formatted` is the standalone block ending in `· via SnowRaven`
   (`tideFormatter.ts:46-54`); `body` ends in the bare NOAA credit
   (`tideFormatter.ts:30-43`). Combining from `formatted` would produce two
   attributions and break FR-21/FR-14. This is the single most likely bug.

3. **Thread `body` at the override site too.** `Popup.tsx:153-155` rebuilds the
   `ok` state. If it omits `body`, the combined button vanishes after a user
   overrides an out-of-range tide. Easy to miss — both `ok` writes must carry
   `body`.

4. **No new permissions, no auto-copy.** Walkthrough links are plain
   `target="_blank"` anchors (no `chrome.permissions.request`). The combined
   copy fires only on click — no `useEffect` auto-trigger (FR-16, NFR-04).

5. **Reduced motion.** The "Copied!" affordance must honor
   `prefers-reduced-motion`. The global rule disables transitions under reduced
   motion (`globals.css:144-152,329-331`); the existing copy buttons already
   comply via tokens. Reuse those tokens; do not add a bespoke animated
   confirmation (NFR-07).

6. **No "seen"/dismissal state.** The walkthrough is driven entirely by the
   live `missing-keys` gate. Do not add a persisted dismissal flag — it would
   contradict FR-08 and add at-rest state this feature explicitly does not have.

7. **Verify green before ship.** `npm test` (incl. the tightened golden) and
   `npm run build` must pass (NFR-03, CLAUDE.md).
