# Firefox Add-ons (AMO): Submit Checklist

> **Status: v1.1.0 live; v1.2.0 update pending** — v1.1.0 is published at <https://addons.mozilla.org/firefox/addon/snowraven-mini/>. The v1.2.0 package (zip + source archive) is prepared under `store/` and ready to submit — follow the steps below to push the v1.2.0 update.

- Package to upload: `artifacts/snowraven-mini-firefox-1.2.0.zip`
- Source archive (required by AMO): `artifacts/snowraven-mini-source-1.2.0.zip` (build steps in `/BUILD.md`)
- Copy from: `store/listing-copy.md` and `store/permissions-and-privacy.md`
- Images from: `store/assets/`

## One-time account setup
1. Create or sign in to a Mozilla account.
2. Enable two-factor authentication. It is mandatory for extension developers. Save the recovery codes somewhere safe.
3. Set your developer display name (shown publicly on the listing).

## Submit the add-on
4. Go to <https://addons.mozilla.org/developers> and choose "Submit a New Add-on".
5. Choose "On this site" (a listed, public add-on).
6. Upload `artifacts/snowraven-mini-firefox-1.2.0.zip`. Automated validation runs on upload.
7. When asked about minified or bundled code, upload the source: `artifacts/snowraven-mini-source-1.2.0.zip`. Point the reviewer to `BUILD.md`: `npm ci` then `npm run build` reproduces `dist/`.

## Listing
8. Name: **SnowRaven Mini**
9. Summary: paste the AMO summary from `listing-copy.md` (within the 250-character limit).
10. Description: paste the detailed description from `listing-copy.md`.
11. Categories: up to 2. "Other" is the closest fit; add a second only if one genuinely applies.
12. Tags: optional, from Mozilla's predefined list (try birding, weather, tide, ebird if offered).
13. Support email and/or website: `developer@dtgibson.com` and the GitHub issues page.
14. Homepage: `https://github.com/dtgibson/snowraven-mini`
15. License: **AGPL-3.0**.
16. Privacy policy: `https://github.com/dtgibson/snowraven-mini/blob/main/PRIVACY_POLICY.md`
17. Screenshots: upload the five light shots from `store/assets/` (dark variants optional).

## Data collection and reviewer notes
18. The manifest already declares `data_collection_permissions: { required: ["none"] }`, so AMO reads "collects no data" from the package. Confirm any data-collection prompt reflects that.
19. Paste the reviewer notes from `permissions-and-privacy.md` into "Notes to reviewer".

## Submit
20. Submit. Listed add-ons are validated and usually signed quickly; a manual review may follow for the bundled-source check.

## After it is approved
21. Update the Installing section of `docs/HELP.md` and the README to point at the Firefox Add-ons listing.
