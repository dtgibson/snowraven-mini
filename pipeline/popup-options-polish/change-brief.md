# Change Brief — popup-options-polish

## What is changing
Three visual and navigational refinements modeled on SnowRaven: (1) a footer at the bottom of the popup and the Options page with a "SnowRaven Mini" link to the GitHub repo and a "Help" link to `docs/HELP.md`; (2) the in-app header mark (popup and Options) updated to the SnowRaven raven so it matches the toolbar icon; (3) a light divider between the weather and tide sections in the popup so the "Copied to clipboard" confirmation clearly applies to weather only.

## Why now
Consistency with the SnowRaven desktop app, which has the same footer. The in-app header mark no longer matches the new toolbar icon (the SnowRaven raven). And the copied-confirmation line can read as applying to tide.

## User-facing impact
Minor and additive: a footer with two links, a corrected header mark, and a divider line. No change to the lookup, the data flow, permissions, or the copied weather/tide output.

## Decisions touched
None.

## What done looks like
- The footer with the GitHub and Help links shows on both the popup and the Options page, styled like SnowRaven's.
- The popup and Options header mark matches the toolbar raven icon.
- A light divider sits between the weather and tide blocks; build and the 65 tests stay green; loads in Chrome and Firefox.
