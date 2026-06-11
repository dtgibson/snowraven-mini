# Change Brief — Night-list weather parity (moon phase)

**Lane:** Improve · **Stage 1 (The Evaluator)** · 2026-06-11

## What prompts this

SnowRaven shipped `0.5.28` (commit `512466e`, "moon-phase emoji on night weather
blocks — raincrow parity"). It changed how the desktop app renders weather for
**night checklists**: the generated weather block now appends a moon-phase emoji to
the condition emoji, unspaced (e.g. `☁️🌗`). SnowRaven Mini's hard requirement is
byte-for-byte parity with SnowRaven's weather output, so the plugin must adopt the
exact same calculation and formatting.

## Feature-check verdict — stays in the Improve lane

A user will newly see a moon emoji on night blocks, which on its face looks
user-facing. But this is **parity compliance with the canonical source**, not a
net-new product capability the plugin is inventing. The plugin's entire premise is
"byte-for-byte identical to SnowRaven"; matching SnowRaven's output keeps an existing
contract rather than expanding scope. There is no new surface, no new permission, no
new user decision, and no design work. This is exactly the "parity / convention
compliance" case the Improve lane covers. **Conclusion: Improve, not a new feature.**

## The change, precisely (ported as-is from SnowRaven)

Night = any sampled hour whose `dt` falls outside its own sunrise–sunset window.
When a block is night, append the moon phase computed from the **first** sampled
hour's `dt` and the checklist latitude, unspaced, to the condition emoji. Day blocks
are byte-unchanged. The moon math is a hand-port of `lunarphase-js@2.0.3` with a
pure-UTC Julian Day, identical to SnowRaven's TS and Python formatters (golden-oracle
locked), and the Southern Hemisphere mirrors the waxing/waning set.

## Files to change

1. **`src/lib/weatherFormatter.ts`** — the port. Add `dt: number` to the
   `HourlyResponse` hour shape; add `LUNAR_MONTH`, `MOON_PHASE_BOUNDS`, `MOON_NORTH`,
   `MOON_SOUTH`, `moonPhaseEmoji(unixTs, lat)`, and `isNightHour(d)`; thread a `lat`
   parameter through `formatWeatherBody` and `formatWeather`; change the header line
   from `emoji` to `` `${emoji}${moon}` `` where `moon` is set only when any sampled
   hour is night. Copy SnowRaven's source verbatim — same constants, same bounds,
   same comments.
2. **`src/lib/weatherService.ts`** — pass `checklist.lat` as the new third argument
   to `formatWeather` (line ~183). The latitude is already resolved; the OpenWeather
   timemachine response already carries `dt` per hour, so no fetch change is needed.
3. **`src/lib/weatherFormatter.golden.test.ts`** — add `dt` to every fixture hour
   (day fixtures use a daytime `dt`, production fixture uses `dt: 1714559400`), add
   the `lat` argument to every `formatWeather(...)` call, and add the new night
   golden cases plus the `moonPhaseEmoji` per-bin cases, with expected strings copied
   **byte-for-byte** from SnowRaven's updated tests:
   - night single-hour North: header `☁️🌗`
   - night single-hour South (same input): header `☁️🌓`
   - multi-hour day-start + night-end: header `🌥️🌗` (phase from the first hour)
   - day-block-unchanged and latitude-no-effect-on-day assertions
4. **`src/lib/tideFormatter.test.ts`** — its `HourlyResponse` fixture (~line 62)
   needs the new required `dt` field added so the suite still compiles.

## Parity guarantees to lock

- `moonPhaseEmoji` is a pure, deterministic function of `(unixTs, lat)`; given
  SnowRaven's fixture `dt`/`lat` values it must return the same emoji.
- Day blocks must be **byte-identical** to today's output (no moon, latitude
  irrelevant) — the existing golden strings stay unchanged except for the added `dt`
  field on the input fixtures.
- The header stays a **single unspaced emoji run** (`☁️🌗`, never `☁️ 🌗`). The
  plugin has no comment-stripper today, but the unspaced form is the parity contract
  and a standing convention on the SnowRaven side.

## How we'll verify (Stage 3, The Tester)

`npm test` (Vitest, includes the golden parity suite) and `npm run build`
(tsc + vite) must be green. The new golden strings are asserted with `.toBe`, so any
byte drift fails the build. Independent re-derivation of the moon-phase bins against
SnowRaven's oracle confirms the math.

## Risks

Low. The change is small, additive, and pure. The only compile-time ripple is the
new required `dt` field touching the tide test fixture. No new dependency (the moon
math is hand-ported), no new permission, no network change.
