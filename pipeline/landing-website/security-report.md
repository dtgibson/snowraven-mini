# Security Review: Landing Website

**Date:** 2026-06-10
**Feature:** landing-website
**Stack:** static site (no backend); deployed via GitHub Pages
**Checklist:** reference/checklists/security-react-vite.md (frontend portions; the site is plain static HTML/CSS/JS)
**Outcome:** PASSED

---

## Summary
The landing site is static HTML, CSS, and a small progressive-enhancement script, deployed to GitHub Pages from `website/`. It handles no user data, has no backend, and makes no third-party network requests: fonts are system fonts, and the only resources loaded are the local stylesheet, the local script, and the local favicon. The "no telemetry" claim on the page is literally true. All external links are safe, and the deploy workflow is least-privilege. No findings.

---

## Findings
No security issues found in this feature.

---

## Checks Performed

| Check | Result |
| --- | --- |
| Secrets in site files or the workflow | Pass: no keys, tokens, credentials, or private keys. The only "API key" mentions are marketing copy referring to the user's own keys, not embedded secrets. |
| Third-party resource loads (scripts, styles, fonts, images) | Pass: only local `styles.css`, `app.js` (deferred), and `favicon.svg` load. No external fonts, no CDN, no analytics, no `fetch`/XHR. The page makes zero third-party requests. |
| "No telemetry / no analytics" claim accuracy | Pass: no analytics or tracking scripts of any kind; the claim matches reality. |
| External link safety (tabnabbing) | Pass: all 18 `target="_blank"` links carry `rel="noopener"`. |
| GitHub Actions workflow least-privilege | Pass: `permissions` limited to `contents: read`, `pages: write`, `id-token: write`; official pinned actions (`checkout@v4`, `configure-pages@v5`, `upload-pages-artifact@v3`, `deploy-pages@v4`); no `pull_request_target`, no secret usage beyond the implicit `GITHUB_TOKEN`. |
| Injection / user input | Pass: the site is fully static with no inputs, forms, or dynamic rendering. |
| Honesty of store claims | Pass: no live store links; the stores are shown as "coming soon" only. |
| Scope: extension untouched | Pass: this feature changed no extension code, permissions, or manifest. |

## Convention Flags
None beyond the build flag (site in `website/`, deployed via the Pages workflow).
