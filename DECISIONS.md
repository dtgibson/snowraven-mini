# Decisions — SnowRaven Mini

## Weather & Tide on the eBird Checklist Page — 2026-06-09

**Decision:** Build the extension fully on-device with bring-your-own keys (eBird + OpenWeather in `chrome.storage.local`) and no backend. Resolve checklist coordinates via the eBird API using SnowRaven's region-centre-first fallback (not the page's map pin). Resolve timezone in-browser with `@photostructure/tz-lookup`. Add the `clipboardWrite` permission so the post-lookup weather auto-copy is reliable.

**Rationale:** Privacy and zero infrastructure. Byte-for-byte weather parity with SnowRaven requires feeding OpenWeather the *same* coordinates SnowRaven uses — the region-bounding-box centre, which differs from the exact map pin at hotspots — so the extension reuses that lookup rather than reading the page pin. A byte-exact timezone library would be multiple megabytes and break the small-bundle goal, so the ~50 KB `tz-lookup` was chosen, verified against SnowRaven at build time with a UTC fallback; the rare near-border timezone divergence is accepted. `clipboardWrite` is benign (write-only) and makes the headline one-click copy reliable, worth the one extra permission.

**Implications:** Future features keep the no-backend / bring-your-own-key / minimal-permission posture. The timezone library's near-border parity is a small known risk to re-verify if either side's tz data changes.

## v1 key-gating scope — 2026-06-09

**Decision:** v1 requires both keys; if only the OpenWeather key is missing, the popup nudges for it rather than showing tide on its own.

**Rationale:** The product's headline is weather, which needs the OpenWeather key; tide-only is a niche case not worth extra v1 UI.

**Implications:** Tide-without-OpenWeather is a deferred enhancement.
