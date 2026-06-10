# Schema — Landing Website

## Path
Frontend Only. No data layer changes required.

## Confirmation
Assessed against the PRD (5 user stories, 14 functional requirements): a static marketing website. It creates, reads, updates, or deletes no persistent data. No tables, migrations, schema, or storage. It does not touch the extension's `chrome.storage.local` keys or any runtime code.

## Existing Data Used by This Feature
None. The site is static HTML, CSS, and a little JS. It references the v1.0.0 screenshots and links to the GitHub repo, release, Help, privacy policy, and the SnowRaven app site. No API calls and no data fetching.

## Structural Additions (not a data layer)
- A top-level `website/` folder (`index.html`, `styles.css`, `app.js`, `favicon.svg`, `assets/`, `CNAME`, `.nojekyll`).
- A GitHub Actions workflow (`.github/workflows/pages.yml`) to publish `website/` to GitHub Pages.

These are static files and deploy configuration, not data structures, and they leave `docs/` and the extension build untouched.

## No Data Layer Work Required
The Engineer can build the static site directly. No migrations to write or run.
