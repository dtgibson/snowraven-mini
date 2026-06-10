# PRD — Store Submission Prep
**Feature:** store-submission-prep
**Date:** 2026-06-10
**Stage:** 2 — The Planner
**Source:** strategic-brief.md (approved)

## Feature Overview
Two ready-to-submit listing packages, one for the Chrome Web Store and one for Firefox Add-ons, containing every asset, field value, permission justification, privacy disclosure, and a step-by-step submit checklist needed to publish SnowRaven Mini publicly. The packages stop at the point of submission. Creating the developer accounts, paying the Chrome fee, and clicking submit remain the maintainer's manual steps.

## User Stories
> **US-01** — As the maintainer, I want a complete Chrome Web Store listing package (copy, images, justifications, disclosures, checklist), so that I can fill in the dashboard and submit without researching requirements myself.

> **US-02** — As the maintainer, I want a complete Firefox Add-ons package including the source-code archive and reproducible build instructions, so that the add-on passes review without a source-code rejection.

> **US-03** — As the maintainer, I want every requested permission and host explained in plain language, so that each store's privacy form can be filled in accurately and review is not delayed.

> **US-04** — As the maintainer, I want a hosted privacy policy and accurate data-collection declarations, so that both stores' privacy requirements are met truthfully.

> **US-05** — As an existing SnowRaven user, I want to install SnowRaven Mini from my browser's store in one click, so that I do not have to sideload an unpacked extension.

> **US-06** — As a birder who finds the listing, I want clear screenshots and a plain description, so that I can tell what the extension does before installing.

## Functional Requirements

### Shared listing content
> **FR-01** — The deliverable shall provide one set of listing copy (product name, short summary, full description) drawn from the existing README and docs voice and trimmed to each store's character limits. The copy shall contain no em dashes and shall not use the phrase "byte for byte".

> **FR-02** — The deliverable shall provide the 128x128 store icon (PNG, no transparency, square corners) derived from the existing brand raven mark so it matches the toolbar icon.

> **FR-03** — The deliverable shall provide at least 3 and up to 5 screenshots at 1280x800 px (PNG or JPEG, no alpha, full bleed) captured from the real extension UI, covering: the weather-and-tide result on an Edit Comments page (hero), the Options/keys page, the one-time permission-grant prompt, and at least one secondary state (the tide notice or the checklist-view state). Dark-theme variants shall be available where useful.

### Chrome Web Store package
> **FR-04** — The deliverable shall specify the Chrome listing field values: item name (132 characters or less for the summary, item name 75 characters or less), detailed description, one primary category, and the listing language.

> **FR-05** — The deliverable shall provide the Chrome 440x280 small promotional tile (PNG or JPEG, no alpha) using the brand mark, because current Chrome documentation lists the small promo tile among the required graphic assets. The 1400x560 marquee tile is out of scope (optional, featured-placement only).

> **FR-06** — The deliverable shall provide the Chrome Privacy practices content: a one-sentence single-purpose description; a separate written justification for each manifest permission (activeTab, storage, clipboardWrite); a separate written justification for each optional host (api.ebird.org, api.openweathermap.org, api.tidesandcurrents.noaa.gov); a remote-code answer of "No"; the data-usage selections; and the three Limited Use certifications.

> **FR-07** — The deliverable shall provide a Chrome submit checklist covering developer registration and the one-time $5 fee, uploading the v1.0.0 zip, pasting each field, uploading each image, completing the Privacy practices tab, and submitting.

### Firefox Add-ons (AMO) package
> **FR-08** — The deliverable shall specify the AMO listing field values: add-on name (50 characters or less), slug, summary (250 characters or less), description (AMO Markdown subset), up to 2 categories, up to 10 tags from Mozilla's fixed list, support email and/or URL, homepage, license (AGPL-3.0), and a privacy policy.

> **FR-09** — The deliverable shall specify the `browser_specific_settings.gecko.data_collection_permissions` manifest declaration that AMO now requires for new submissions, including the chosen value (default `required: ["none"]`). This key lives in the gecko block (Chrome ignores it) and is folded into the single v1.0.0 store build.

> **FR-10** — The deliverable shall provide the AMO source-code archive and a build-instructions README that lets a reviewer reproduce the submitted package exactly: build OS and CPU architecture, exact tool versions (Node, npm), the full command sequence (`npm ci` then `npm run build`), and the committed lockfile. The archive shall exclude node_modules and build output.

> **FR-11** — The deliverable shall provide AMO reviewer notes explaining how to exercise the extension without the maintainer's private keys (where to get free eBird and OpenWeather keys, and that NOAA tide is keyless so tide output can be shown without a key), and why each host permission is requested.

> **FR-12** — The deliverable shall provide an AMO submit checklist covering account setup and mandatory 2FA, uploading the package, the source-code upload, listing fields, screenshots, the data-collection declaration, and submission.

### Privacy policy and data disclosures
> **FR-13** — The deliverable shall provide a publicly hosted privacy policy URL (default: the in-repo PRIVACY_POLICY.md at a stable GitHub URL) whose text accurately states that keys are stored in `chrome.storage.local` on the device, each key and request is sent only to its own API host, and there is no backend, telemetry, or server.

> **FR-14** — The deliverable shall ensure the privacy policy, each store's data declarations, and the actual extension behavior are mutually consistent, so neither store flags a contradiction.

