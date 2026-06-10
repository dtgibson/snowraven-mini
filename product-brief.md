# Product Brief — SnowRaven Mini

## What This Is
SnowRaven Mini is a Chrome and Firefox extension that brings SnowRaven's weather and tide lookup onto the eBird checklist page itself. While you're editing a checklist, one click copies a ready-to-paste weather summary — for that checklist's exact location and time — to your clipboard, and shows weather and tide together in a small popup with copy buttons.

## The Problem
A birder who wants weather and tide in their checklist comment has to leave the page, look it up, format it, and paste it back — or run the full SnowRaven desktop app alongside the browser. That's friction at the exact moment they're already on the checklist, ready to write the comment. The summary SnowRaven already produces is one tab-switch and an app-launch away from where it's actually needed.

## Who It's For
A birder who already uses eBird, likes SnowRaven's weather/tide comment blocks, and does their checklist editing in the browser. They're fine getting a free eBird and OpenWeather key once, and they value keeping their data on their own machine. It's the same person SnowRaven is built for, met in a lighter place: the eBird tab itself.

## Why It Should Exist
SnowRaven already produces exactly the right summary; the only thing missing is getting it where the birder is working without launching the desktop app. The extension closes that last gap, and earns its place by being faithful (identical output to SnowRaven, not a re-interpretation), private (everything runs on the user's machine, nothing through a server), and nearly invisible in footprint (the fewest permissions that make it work).

## What Success Looks Like
A birder editing a checklist clicks the toolbar button, and the SnowRaven weather block is already on their clipboard — identical to what the desktop app would produce for that same checklist — with the tide shown right there to add if they want it. They paste and move on. It behaves the same in Chrome and Firefox, works for personal locations and hotspots alike, and is fully usable by keyboard and screen reader. Setup is a one-time paste of two keys; after that it's a single click.

## Founding Decisions
- **Faithful to SnowRaven, byte-for-byte.** Weather and tide output matches the app exactly — same format, wording, and attribution links. Output parity is a hard requirement, which is why the extension resolves a checklist's coordinates the same way SnowRaven does (the eBird API, region-centre-first) rather than reading the page's exact map pin.
- **On-device and private.** No backend. The user supplies their own OpenWeather and eBird keys, stored locally, mirroring SnowRaven's desktop "bring your own key" model. No checklist data passes through any third-party server.
- **Minimal footprint — in permissions and in size.** A popup-only design that reads the active tab's URL only on click, requests API access on demand, and runs with no background process, no content script, and no broad page access. The shipped bundle is kept as small as possible: no component-library or heavy UI dependencies, just React, the ported SnowRaven formatters, and a small stylesheet. The only sizable asset is the NOAA tide-station data, trimmed to what the feature actually needs.
- **Weather copies on click; tide is yours to add.** Clicking the toolbar button auto-copies the *weather* block to the clipboard. The popup also shows the tide (for US coastal checklists within NOAA's range) with its own copy button, so the user decides whether it goes into the comment — exactly like SnowRaven's weather tab.
- **Chrome and Firefox at launch.** One codebase ships to both browsers from day one.
- **Accessible to SnowRaven's standard.** WCAG 2.1 AA — keyboard-operable, screen-reader labelled, visible focus, AA contrast, an OS-driven dark theme, and reduced-motion respected.

## Out of Scope
- No backend, proxy, or hosted service of any kind.
- No new weather or tide logic — the extension reuses SnowRaven's existing formatters and lookup approach rather than inventing its own.
- No bundled or shared API keys (against eBird's terms, and a privacy risk); keys are always user-supplied.
- No editing or posting to eBird on the user's behalf — it reads what it needs and copies to the clipboard; pasting stays the user's action.
- No lookups outside the eBird checklist context in v1 (no arbitrary location/time queries like the desktop app's other tabs).
