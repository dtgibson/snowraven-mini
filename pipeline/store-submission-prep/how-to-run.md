## Seeing the store submission package

There is nothing to run in a browser for this one. The deliverables are files in the repo.

1. Open the image assets in `store/assets/` in any image viewer:
   - `promo-tile-440x280.png` (the Chrome promo tile)
   - `screenshot-1-result-light.png` through `screenshot-5-checklist-view-light.png`
   - `screenshot-1-result-dark.png` and `screenshot-2-options-dark.png` (dark variants)
   - `store-icon-128.png` (the listing icon)
2. Read the listing text:
   - `store/listing-copy.md` (name, summary, description for both stores)
   - `store/permissions-and-privacy.md` (permission justifications and privacy disclosures)
3. Read the step-by-step submit guides:
   - `store/chrome-submit-checklist.md`
   - `store/firefox-submit-checklist.md`
4. Regenerate the images any time:
   - `npm run store:assets`
5. Rebuild and repackage:
   - `npm run build && npm run pack` produces `artifacts/snowraven-mini-{chrome,firefox}-1.0.0.zip`
   - the Firefox source archive is `artifacts/snowraven-mini-source-1.0.0.zip` (build steps in `BUILD.md`)

When you are ready to publish, follow the two checklists. That part is yours: it needs your developer accounts and the one-time $5 Chrome fee.
