# Design Spec — Weather and Tide on the eBird Checklist Page

## Visual Direction

A smaller sibling of the SnowRaven desktop app: quiet utility, clover-green used only on the single primary action, monospace output blocks for the weather and tide text, and an OS-driven light/dark theme built on the app's real tokens. Calm and uncluttered; the popup gets the user from click to paste with no ceremony. Full token values and patterns live in `pipeline/design-system.md`.

## Screens / Views

### Popup (the primary surface, ~380px wide)

A single-column stack inside a rounded shell (~10px). A compact header (`SnowRaven Mini` wordmark + inline raven/clover SVG mark), then the state-specific body. States:

- **Result (happy path)** — the weather block then the tide block, each a bordered monospace card with an uppercase eyebrow ("Weather" / "Tide") and its own **Copy** button (button flips to "Copied!" with a polite announcement). Weather is also auto-copied to the clipboard the moment the popup opens (see Interaction Notes) — the visible Copy button is for re-copying; tide is copied only by its button.
- **Tide too-far / outside-US** — weather block as normal; tide replaced by an amber notice (icon + text) such as "The nearest tide station is 240 miles away (Duluth, MN). Tide data may not reflect your spot." with a secondary "Show it anyway" / "Show nearest US station" override button.
- **Loading** — a calm "Loading weather & tide…" with a reduced-motion-safe spinner and status text.
- **Not on a checklist** — a calm, non-error message: open an eBird checklist edit page to get its weather.
- **Missing keys** — a nudge naming the missing key(s) with a "Go to Settings →" action.
- **Permission needed** — a one-time prompt ("Allow SnowRaven Mini to reach eBird, OpenWeather, and NOAA?") with a filled-green **Grant access** button.
- **Weather error** — an alert card (e.g. "eBird API key invalid. Check it in Settings.") with a Settings link.

### Options page (full width, ~640px)

Two masked API-key fields (eBird, OpenWeather) with a reveal toggle, a per-field "Get a free key ↗" link, a filled-green **Save keys** primary button with a "Saved" confirmation, and a "Keys stay on this device." privacy line.

## Component Usage

No component library — plain semantic HTML + hand-authored CSS on the design-system tokens; inline SVG for the wordmark mark and the small status/notice icons. The monospace output card is the app's `MonoBlock` pattern. One filled green button per surface; all other controls are accent-tint or link styled.

## Design Tokens Applied

Primary `#2D8653` (Grant / Save only); accent `#E8F5EE`/`#1A5C38` for Copy/override/Settings; warning tokens for the tide notice; destructive `#B91C1C` on `#FEF2F2` for errors; monospace blocks on `#FAFAFA`; radius 0.5rem (shells 10–12px); Inter throughout; the dark theme uses the app's zinc+emerald ramp via `prefers-color-scheme`.

## Interaction Notes

- **Auto-copy weather on open:** when the popup opens on a valid checklist, after the lookup resolves the weather block is written to the clipboard via `navigator.clipboard.writeText` (reliable because the manifest holds `clipboardWrite`), and a polite live region announces "Weather copied to clipboard." Tide is never auto-copied.
- **Copy buttons** flip to "Copied!" for ~2s and announce via the polite live region.
- **Override** ("show it anyway") re-runs the tide lookup with the distance/region check relaxed.
- **Focus** is visible on every control (green ring); the popup manages focus sensibly on open and Escape closes it.
- **Theme** follows the OS (`prefers-color-scheme`); the mockup's toggle is preview-only.
- **Reduced motion** freezes the spinner and disables transitions.

## Content Notes

Copy is calm and plain. The weather and tide blocks render SnowRaven's exact output format byte-for-byte (literal lines, single-newline joins, the HTML `<a>` SnowRaven attribution shown as on-screen text, becoming a real link only once pasted into eBird; the tide block keeps its "Tide data from NOAA CO-OPS · via SnowRaven" credit). Realistic example content only — a real harbor, plausible conditions, valid 8-point wind directions.
