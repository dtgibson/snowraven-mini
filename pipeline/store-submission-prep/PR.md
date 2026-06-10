## Store Submission Prep (v1.0.0)

### What this does
Prepares SnowRaven Mini for public listing on the Chrome Web Store and Firefox Add-ons. Produces the listing copy, image assets, permission justifications, privacy disclosures, and per-store submit checklists, plus the v1.0.0 build, both store zips, and the Firefox source archive with build instructions. No extension behavior changes. The only code change is the AMO-required `data_collection_permissions` manifest key and the version bump to 1.0.0.

### How to test
- Open the screenshots and promo tile in `store/assets/` and confirm they look right.
- Skim `store/listing-copy.md`, `store/permissions-and-privacy.md`, and the two submit checklists.
- Build and test: `npm run build` (clean), `npm test` (65 passing), `npm run pack`.
- Confirm `dist/manifest.json` shows version `1.0.0` and `browser_specific_settings.gecko.data_collection_permissions`.

### Notes for reviewer
- One build serves both stores; Chrome ignores the `gecko` block, Firefox reads it.
- Assets are generated reproducibly with `npm run store:assets` (headless Chromium screenshots of the real component CSS, flattened with sharp so there is no alpha). Inter is embedded; emoji and monospace come from system fonts.
- Edge is intentionally out of scope: Edge installs the Chrome listing only via a per-user opt-in, so reaching Edge users by default would be a separate submission.
- README and `docs/HELP.md` version strings reconciled from v0.1.0 to v1.0.0.
- Creating the developer accounts, paying the one-time $5 Chrome fee, and clicking submit remain manual maintainer steps (see the checklists).
