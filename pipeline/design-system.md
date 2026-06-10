# Design System — SnowRaven Mini

The canonical design system for SnowRaven Mini. Every feature inherits this. It deliberately mirrors the SnowRaven desktop app (`/home/parallels/snowraven/brand.md`, `frontend/src/components/WeatherTidePanel.tsx`, `frontend/src/globals.css`) so the extension reads as a smaller sibling of the app, not a stranger.

## Feel

Quiet utility — calm, purposeful, uncluttered; a tool that gets out of the user's way. Green is grounded and natural, never corporate, and used with restraint: a filled green control marks the single primary action on a surface and nothing else.

## Tokens

**Light (default — from SnowRaven `brand.md`, with a few values darkened for WCAG 2.1 AA):**

| Token | Value | Use |
|---|---|---|
| `--primary` | `#2D8653` | The one filled primary action per surface |
| `--primary-hover` | `#266F45` | Primary hover |
| `--primary-fg` | `#FFFFFF` | Text on primary |
| `--bg` / `--fg` | `#FFFFFF` / `#0F1117` | Surface / primary text |
| `--muted` / `--muted-fg` | `#F4F4F5` / `#6B6B73` | Muted fill / secondary text (AA on muted) |
| `--accent` / `--accent-fg` | `#E8F5EE` / `#1A5C38` | Green tint for secondary actions / its text |
| `--secondary` | `#F0FAF4` | Secondary green surface |
| `--border` | `#E4E4E7` | Card/structural borders |
| `--input-border` | `#9A9AA3` | Input boundary (≥3:1, SC 1.4.11) |
| `--ring` | `#2D8653` | Focus ring |
| `--destructive` / `--destructive-bg` | `#B91C1C` / `#FEF2F2` | Error text / alert fill (AA) |
| `--warning-fg/bg/bd` | `#92400E` / `#FFFBEB` / `#FDE68A` | Tide "too-far"/"outside-US" notice |
| `--mono-bg` | `#FAFAFA` | Output-block surface |
| `--radius` | `0.5rem` | Standard radius (popup shell 10px, options 12px) |

**Dark (re-derived from the app's `globals.css [data-theme="dark"]` — neutral zinc + emerald, delivered via `prefers-color-scheme: dark`):**

| Token | Value |
|---|---|
| `--bg` / `--fg` | `#18181B` / `#F4F4F5` |
| `--muted` / `--muted-fg` | `#27272A` / `#A1A1AA` |
| `--accent` / `--accent-fg` | `#052E16` / `#34D399` |
| `--primary` / `--primary-fg` | `#34D399` / `#052E16` |
| `--border` | `#27272A` |
| `--ring` | `#34D399` |
| `--destructive` | `#F87171` |
| `--mono-bg` | `#1C1C1F` |

AA (≥4.5:1 text, ≥3:1 functional UI) holds in both themes.

## Typography

Inter, system-ui, sans-serif. Three roles with real contrast:
- **Display/header** — Inter 700, ~1.75rem, letter-spacing −0.02em.
- **Body** — Inter, 16px / 1.5.
- **Monospace output** — `ui-monospace, "Cascadia Code", "Fira Code", Consolas, monospace`, 0.8125rem / 1.7.
- Plus an uppercase ~0.6875rem **eyebrow** micro-label tying surfaces together.

## Patterns

- **Output block:** bordered card, `--mono-bg` surface, monospace, `white-space: pre-wrap`, padding ~14px 16px — mirrors the app's `WeatherTidePanel` `MonoBlock`. Used for the weather block and the tide block.
- **Primary action:** filled `--primary` button — exactly one per surface (Grant access; Save keys).
- **Secondary actions** (Copy, "show it anyway" override, "Go to Settings →"): accent-tint or link styling, never filled green.
- **Tide notice** (too-far / outside-US): a single space-between row, warning tokens, icon + text + override button.
- **Error:** alert card on `--destructive-bg`, icon + text, with a Settings link where relevant.
- **Focus:** `:focus-visible` → 2px solid `--ring` + 2px offset on every control; inputs add a soft ring glow as enhancement only.
- **Motion:** `prefers-reduced-motion` freezes the loading spinner and disables transitions.
- **Live regions:** results via `role="status"`, errors via `role="alert"`; copy confirmations and the auto-copy notice announced through a polite `aria-live` region populated at the moment of the action.

## Components / Toolkit

No component library (no shadcn, no Tailwind build, no Lucide) — a deliberate, logged decision driven by the no-bloat constraint (PRD NFR-04 / FR-50). The system is plain semantic HTML + hand-authored CSS on these tokens, with small inline SVG icons. Future features stay within this.

## References

SnowRaven `brand.md` (anchor: dtgibson.com — clean, content-first, restrained color), `WeatherTidePanel.tsx` (the monospace output block + per-block copy), `globals.css` dark theme.

## Rationale

Parity with the desktop app is the product's whole premise, so the system copies the app's tokens and patterns rather than inventing. Several raw brand values were darkened (muted-fg, destructive, input-border) to clear AA on their actual backgrounds. The no-component-library choice keeps the bundle tiny; consistency is therefore enforced by this document and the shared `globals.css`, not by a library.
