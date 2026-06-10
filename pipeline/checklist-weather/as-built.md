# As-Built Notes — Stage 5 (The Engineer)

Refinements made during implementation and live in-browser verification. The PRD and schema remain the record of intent; these capture where the shipped code differs or adds, so The Tester and The Chronicler work from reality.

1. **`storage` permission added.** The manifest now declares `["activeTab", "clipboardWrite", "storage"]`. `chrome.storage.local` (the two bring-your-own keys) is `undefined` without `storage`; the original "exactly `["activeTab", "clipboardWrite"]`" list was a miss that hung the popup on first run. (NFR-01, QA-54, and schema.md updated to match.)

2. **Page detection is edit-vs-view, by subID location.** The Edit Comments page (the paste target) carries the subID in the **query string** — `https://ebird.org/edit/effort?subID=S…` — while the checklist **view** page carries it in the **path** — `https://ebird.org/checklist/S…`. `readActiveTab` now returns `pageType: 'edit' | 'checklist-view' | 'other'`. The original FR-02/FR-04 read only the path, so the edit page was never recognized.

3. **New `checklist-view` popup state.** On `/checklist/S…`, the popup shows "You're on the checklist page" with a **Show weather anyway** button (the subID is in that URL too) and an **Open Edit Comments →** link to `/edit/effort?subID=…`.

4. **Permission request is button-driven, never automatic.** `chrome.permissions.request` requires a user gesture and throws on popup auto-load — the cause of the infinite spinner. The popup now checks `permissions.contains()` on open and, if access isn't held, shows a **Grant access** button that requests from the click. "Show weather anyway" doubles as that gesture.

5. **Visible auto-copy confirmation.** On a successful auto-copy, a green "Copied to clipboard — paste it into your checklist comment." banner appears under the weather block, alongside the existing polite live-region announcement (FR-48a).

6. **Defensive error handling.** Any unexpected error in the open sequence now renders an error state instead of leaving the popup spinning.

7. **Toolbar and source icons are the SnowRaven raven.** Rasterized from the repo's `logo.svg` (stored locally at `brand/icon.svg`) to 16/32/48/128 via `scripts/make-icons.mjs` (`sharp` is a build-time dev tool, not shipped).

## Runtime checks deferred to The Tester / later
Unchanged from the schema's flags — these are real-browser/account checks that can't be proven in jsdom: the grant-then-copy flow and clipboard activation on live Chromium and Firefox, the Firefox `strict_min_version` 128 floor (QA-53a), and OpenWeather One Call 3.0 key activation.
