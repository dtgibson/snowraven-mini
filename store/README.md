# Store Submission Package: SnowRaven Mini v1.1.0

Everything needed to publish SnowRaven Mini on the Chrome Web Store and Firefox Add-ons. This package stops at the point of submission. Creating the developer accounts, paying the Chrome fee, and clicking submit are your steps, walked through in the checklists below.

## What's here
- `listing-copy.md`: the name, summary, and description for both stores.
- `permissions-and-privacy.md`: the single-purpose statement, per-permission and per-host justifications, the Chrome data-usage answers, and the Firefox data-collection declaration.
- `chrome-submit-checklist.md`: step by step for the Chrome Web Store.
- `firefox-submit-checklist.md`: step by step for Firefox Add-ons (AMO).
- `assets/`: the images: the 440x280 promo tile, the 128x128 store icon, and the screenshots (1280x800, with light and dark variants for the result and Options shots).
- `assets/render/`: the source HTML and embedded fonts used to generate the images. Regenerate any time with `npm run store:assets`.

## The packages to upload
- Chrome: `artifacts/snowraven-mini-chrome-1.1.0.zip`
- Firefox: `artifacts/snowraven-mini-firefox-1.1.0.zip`
- Firefox source (required by AMO): `artifacts/snowraven-mini-source-1.1.0.zip` (build steps in `/BUILD.md`)

## Key facts
- Both stores ship v1.1.0 from one build. Chrome ignores the manifest `gecko` block; Firefox reads it.
- Both listings are public.
- Privacy policy URL: <https://github.com/dtgibson/snowraven-mini/blob/main/PRIVACY_POLICY.md>
- Edge is not covered here. Edge can install from the Chrome listing only if a user turns on "Allow extensions from other stores"; reaching Edge users by default would be a separate Microsoft Edge Add-ons submission.

## After a listing goes live
Update the "Installing" section of `docs/HELP.md` and the README to point people at the store listing instead of the unpacked-zip instructions.
