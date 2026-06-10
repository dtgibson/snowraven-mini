# Schema — Store Submission Prep

## Path
Frontend Only. No data layer changes required.

## Confirmation
Assessed against the PRD (6 user stories, 16 functional requirements) and confirmed: no new tables, columns, relationships, or migrations. The deliverable is store listing packages, image assets, copy, privacy disclosures, and submit checklists, plus one static manifest declaration.

## Existing Data Used by This Feature
The extension has no database and no backend. Its only persistent state is two values in `chrome.storage.local`:

### `chrome.storage.local`
- Fields used: `ebird` (the user's eBird API key), `openweather` (the user's OpenWeather API key).
- How used: read at popup open to gate lookups; written and cleared on the Options page. This feature does not change how they are stored or used. It only describes them accurately in the store privacy disclosures.

Everything else (weather, tide, and checklist results) is fetched live from the eBird, OpenWeather, and NOAA APIs and held in memory only.

## One Static Configuration Change (not a data layer change)
The Firefox Add-ons requirement adds `browser_specific_settings.gecko.data_collection_permissions` to `manifest.json` (default `required: ["none"]`), and the version bumps to 1.0.0. These are static manifest declarations the Engineer applies. They introduce no stored data and no migration.

## No Data Layer Work Required
The Engineer can go straight to producing the listing packages, image assets, and the v1.0.0 build. No migrations need to be written or run for this feature.
