# Strategic Brief — Weather and Tide on the eBird Checklist Page

## What We're Building
The complete SnowRaven Mini popup. When a birder editing an eBird checklist clicks the toolbar button, the extension resolves that checklist's location and time, fetches the historical weather and (where available) the tide, formats them byte-for-byte like SnowRaven, auto-copies the weather to the clipboard, and shows weather and tide in a small popup with copy buttons.

## Why Now
It's the founding feature — there's no product without it. Building weather and tide together rather than in two passes is the right call: they share the same checklist lookup, the same popup, and the same copy mechanics, so splitting them would mean building that shared spine twice. One coherent build stands up the whole core experience at once.

## The User Problem
A birder writing a checklist comment wants the weather and tide conditions in it, but getting them means leaving eBird, looking them up, formatting them, and pasting back — or running the full desktop app beside the browser. The summary SnowRaven already produces is one click away from where it's needed, if it lived in the browser.

## Success Criteria
- On the eBird edit page, one click puts the SnowRaven weather block on the clipboard, identical to what the desktop app produces for that same checklist.
- The popup shows the weather and — for US coastal checklists in NOAA's range — the tide, each with its own copy button. Tide is never auto-copied.
- Works for both hotspot and personal-location checklists.
- Behaves identically in Chrome and Firefox.
- Fully operable by keyboard and screen reader; meets WCAG 2.1 AA.
- First-time setup is pasting two free keys (eBird + OpenWeather); after that it's a single click.
- Nothing leaves the user's machine except the direct calls to eBird, OpenWeather, and NOAA.

## Scope
- Detect the eBird checklist edit page; read the checklist ID from the URL.
- Resolve coordinates and observation date/time through the eBird API, using SnowRaven's exact region-centre-first fallback so weather matches the app.
- Fetch historical weather (OpenWeather timemachine); format with the ported SnowRaven weather formatter.
- Fetch tide (NOAA) with nearest-station matching ported from SnowRaven; format with the ported tide formatter; show the coastal / too-far / outside-US states like the app does.
- Auto-copy weather on click; show weather and tide in the popup with individual copy buttons.
- An options page for the two API keys, stored locally.
- Popup-only Manifest V3, minimal permissions, one build for Chrome and Firefox.
- WCAG 2.1 AA, OS-driven dark theme, reduced motion respected.

## Out of Scope
- Auto-copying tide (weather only auto-copies).
- Detecting and skipping a weather block already present in the comment (SnowRaven's duplicate guard) — a later refinement.
- Any lookup outside the eBird checklist edit context — no arbitrary location/time queries, none of the desktop app's other tabs.
- A combined one-button "weather + tide" copy — individual buttons cover it; can revisit later.

## Key Decisions
- Weather and tide built together as one feature, sharing the lookup and popup.
- Coordinates resolved via the eBird API exactly as SnowRaven does (region-centre-first) to guarantee weather parity — not the page's exact pin.
- Bring-your-own-key for OpenWeather and eBird, stored locally. No backend, no shared or bundled keys.
- Output is byte-for-byte SnowRaven: exact line content and order, single-newline joins, and the literal HTML attribution links. (The blank-line-separated combined block is not used in v1.)
- Popup-only MV3, fewest permissions (activeTab, clipboardWrite, and storage, plus on-demand host permissions), no content script, no background worker.
- Smallest possible bundle: no component library; React, the ported formatters, and one stylesheet. The NOAA station list is the only large asset, trimmed to what's needed.
