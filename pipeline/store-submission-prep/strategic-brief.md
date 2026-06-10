# Strategic Brief — Store Submission Prep

## What We're Building
Getting SnowRaven Mini listed on the Chrome Web Store and Firefox Add-ons so people can install it with a single "Add to Chrome" or "Add to Firefox" click instead of sideloading a zip. This covers everything up to the moment of submission: the listing copy, screenshots and promo images, permission justifications, privacy disclosures, and a per-store submit checklist.

## Why Now
The extension is built, tested, and already published as a GitHub release with working Chrome and Firefox zips (v0.1.1). The only thing between it and easy installs is store paperwork. SnowRaven's existing users are a ready-made audience, and reaching them today means walking each person through developer-mode sideloading, which is friction most won't push through.

## The User Problem
A birder who already uses SnowRaven wants the same one-click weather on the eBird page, but installing an unpacked extension means turning on developer mode and loading a folder. It's fiddly and feels unsafe to non-technical users. A normal store listing turns that into a single click they already trust, and it gives birders who stumble onto it a way to find and install it on their own.

## Success Criteria
- A complete, accurate listing is prepared for both stores: name, summary, full description, category, screenshots, and any required promotional images.
- Every requested permission has a plain, honest justification ready to paste into each store's review form.
- The privacy disclosure for each store accurately reflects that keys are stored locally, sent only to their own API hosts, with no telemetry and no servers.
- A step-by-step submit checklist exists for each store, so the actual upload is mechanical.
- Both listings are public, discoverable in store search.

## Scope
- Chrome Web Store listing package: listing copy, screenshots, promo tile, permission justifications, data-use disclosure, submit checklist.
- Firefox Add-ons (AMO) listing package: listing copy, screenshots, permission justifications, privacy disclosure, submit checklist, plus confirming AMO's source-code and reviewer-notes requirements.
- Confirming the existing v0.1.1 zips meet each store's manifest and review requirements.
- Public listing on both stores.

## Out of Scope
- Creating the developer accounts, paying the fee, and clicking submit. Those are the user's external actions, walked through at the Deployer step.
- A separate Microsoft Edge Add-ons submission. Edge installs the Chrome listing directly; revisit only if there's demand.
- Any code or feature change to the extension. If a store rejects on a manifest technicality, that becomes its own fix, not part of this prep.
- Paid promotion, a marketing page, or a product website.

## Key Decisions
- Public listing on both stores, so existing users get easy installs and new birders can discover it.
- Chrome Web Store and Firefox Add-ons only for v1; Edge rides on the Chrome listing.
- Reuse the existing v0.1.1 build rather than cutting a new version, unless a store requirement forces a manifest change.
- Developer account setup and the one-time $5 Chrome fee are the user's to handle at submit time.
