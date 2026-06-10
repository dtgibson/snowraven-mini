## Landing Website (snowravenmini.dtgibson.com)

### What this does
Adds a static marketing site for SnowRaven Mini under `website/`, mirroring the SnowRaven desktop app's site. Hero with the popup in a browser frame, a "your keys stay on your device" band, four feature rows showing the live popup UI, an install section with "coming soon" store buttons plus the current GitHub-release path, a closing CTA, and a footer. Published to GitHub Pages via a workflow, on the custom domain `snowravenmini.dtgibson.com`.

### How to test
- Open `website/index.html` in a browser. Toggle light/dark with the sun/moon, resize to mobile (the nav collapses to a menu), and check the links.
- After deploy, the Pages workflow publishes `website/` on every push to `main` that touches it.

### Notes for reviewer
- No build step: plain HTML/CSS/JS, system fonts, no external requests. The only raster asset is the local Open Graph image.
- Feature visuals are live popup HTML (the extension's own component classes), not screenshots (see `pipeline/landing-website/decisions.md`).
- The stores are "coming soon"; the swap to live links is a localized edit in the install section.
- `docs/` is untouched; the site lives in `website/` and deploys via `.github/workflows/pages.yml`.
- Manual steps remain for the Deployer stage: enable Pages (Source: GitHub Actions) and add the DNS CNAME record `snowravenmini` to `dtgibson.github.io`.
