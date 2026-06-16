# Design Spec — Onboarding & Combined Copy

Designed inside SnowRaven Mini's established design system
(`pipeline/design-system.md`). No component library; all styling is
hand-authored CSS on the `--sr-*` tokens with inline SVG icons. The two
additions extend the existing popup, they do not restyle it. Deliberate
deviations are logged in `pipeline/onboarding-combined-copy/decisions.md`.

Mockup: `pipeline/onboarding-combined-copy/design.html` (light + dark, both
walkthrough variants, and the combined button in its resting and "Copied!"
states).

## Visual Direction

Quiet utility, unchanged. The walkthrough turns today's one-line missing-keys
notice into a calm, one-glance setup card that names both free keys and gives a
clear path out. The combined button is a deliberate, secondary convenience that
sits below the two blocks without stealing attention from the per-block Copy
buttons or the weather auto-copy. Nothing competes with the system's one rule:
filled green marks a single primary action, and neither addition is one.

## Screens / Views

### First-run walkthrough — both keys needed

Replaces the `missing-keys` render branch only (Popup.tsx:315-355). It reuses the
`sr-notice-neutral` card as its shell, then lays out:

- A header row: the key glyph, a short title ("Two free keys and you're set"),
  and a lead line stating that adding both keys once makes weather a single
  click. The lead names both keys in the body copy.
- A per-key checklist (`sr-keylist`): one row per key, each with a state chip
  (key glyph in a muted chip for "Needed"), the key name (`eBird API key` /
  `OpenWeather API key`), a "Needed" sub-label, and a "Get a free key →" link on
  the right opening that provider's key page in a new tab.
- A foot row: "Both are free to get." on the left, and the existing
  "Go to Settings →" link-action on the right (reuses `openOptions()`).

Key design decisions:
- Per-key rows make the set/needed status legible at a glance and give each key
  its own get-a-key link (FR-02/03/04/06).
- "Get a free key" links are real `<a target="_blank" rel="noreferrer">` —
  navigation only, no permission request (NFR-04).
- The card is the neutral notice surface, so AA contrast holds in both themes
  with no new color.

### First-run walkthrough — one key needed (e.g. eBird already set)

Same card, but the already-set key's row switches to the "set" treatment: an
accent-tinted chip with a check glyph, a "Set" sub-label in accent-fg, and its
get-a-key link hidden (not just removed, so the row heights stay aligned). The
title and lead change to "One free key to go" and name only the missing key. The
foot line narrows to "The OpenWeather key is free to get." This preserves the
existing three-way logic (both-missing / eBird-only / OW-only) and never tells a
half-configured user to re-enter a key they already have (FR-06). The mirror case
(OpenWeather set, eBird needed) swaps which row is "set".

### Result view with the combined button

The existing weather + tide result, unchanged, plus one new control. Below the
Tide `</section>`, a full-width secondary button labeled exactly
`Copy weather & tide together`, with a copy glyph. It renders only when weather
is `success` and tide is `ok` (FR-10/11). On click it flips to a "Copied!" state
(check glyph, accent-fg fill) for ~2000ms, the same affordance the per-block Copy
buttons use (FR-18).

Key design decisions:
- Secondary, not primary green — see decisions.md D-01. Filled green stays
  reserved for the one primary action per surface; this is additive.
- Distinct from the two compact per-block Copy buttons by being full-width with a
  structural border, so it reads as the wider "grab both" option rather than a
  stretched Copy button (D-01/D-03).
- The existing weather "Copied to clipboard" auto-copy banner is untouched
  (FR-17), and both per-block Copy buttons stay exactly as they are (FR-12).

## Component Usage

No component library. Existing classes reused verbatim: `sr-popup`,
`sr-pop-head`, `sr-brand`/`sr-mark`, `sr-pop-context`, `sr-pop-body`,
`sr-notice` + `sr-notice-neutral`, `sr-strong`, `sr-eyebrow` + `sr-eyebrow-row`,
`sr-mono`, `sr-btn-copy` (+ `is-copied`), `sr-copied-banner`, `sr-divider`,
`sr-link-action`, `sr-getkey` (the Options page get-a-key link style),
`sr-footer`. Icons are the existing inline SVGs (`RavenMark`, `KeyIcon`,
`CheckIcon`, `CopyIcon`, `ArrowRightIcon`).

New additive classes (logged in decisions.md D-02):
- `sr-btn-combined` (+ `is-copied`) — the full-width secondary combined button.
- `sr-walk`, `sr-walk-head`, `sr-walk-title`, `sr-walk-lead`, `sr-keylist`,
  `sr-keyrow` (+ `is-needed` / `is-set`), `sr-keymark`, `sr-keytext`,
  `sr-keyname`, `sr-keystate`, `sr-walk-foot`, `sr-free` — the walkthrough's
  per-key checklist layout.

The Engineer may inline these or add them to `globals.css`; either way every
value resolves to an existing token. The full CSS is in the mockup's `<style>`
under the "NEW (this feature)" banner.

## Design Tokens Applied

- Combined button: `--sr-accent` fill / `--sr-accent-fg` text at rest, border
  `--sr-border` → `--sr-accent-fg` on hover, `is-copied` flips to `--sr-accent-fg`
  fill with `--sr-bg` text. Radius `--sr-radius`.
- Walkthrough card: `--sr-muted` fill, `--sr-border`, `--sr-fg` text (the
  `sr-notice-neutral` surface). Key rows sit on `--sr-bg` with `--sr-border`.
  "Needed" chip `--sr-muted` / `--sr-muted-fg`; "Set" chip `--sr-accent` /
  `--sr-accent-fg`. Get-a-key links `--sr-primary` → `--sr-primary-hover`.
- Focus: the global `:focus-visible` 2px `--sr-ring` + 2px offset applies to the
  new button and every link unchanged.
- Type roles: existing `sr-eyebrow` micro-label, body, and the monospace output
  block. The walkthrough adds a 600-weight title and a `--sr-muted-fg` lead,
  reusing the body scale.

## Interaction Notes

- Combined button: local `copied` state, `setTimeout(... , 2000)` revert, same
  shape as `BlockEyebrow`. On a successful copy, announce
  "Weather and tide copied to clipboard." through the shared polite live region.
  On `copyText` returning false, show no success state and announce nothing
  (FR-18/19). Manual only — no auto-fire (FR-16).
- Walkthrough get-a-key links and "Go to Settings" are keyboard-reachable with
  visible focus. The already-set key's hidden get-a-key link is removed from the
  tab order (`tabindex="-1"`, `aria-hidden`) so it isn't a focus trap.
- The existing `announce(...)` for the missing-keys state stays; ensure the
  spoken text still names the missing key(s) and points to Settings (NFR-02).
- Reduced motion: the "Copied!" flip rides the global transition-disable rule;
  no bespoke animation (NFR-07).

## Content Notes

Warm and direct, no corporate voice, no em dashes. Both-keys title:
"Two free keys and you're set"; lead: "Add your eBird and OpenWeather keys once.
After that, opening a checklist copies its weather in a single click."
One-key title: "One free key to go"; lead names only the missing key and notes
the set one. Per-key rows: key name + "Needed" / "Set". Foot: "Both are free to
get." (both-missing) or "The [missing] key is free to get." (one-missing). The
get-a-key link text is "Get a free key". The combined button label is exactly
`Copy weather & tide together` (FR-13) — not editorialized.
