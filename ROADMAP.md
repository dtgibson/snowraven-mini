# Roadmap

This is a living document. It reflects the current best thinking on what to build next — not a contract. Things change as you learn more about your users and your product. Update it freely.

---

## Shipped

Nothing shipped yet.

---

## Up Next

1. **Weather on the checklist page** — The core path end to end: detect the eBird edit page, read the checklist ID, resolve its location and time through the eBird API exactly as SnowRaven does, fetch historical weather from OpenWeather, format it byte-for-byte like SnowRaven, and auto-copy it on click with a popup display. This proves the whole idea and delivers the headline value first.
2. **Tide in the popup** — Add the keyless NOAA tide lookup and nearest-station matching, shown alongside the weather with its own copy button, so the user can add it when it's relevant. Builds directly on the resolved location from step one.
3. **Accessible polish and release to both stores** — Bring the popup to SnowRaven's WCAG 2.1 AA bar (keyboard, screen-reader labels, focus, contrast, dark theme, reduced motion), then package and submit one codebase to both the Chrome Web Store and Firefox Add-ons.

---

## On the Horizon

- A first-run setup that walks the user through pasting their free eBird and OpenWeather keys.
- Graceful handling of edge cases: missing coordinates, inland checklists with no nearby tide station, and expired or invalid keys.