### Build and package verification
> **FR-15** — The deliverable shall confirm the submission packages meet each store's manifest and review requirements. Both stores ship from a single rebuilt **v1.0.0** that bumps the version to 1.0.0 and adds the gecko.data_collection_permissions key (Chrome ignores the gecko block; Firefox reads it), keeping the gecko id and strict_min_version 128.0. Future releases resume incrementing from 1.0 (1.1, 1.2, and so on).

> **FR-16** — The deliverable shall reconcile the version references in README and docs (which still read v0.1.0 in places) to v1.0.0 before any listing links to them.

## Non-Functional Requirements
> **NFR-01 — Accuracy:** every disclosure and justification shall truthfully match the code's real data behavior; no aspirational or placeholder claims.

> **NFR-02 — Brand and voice parity:** listing copy shall match the SnowRaven brand and the existing README/docs voice, with no em dashes and without the phrase "byte for byte".

> **NFR-03 — Compliance:** the packages shall meet each store's current (2026) program policies, including Chrome's Limited Use and single-purpose rules and Mozilla's source-code and data-consent rules.

> **NFR-04 — Maintainability:** all listing copy, assets, justifications, and checklists shall be stored in the repo so a future version can reuse and update them.

> **NFR-05 — Accessibility:** screenshots shall reflect the shipped accessible UI (visible focus, AA contrast); listing copy shall be plain and readable.

## Out of Scope
- Creating the developer accounts, paying the Chrome $5 fee, and clicking submit (maintainer's manual steps at the Deployer stage).
- A Microsoft Edge Add-ons submission (see Open Questions: Edge does not reliably install from the Chrome listing, so this is a conscious deferral, not an assumption that Edge is covered).
- Any feature or behavior change to the extension. The only code change in scope is the AMO-required data_collection_permissions manifest key in FR-09.
- The 1400x560 Chrome marquee tile and any promotional video.
- Paid promotion, a marketing site, or a product website.

## Open Questions
1. **Edge reach.** Chrome Web Store extensions install in Edge only when each user enables an off-by-default "Allow extensions from other stores" setting; Microsoft recommends a separate Edge Add-ons listing to reach Edge users by default. *Default if unanswered:* Edge stays out of scope for v1; revisit a dedicated Edge listing if there is demand.
2. **Privacy policy hosting.** *Default:* link to PRIVACY_POLICY.md at a stable GitHub URL. Override if you prefer GitHub Pages or another host.
3. **Firefox data-collection value.** *Default:* declare `required: ["none"]` (user-supplied keys never reach the developer; they go only to each third-party API) and explain the reasoning in reviewer notes. *Alternative:* over-disclose locationInfo/authenticationInfo.
4. **Store categories.** *Default:* Chrome primary category "Productivity"; AMO nearest-fit categories. Confirm or override at submission.
5. **Chrome data-usage checkboxes.** *Default:* report no data collection (the developer never receives the keys) and complete the three Limited Use certifications; reconfirm against the live dashboard wording at submission.

**Resolved:** Version numbering. Both store builds are **v1.0.0** for parity at public debut; future updates resume incrementing by 0.1 (1.1, 1.2, ...). See decisions.md.

## Success Metrics
| ID | What's Being Verified | Pass Condition |
|---|---|---|
| QA-01 | Shared listing copy (FR-01) | Name, summary, and full description exist; contain no em dash and no "byte for byte"; summary fits 132 chars (Chrome) and 250 chars (AMO). |
| QA-02 | Store icon (FR-02) | A 128x128 PNG with no alpha is present and matches the brand raven mark. |
| QA-03 | Screenshots (FR-03) | 3 to 5 screenshots at 1280x800 exist, each showing a named state from the real UI. |
| QA-04 | Chrome fields (FR-04) | Item name ≤75 chars, summary ≤132 chars, description present, one category, language set, all documented. |
| QA-05 | Chrome promo tile (FR-05) | A 440x280 small promo tile (no alpha) is present. |
| QA-06 | Chrome privacy content (FR-06) | Single-purpose sentence, a justification for each of the 3 permissions and each of the 3 hosts, remote-code "No", data-usage selections, and 3 certifications are all written. |
| QA-07 | Chrome submit checklist (FR-07) | Checklist lists every step from registration and fee through submission. |
| QA-08 | AMO fields (FR-08) | Name ≤50, slug, summary ≤250, description, ≤2 categories, ≤10 tags, support/homepage, AGPL-3.0 license, privacy policy, all documented. |
| QA-09 | AMO data declaration (FR-09) | The data_collection_permissions value is specified and the manifest-change/rebuild note (v0.1.2) is recorded. |
| QA-10 | AMO source + build (FR-10) | A source archive plus build README exist; following the README from a clean checkout reproduces the submitted package with no differences; archive excludes node_modules and build output. |
| QA-11 | AMO reviewer notes (FR-11) | Notes explain how to test without the maintainer's keys and justify each host. |
| QA-12 | AMO submit checklist (FR-12) | Checklist covers 2FA, package upload, source upload, the data declaration, and submission. |
| QA-13 | Privacy policy URL (FR-13) | A publicly reachable privacy policy URL is provided and its text matches actual data behavior. |
| QA-14 | Disclosure consistency (FR-14) | Privacy policy, both stores' declarations, and the manifest hosts agree with no contradiction. |
| QA-15 | Packages (FR-15) | Both packages come from a single v1.0.0 build containing data_collection_permissions and the gecko id with strict_min_version 128.0. |
| QA-16 | Version reconciliation (FR-16) | No "v0.1.0" reference remains in README or docs that a listing links to. |
