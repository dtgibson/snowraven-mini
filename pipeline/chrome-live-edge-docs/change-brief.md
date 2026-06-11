# Change Brief — Chrome listing live + Edge install docs

**Lane:** Improve · **Stage 1 (The Evaluator)** · 2026-06-11

## What prompts this

SnowRaven Mini v1.1.0 is now published and live on the Chrome Web Store
(<https://chromewebstore.google.com/detail/snowraven-mini/dfbphfbhbehdlfepoigechmjbifpndhc>).
Firefox Add-ons is still pending. The website and docs were written for the
pre-launch state ("coming soon to both stores; install from the GitHub release"),
so they now understate what's available. Separately, because the Chrome listing is
live, Microsoft Edge users can install it from the Chrome Web Store, and we want
that path documented.

## Feature-check verdict — stays in the Improve lane

This is marketing-site and documentation copy reflecting a launch that already
happened, plus install instructions for an existing distribution path. No change to
the extension, no new surface, permission, or product capability. Pure Improve. This
is also the explicitly planned follow-up: `store/README.md` and the Chrome submit
checklist both say to update `docs/HELP.md` and the README once a listing goes live,
and `DECISIONS.md` flagged swapping the website's "coming soon" buttons for live
links.

## The two asks

1. **Website reflects Chrome live, Firefox coming soon.** Turn the disabled "Coming
   soon to Chrome Web Store" button into a live link to the listing; leave Firefox as
   "coming soon"; update the surrounding copy and the social-share description so they
   no longer say both stores are pending.
2. **Document Edge install.** Edge is Chromium-based and can install from the Chrome
   Web Store once the user enables "Allow extensions from other stores" (an
   off-by-default Edge setting). Add a clear step-by-step for that path.

## Files to change

**Website (`website/index.html`, `website/styles.css`):**
- The install section (`#install`): make the Chrome `store-btn` an `<a>` linking to
  the listing, relabel it "Available on / Chrome Web Store," and swap the "Soon" pill
  for an "Install" call-to-action. Firefox button stays disabled/"coming soon."
- Update the section sub-copy (line ~235) and the install-from-release card copy
  (no longer "until it is in the stores," since Chrome is) — the release/unpacked path
  stays for Firefox and manual installs and now also covers Edge.
- Update the `og:description` (line ~13) that says "Coming soon to the Chrome Web Store
  and Firefox Add-ons."
- Add a small Edge pointer near the store row linking to the install guide.
- A few lines of CSS for the live (anchor) button: full opacity, hover lift, and the
  "Install" pill.

**Docs:**
- `docs/HELP.md` — rewrite the "Installing" intro (no longer "not yet on the stores");
  add a "From the Chrome Web Store (recommended)" method; add an **"Install on
  Microsoft Edge"** subsection (open the listing in Edge → allow extensions from other
  stores → Add → pin). Update the development-section footer line that says "not yet
  submitted to the Chrome Web Store."
- `README.md` — update the Install section: Chrome live (link), Firefox coming soon,
  release/unpacked alternative, and a one-line Edge note.

**Context docs:**
- `PRODUCT_CONTEXT.md` — Distribution + Deferred: Chrome live, Firefox pending.
- `ROADMAP.md` — reflect the Chrome launch (no longer "coming soon" for Chrome).
- `DECISIONS.md` — short entry: Chrome listing live; Edge supported via the Chrome
  Web Store opt-in (no separate Edge listing).

## Out of scope

No extension code changes, no version bump (v1.1.0 is the live build), no new store
assets. The Firefox button and Firefox copy stay "coming soon" until AMO publishes.

## How we'll verify (Stage 3, The Tester)

The site has no build step, so verification is: the Chrome link resolves to the
listing, the markup/CSS is well-formed (open the page, check the button renders as a
live link with hover and the Firefox one stays disabled), the Edge steps are accurate
and complete, and no stale "coming soon to the Chrome Web Store" / "not yet on the
stores" text remains. `npm test` and `npm run build` should stay green (untouched by
doc/site edits, but confirmed).

## Scope addendum — website icon fixes (2026-06-11)

During review the user flagged that several website icons render broken or
unrecognizable. Audited every inline SVG: they are hand-authored Lucide-style line
glyphs (the logo itself is the Lucide "bird" on the green tile = `brand/icon.svg`), and
several had been truncated or mangled when typed into the HTML. Fixed in this same change:

- The bird was reduced to a single body path (no eye, beak, legs, or wing) in the four
  feature/options mock popups — restored to the full six-path bird. Site-wide: 7 complete
  birds, 0 partial.
- The "One-click weather" cloud icon was an unclosed path — replaced with a complete
  Lucide cloud-rain.
- The "Your keys, your device" key was malformed — replaced with the correct Lucide key.
- The two store-button glyphs were unrecognizable scribbles — replaced with the official
  Chrome and Firefox monochrome logos (Simple Icons), Chrome in accent green (live),
  Firefox muted (coming soon).

## Risks

Low. Copy and one anchor/CSS change. The only correctness-sensitive piece is the Edge
instructions matching Edge's current "Allow extensions from other stores" flow.
