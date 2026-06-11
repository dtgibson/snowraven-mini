# Security Report — Night-list weather parity (moon phase)

**Lane:** Improve · **Stage 4 (The Auditor)** · 2026-06-11 · **Verdict: PASS (clean)**

No new security, data, or privacy surface. No findings at any severity.

## Trust-boundary review

- **No new dependency.** The moon math is hand-ported arithmetic in `weatherFormatter.ts`
  (no `lunarphase-js` import). `package.json` and `package-lock.json` are unmodified, so
  there is no new supply-chain surface and no known-vulnerability exposure to assess.
- **No new permission.** `manifest.json` is untouched; the extension still requests only
  `activeTab`, `clipboardWrite`, and `storage`. Host access is unchanged.
- **No new network call or external data flow.** The change adds no fetch. It reads the
  `dt` field that already arrives on the existing OpenWeather `onecall/timemachine`
  response and uses it only in numeric comparisons and the Julian-Day arithmetic. The
  on-device, bring-your-own-key, no-backend posture is preserved.
- **Output is from a fixed allowlist, not attacker-controlled.** The appended glyph is
  selected from the constant `MOON_NORTH` / `MOON_SOUTH` arrays by a bounded index. No
  network or user string is interpolated into the block, so the moon addition introduces
  no injection vector into the clipboard text or the rendered `MonoBlock`.
- **`lat` is already-trusted input.** The latitude passed to `formatWeather` is the same
  value already used to resolve the timezone and to query OpenWeather. The change widens
  no input it didn't already consume.

## Conclusion

Clean pass — nothing to remediate. Deployment is not blocked. Ready for The Deployer.
