# Design Spec — Store Submission Prep

## Visual Direction
The store assets sit inside the existing SnowRaven design system with no changes: restrained green (#2D8653), Inter, the raven mark, and a quiet-utility feel. The look says "a calm, useful tool," not a marketing splash. Reference: `pipeline/design-system.md` and `src/globals.css`. The mockup of record is `pipeline/store-submission-prep/design.html`.

## Screens / Views

### Chrome promo tile (440×280)
- Light canvas with a soft radial green tint from the top-right corner (`#f0faf4` to `#ffffff`), 1px `--sr-border`, 12px corners.
- Top-left: the 60px rounded green icon tile (the raven mark) with a soft green shadow, beside the wordmark "SnowRaven Mini" set in Inter 800, ~1.7rem, letter-spacing -0.02em.
- Lower-left: tagline "Weather and tide for your eBird checklist, in one click." in `#3f5247`, 600.
- Lower-right: a small real weather-output card peeking in, rotated about -3 degrees, with a soft shadow and a "WEATHER" eyebrow, to show the function. The peek uses a short clean excerpt (emoji, condition, temperature, wind), not the full block.
- Key decision: the green lives in the icon and the output peek, not a flat green background, so the tile reads as the product rather than a logo.

### Screenshot template (1280×800)
- Canvas: a diagonal green-tinted gradient (`#f0faf4` to `#ffffff` to `#eef7f1`), with a faint (5% opacity) oversized raven watermark in the top-right.
- Left column (caption): a small accent-tint pill kicker with the icon and "SnowRaven Mini"; a headline in Inter 800, ~3.25rem, letter-spacing -0.03em; one supporting line in `#3f5247`, ~1.4rem.
- Right: the real popup at 1:1, rounded 16px, with a soft layered drop shadow and a 1px border.
- The popup is rendered with the actual component classes from `globals.css`, so what ships is the genuine UI, not a redrawn approximation.

### The five screenshots
1. **Result (hero)** — weather block with the green "Copied to clipboard" banner, divider, then tide block. Caption: "Weather and tide, already on your clipboard." Sub: "One click on your eBird checklist. The weather block copies itself, the tide sits right below, both in SnowRaven's exact format." Light and dark.
2. **Options page** — the two key fields, "Get a free key" links, Save keys button, the local-storage privacy line. Caption: "Your keys stay on your device." Sub: "Two free keys, stored locally, sent only to eBird and OpenWeather." Light and dark.
3. **Permission grant** — the shield prompt with the three hosts and the Grant access button. Caption: "Asks only for what it needs." Sub: "Reaches three bird and weather APIs, nothing else, only when you say so." Light.
4. **Tide notice** — weather shown, tide replaced by the calm amber too-far/outside-US notice with its override. Caption: "Honest about tide." Sub: "When the nearest NOAA station is far or inland, it says so, with an override." Light.
5. **Checklist-view state** — the "you're on the checklist page" message with the Show weather anyway button and Edit Comments link. Caption: "On the checklist page? One tap to the right spot." Sub: "Offers the Edit Comments page, or shows the weather right there." Light.

## Component Usage
No component library (consistent with the system). Plain semantic HTML and the hand-authored `--sr-*` classes already in `globals.css` (`sr-popup`, `sr-pop-head`, `sr-brand`, `sr-mark`, `sr-eyebrow-row`, `sr-mono`, `sr-btn-copy`, `sr-copied-banner`, `sr-divider`, `sr-footer`, plus the permission, notice, and options classes). The raven mark is the existing `brand/icon.svg` artwork.

## Design Tokens Applied
- Primary green `#2D8653`; accent tint `#e8f5ee` / `#1a5c38`; secondary `#f0faf4`.
- Surfaces `#ffffff`; text `#0f1117`; muted text `#6b6b73`; borders `#e4e4e7`; mono surface `#fafafa`.
- Warning tokens for the tide notice (`#92400e` / `#fffbeb` / `#fde68a`).
- Type: Inter for UI and captions; the mono stack for output blocks. Caption headline is the one place type runs large (~3.25rem) for the listing's display role.

## Interaction Notes
These deliverables are static images (PNG), so there is no runtime interaction to implement. The screenshots must be captured from the genuine running popup states (not redrawn), then composed on the template and exported at the exact pixel dimensions (440×280 for the tile, 1280×800 for each screenshot).

## Content Notes
All caption copy is plain, warm, and active, with no em dashes and without the phrase "byte for byte." The output shown in screenshots is the real SnowRaven-format weather and tide text, including the attribution line exactly as it appears on screen. Realistic sample: a coastal checklist (The Battery, New York) so both weather and an Observed tide are populated.
