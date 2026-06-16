# Seeing onboarding & combined copy locally

SnowRaven Mini is a browser extension, so there's no website to open. You build
it once, then load the built folder into Chrome or Firefox as an unpacked
extension. It takes a couple of minutes the first time.

1. Open a terminal in your project folder.

2. Build the extension:

   ```
   npm run build
   ```

   This creates a `dist/` folder with the loadable extension inside it.

3. Load it into your browser.

   In Chrome:
   - Go to `chrome://extensions`
   - Turn on "Developer mode" (top right)
   - Click "Load unpacked" and choose the `dist` folder

   In Firefox:
   - Go to `about:debugging`
   - Click "This Firefox" on the left
   - Click "Load Temporary Add-on" and choose `dist/manifest.json`

4. See the first-run walkthrough. Before you add any keys, go to any eBird
   checklist's Edit Comments page and click the SnowRaven Mini icon in your
   toolbar. Instead of the old plain notice, you'll see a setup card titled
   "Two free keys and you're set" with a row for each key marked "Needed", a
   "Get a free key" link on each, and a "Go to Settings" link. Click a "Get a
   free key" link — it opens that provider's key page in a new tab and asks for
   no extra permission.

5. See the one-key variant. Open Settings, add just one of the two keys, save,
   then reopen the popup on a checklist. The card now reads "One free key to go",
   the key you added shows a green check and "Set" (its get-key link is gone),
   and only the missing key is named.

6. See the combined-copy button. Add both keys, reopen the popup on a checklist
   that has weather and a nearby tide station, and grant access if asked. Below
   the weather and tide blocks you'll see a full-width "Copy weather & tide
   together" button. Click it: it briefly flips to "Copied!", then reverts. Paste
   into a comment to confirm you get one tidy block with a single SnowRaven credit
   at the bottom. The two per-block Copy buttons and the automatic weather copy
   work exactly as before.

If the button doesn't appear, the checklist probably has no tide reading (inland,
or the nearest station is out of range) — that's expected; the button only shows
when both weather and tide are present.
