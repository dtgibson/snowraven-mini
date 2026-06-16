# Design decisions — Onboarding & Combined Copy

Working inside the established design system (`pipeline/design-system.md`). No
component library, no shadcn/Tailwind/Lucide. Every choice below stays on the
existing `--sr-*` tokens and hand-authored SVG icon style. Two deliberate
additions are logged here.

## D-01 — Combined button is secondary (accent-tint), not primary green

**Decision:** the "Copy weather & tide together" button uses the accent-tinted
secondary treatment, full-width, below the Tide slot — not the filled `--primary`
green.

**Why:** the design system reserves filled green for exactly one primary action
per surface ("a filled green control marks the single primary action on a
surface and nothing else"). On the result view there is no primary green at all
today — the two per-block Copy buttons are accent-tinted, and the weather block
already auto-copied on open. The combined copy is an additive convenience, not
the main act, so making it filled green would (a) break the one-primary rule and
(b) over-sell a secondary path over the per-block buttons. Secondary keeps the
hierarchy honest: weather auto-copies, the per-block buttons are compact
conveniences, and the combined button is the wider "grab both" option, visually
related to the Copy buttons (same accent family) but distinct by being
full-width and a touch heavier.

**Distinct from the per-block buttons:** full-bleed width vs. the compact inline
Copy buttons, plus a `1.5px` border in `--sr-border` so it reads as its own
control rather than a stretched Copy button. Its "Copied!" confirmation reuses
the exact `is-copied` flip pattern (accent-fg fill) from `sr-btn-copy`, so the
success affordance is consistent across all three copy controls.

## D-02 — New CSS: `sr-btn-combined` and the walkthrough classes

**Decision:** add a small amount of additive structural CSS rather than reuse an
existing class verbatim:
- `sr-btn-combined` — full-width secondary button (above).
- `sr-walk`, `sr-keylist`, `sr-keyrow`, `sr-keymark`, `sr-keytext`, `sr-walk-foot`
  — the walkthrough's per-key checklist rows.

**Why:** the Architect's schema flagged "New structural CSS, if any, is the
Designer's call." The walkthrough's value is the per-key rows — each key named,
its set/needed state shown, and a "get a free key" link on its own row. The
existing `sr-notice-neutral` card is reused as the shell (so AA contrast and the
neutral notice look are inherited), and `sr-getkey` is the exact link style from
the Options page, so the new classes only add layout, not new color. No new
tokens, no new colors — every value resolves to an existing `--sr-*` var, so AA
holds in both themes for free.

**Alternative considered and rejected:** keeping the current single-paragraph
`missing-keys` notice and just appending two links. Rejected because FR-02/04/06
want both keys named with per-key get-a-key links and a clear set/needed state,
which the per-key rows communicate at a glance far better than inline links in a
sentence.

## D-03 — `sr-btn-combined` border uses `--sr-border`, not accent-fg

**Decision:** the resting combined button border is `--sr-border` (the structural
border token), going to `--sr-accent-fg` only on hover — same hover escalation as
`sr-btn-copy`/`sr-btn-ghost`.

**Why:** a resting accent-fg border would make the button compete with a primary
action for attention. The neutral structural border at rest keeps it calm and
secondary, consistent with the "quiet utility" feel, and the hover state still
gives the accent-green affordance the other secondary buttons use.
