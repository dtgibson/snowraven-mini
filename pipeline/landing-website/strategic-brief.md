# Strategic Brief — Landing Website

## What We're Building
A small, polished static website for SnowRaven Mini, served from GitHub Pages at `snowravenmini.dtgibson.com`. It mirrors the SnowRaven desktop app's site (the same hand-authored, no-build, light/dark, screenshot-forward style) and shows what the extension does with the real v1.0.0 screenshots, plus a clear way to install it today.

## Why Now
v1.0.0 is released and the store listings are imminent. A public page gives the extension a friendly front door for the people you point at it now, and a place store users will land later. The screenshots and copy already exist from the store work, so the marginal effort is low and the payoff is a real product presence.

## The User Problem
A birder who hears about SnowRaven Mini, from the SnowRaven app, a friend, or eventually a store search, wants a quick, trustworthy page that shows what it does and how to get it, without reading a GitHub README. Today there is only the repo.

## Success Criteria
- A clean page at `snowravenmini.dtgibson.com` that makes the extension's purpose obvious on first view, shows it with real screenshots, and gives a working install path today.
- Visually a sibling of SnowRaven's site and brand (green, raven mark, Inter, quiet utility), with light and dark themes.
- The Chrome Web Store and Firefox Add-ons are presented as "coming soon," structured so real store buttons drop in the moment they go live.
- Fast, responsive, accessible, no build step, no heavy dependencies.

## Scope
- A static site (index.html, styles.css, a little app.js, favicon, assets) mirroring SnowRaven's site structure and visual language.
- Sections: a hero (what it is and the one-click value), feature highlights with the real screenshots (the auto-copied weather and tide, keys-stay-on-device privacy, the honest tide notice, the permission-on-click model), an install section ("coming soon" store buttons plus the current GitHub-release path), and a footer linking the repo, Help, privacy policy, the SnowRaven app, and the license.
- The custom-domain config (a `CNAME` file) and a GitHub Pages deploy setup that does not disturb the existing `docs/` folder.
- Reuse of the v1.0.0 store screenshots (converted for the web as needed).

## Out of Scope
- Creating the DNS record and enabling GitHub Pages in repo settings. Those are the maintainer's manual steps; exact values will be provided.
- Live store links. The stores stay "coming soon" until the listings are live; a later update swaps them in.
- Analytics, tracking, a contact form, a blog, or any backend.
- Any change to the extension itself.
- The SnowRaven desktop app's own site, which already exists.

## Key Decisions
- Custom subdomain `snowravenmini.dtgibson.com`, via a `CNAME` file in the site and a DNS CNAME record (`snowravenmini` to `dtgibson.github.io`); enable HTTPS in Pages.
- Hand-authored static site, no build and no framework, consistent with the extension's smallest-bundle ethos and SnowRaven's own site.
- Stores shown as "coming soon" now; the page is built so the switch to live links later is a small edit.
- Reuse the existing v1.0.0 screenshots rather than capturing new ones.
