# Accessibility — SnowRaven Mini

SnowRaven Mini is built to be usable by everyone. It runs entirely in the browser as a small popup with an Options page, and it follows standard web accessibility practices so it works with keyboards and screen readers. This describes what is in place today. Accessibility is treated as ongoing work, not a finished checkbox.

---

## Keyboard Navigation

All of SnowRaven Mini is reachable and operable with the keyboard alone.

Every control is in the tab order and can be activated with Enter or Space: the per-block **Copy** buttons on the weather and tide results, the **Grant access** button on the permission prompt, the **Show weather anyway** button and the **Open Edit Comments** link on the checklist-view state, the tide **override** button ("Show it anyway" / "Show nearest US station"), and the **Settings** links that take you to the Options page. On the Options page, both API-key fields, each field's reveal (show/hide) toggle, the per-field "Get a free key" link, and the **Save keys** button are all keyboard-operable in a sensible order.

Because the whole interface is a single small popup, there are no maps, charts, tabs, or sortable tables to navigate — Tab and Shift+Tab move through the handful of controls on whichever state is showing. Pressing **Escape** closes the popup, the standard browser behavior for an extension popover.

---

## Screen Reader Support

SnowRaven Mini uses semantic HTML and ARIA so assistive technology can describe the interface accurately. The copy buttons carry explicit accessible names — "Copy weather to clipboard" and "Copy tide to clipboard" — so their purpose is clear even though they show only a short visible label, and the reveal toggle on each key field announces its show/hide action and pressed state. The key fields are real labelled inputs, each with its help text linked so a screen reader reads the field and its explanation together.

Results and copy confirmations are announced as they happen. The weather and tide blocks, the "Weather copied to clipboard" / "Tide copied to clipboard" confirmations, and the auto-copy confirmation that fires when the popup opens are all announced through a polite live region, so they don't interrupt but aren't lost either. Errors are announced more assertively through an alert region, so a failed lookup or an invalid-key message reaches you right away. Nothing is conveyed by color alone: the amber tide notice (when the nearest station is too far away or outside the US) and the error card both pair their color with text and an icon, so their meaning survives without color perception.

---

## A Visible Focus Indicator

Wherever keyboard focus lands, you can see it. Focused controls show a clear green outline — a 2px ring offset slightly from the control, and a border-hugging ring on the key input fields — so you always know where you are in the popup or on the Options page.

---

## Color and Contrast

Color is never the only way information is conveyed. The amber tide notice and the destructive-red error card are always paired with text and an icon in addition to their color. Body text and the primary interface colors — text, buttons, links, the monospace weather/tide blocks, and the form controls — are chosen to meet the WCAG 2.1 AA contrast standard (4.5:1) in both the light and dark themes. Every color the UI uses comes from a shared design token, so that contrast holds in either theme. A full dark theme is included and follows your operating system's light/dark preference automatically (`prefers-color-scheme`); there is no separate in-app toggle to get out of step.

---

## Text Size and Zoom

SnowRaven Mini's text is sized in relative units, so it **honors your browser's default text size** automatically, and browser/page zoom (Ctrl/Cmd +/−) works as expected. The popup and the Options page reflow rather than clip: the Options card has a comfortable maximum width and centers within the page, and the monospace weather and tide blocks scroll horizontally if a line is longer than the popup is wide — keeping the copied text byte-for-byte intact rather than re-wrapping it.

---

## Reduced Motion

If your operating system is set to reduce motion, SnowRaven Mini honors it: the loading spinner is frozen and transitions are disabled (`prefers-reduced-motion: reduce`), so the interface does not animate unnecessarily while it works.

---

## Feedback

If you run into an accessibility barrier in SnowRaven Mini, please reach out at [developer@dtgibson.com](mailto:developer@dtgibson.com). Accessibility issues are treated as bugs and addressed as a priority.
