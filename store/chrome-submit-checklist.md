# Chrome Web Store: Submit Checklist

- Package to upload: `artifacts/snowraven-mini-chrome-1.4.0.zip`
- Copy from: `store/listing-copy.md` and `store/permissions-and-privacy.md`
- Images from: `store/assets/`

## One-time account setup
1. Sign in with a dedicated Google account you will keep for publishing. The account email cannot be changed later, and all review and policy emails go there.
2. Open the Developer Dashboard: <https://chrome.google.com/webstore/devconsole>
3. Register as a developer and pay the one-time $5 USD fee.
4. In the Account tab, verify a contact email (required to publish publicly) and set your publisher display name.

## The item
5. Click "New item" and upload `artifacts/snowraven-mini-chrome-1.4.0.zip`.

## Store listing tab
6. Name: **SnowRaven Mini**
7. Summary: paste the Chrome summary from `listing-copy.md` (within the 132-character limit).
8. Description: paste the detailed description from `listing-copy.md`.
9. Category: **Productivity**. Language: **English**.
10. Store icon: upload `store/assets/store-icon-128.png` (128x128). If the dashboard objects to transparency, flatten it onto a solid background and re-upload.
11. Screenshots (1280x800), upload from `store/assets/` in this order:
    - `screenshot-1-result-light.png` (weather + tide + the "copy both together" button)
    - `screenshot-6-setup-light.png` (the first-run key walkthrough)
    - `screenshot-2-options-light.png`
    - `screenshot-3-permission-light.png`
    - `screenshot-4-tide-notice-light.png`
    (Chrome allows up to 5. Also available to swap in: `screenshot-5-checklist-view-light.png` and the dark variants `screenshot-1-result-dark.png`, `screenshot-6-setup-dark.png`, `screenshot-2-options-dark.png`.)
12. Small promo tile (440x280, required): upload `store/assets/promo-tile-440x280.png`.
13. Marquee promo tile (1400x560): skip (optional, featured-placement only).

## Privacy practices tab
14. Single purpose: paste from `permissions-and-privacy.md`.
15. Permission justifications: paste the activeTab, storage, and clipboardWrite justifications, and the three host justifications, from `permissions-and-privacy.md`.
16. Remote code: select **No, I am not using remote code**.
17. Data usage: disclose no data collection, then check all three certification boxes (see `permissions-and-privacy.md`).
18. Privacy policy URL: `https://github.com/dtgibson/snowraven-mini/blob/main/PRIVACY_POLICY.md`

## Distribution and submit
19. Visibility: **Public**. Regions: all.
20. Submit for review. Reviews usually take a few days; a new account or item may take longer.

## After it is approved
21. Update the Installing section of `docs/HELP.md` and the README to point at the Chrome Web Store listing.
