# QA Report — Night-list weather parity (moon phase)

**Lane:** Improve · **Stage 3 (The Tester)** · 2026-06-11 · **Verdict: PASS**

Verified from three independent angles in parallel, plus the standard suite and build.
Every angle returned a clean pass with no regressions and no concerns.

## Suite + build

- `npx vitest run` — **89 passed (89)**, 9 files, 0 failed (was 65 before this change;
  the golden suite grew from ~12 to 36 cases).
- `npm run build` (`tsc -b && vite build`) — clean, 56 modules transformed, dist emitted.

## Angle 1 — Logic parity against SnowRaven `512466e`

The plugin's moon logic in `src/lib/weatherFormatter.ts` is byte-for-byte identical to
SnowRaven's `frontend/src/lib/weatherFormatter.ts` at the source commit for every
output-affecting construct:

- `LUNAR_MONTH`, all 8 `MOON_PHASE_BOUNDS` (in order), and the `MOON_NORTH` / `MOON_SOUTH`
  emoji arrays — the latter confirmed byte-identical by hexdump (no stray variation
  selectors), with South correctly mirroring the waxing/waning set.
- The `moonPhaseEmoji` Julian-Day formula, `frac`/`age` computation, `lat < 0` branch,
  bin loop, and wrap-to-`emojis[0]` fallback.
- `isNightHour` (`dt < sunrise || dt > sunset`), the night detection in `formatWeatherBody`,
  the unspaced `${emoji}${moon}` header, and the unchanged day-block lines.
- Signatures: `formatWeather` / `formatWeatherBody` both take `(responses, tzName, lat)`;
  the `HourlyResponse` hour carries `dt`.

The only differences between the two files are non-load-bearing code comments.

## Angle 2 — Independent moon-phase recomputation

A from-scratch implementation of the lunarphase-js@2.0.3 pure-UTC algorithm (not reading
the ported code) reproduced every emoji the golden test asserts:

- `DT_NIGHT` → 🌗 (N) / 🌓 (S); `DT_DAY` mixed-block first hour → 🌗 (N).
- All 9 per-bin timestamps match their asserted North/South emoji, including the
  age-28.8 wrap back to New.
- Night/day detection holds: `DT_NIGHT` before sunrise and `DT_NIGHT_2` after sunset are
  night; `DT_DAY` inside the window is day. No computed age sits on a bin boundary, so
  there is no edge ambiguity.

## Angle 3 — Regression + contract audit

- All three `formatWeather` callers pass the new `lat`: the runtime caller in
  `weatherService.ts` (`checklist.lat`) and both test callers. No 2-arg call remains.
- Runtime supplies `dt`: OpenWeather's `onecall/timemachine` hours carry `dt` alongside
  the temp/sunrise/sunset fields already consumed, and `tsc` enforces the now-required field.
- The 9 pre-existing day-block golden strings are byte-unchanged — only the input fixtures
  gained a `dt` field, and no moon appears on any day block.
- Moon is appended as a single unspaced emoji run (`☁️🌗`, never `☁️ 🌗`).
- No new npm dependency (the math is hand-ported) and no manifest permission change
  (`activeTab`, `clipboardWrite`, `storage` unchanged).

## Conclusion

The change is at byte-for-byte parity with SnowRaven `0.5.28` for night and day blocks, in
both hemispheres, and introduces no regression. Ready for The Auditor.
