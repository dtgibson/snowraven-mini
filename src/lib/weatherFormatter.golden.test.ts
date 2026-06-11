// Golden parity test for formatWeather — locked to the EXACT output of SnowRaven's
// Python oracle (frontend/src/lib/weatherFormatter.golden.py) and its TS tests,
// encoded as .toBe so any byte drift (the U+2026/dash separators, the literal HTML
// <a> attribution, single-\n joins, no blank lines, no trailing newline, and the
// unspaced moon-phase emoji on night blocks) fails the build. FR-13..FR-19 / QA-19.

import { describe, it, expect } from 'vitest';
import {
  formatWeather, formatLocalTime, bankersRound, moonPhaseEmoji, type HourlyResponse,
} from './weatherFormatter';

type Hour = HourlyResponse['data'][number];
const hr = (h: Hour): HourlyResponse => ({ data: [h] });

// Shared sunrise/sunset for the non-production fixtures (UTC timezone).
const SR = 1714494600; // -> 4:30pm UTC
const SS = 1714545000; // -> 6:30am UTC (next UTC day wrap)

// Sampled-hour dt values relative to the SR/SS window.
const DT_DAY = 1714500000;     // inside [SR, SS] -> day
const DT_NIGHT = 1714491000;   // SR - 3600 -> night (before sunrise)
const DT_NIGHT_2 = 1714548600; // SS + 3600 -> night (after sunset)

// Latitudes (lat only matters on night blocks; lat < 0 mirrors the moon).
const LAT_N = 40.7128;
const LAT_S = -33.8688;

const PRODUCTION = hr({
  dt: 1714559400, temp: 54.3, humidity: 89, dew_point: 51.5, wind_speed: 8.3, wind_deg: 270,
  clouds: 100, weather: [{ id: 804, description: 'overcast clouds' }],
  sunrise: 1714554480, sunset: 1714603980,
});

const CALM = hr({
  dt: DT_DAY, temp: 72.0, humidity: 60, dew_point: 55.0, wind_speed: 0.5, wind_deg: 0,
  clouds: 20, weather: [{ id: 800, description: 'clear sky' }], sunrise: SR, sunset: SS,
});

const GALE = hr({
  dt: DT_DAY, temp: 45.0, humidity: 80, dew_point: 40.0, wind_speed: 45.0, wind_deg: 315,
  clouds: 90, weather: [{ id: 500, description: 'light rain' }], sunrise: SR, sunset: SS,
});

const GENTLE_A = hr({
  dt: DT_DAY, temp: 60.0, humidity: 70, dew_point: 50.0, wind_speed: 9.0, wind_deg: 90,
  clouds: 30, weather: [{ id: 801, description: 'few clouds' }], sunrise: SR, sunset: SS,
});

const GENTLE_B = hr({
  dt: DT_DAY, temp: 65.0, humidity: 65, dew_point: 48.0, wind_speed: 11.0, wind_deg: 180,
  clouds: 40, weather: [{ id: 801, description: 'few clouds' }], sunrise: SR, sunset: SS,
});

const FRESH_FIRST = hr({
  dt: DT_DAY, temp: 60.0, humidity: 70, dew_point: 50.0, wind_speed: 20.0, wind_deg: 90,
  clouds: 30, weather: [{ id: 801, description: 'few clouds' }], sunrise: SR, sunset: SS,
});

const LIGHT_SECOND = hr({
  dt: DT_DAY, temp: 65.0, humidity: 65, dew_point: 48.0, wind_speed: 5.0, wind_deg: 45,
  clouds: 40, weather: [{ id: 801, description: 'few clouds' }], sunrise: SR, sunset: SS,
});

const W_A = hr({
  dt: DT_DAY, temp: 70.0, humidity: 50, dew_point: 45.0, wind_speed: 8.0, wind_deg: 268,
  clouds: 0, weather: [{ id: 800, description: 'clear sky' }], sunrise: SR, sunset: SS,
});

const W_B = hr({
  dt: DT_DAY, temp: 72.0, humidity: 48, dew_point: 44.0, wind_speed: 10.0, wind_deg: 272,
  clouds: 5, weather: [{ id: 800, description: 'clear sky' }], sunrise: SR, sunset: SS,
});

const SW_FIRST = hr({
  dt: DT_DAY, temp: 68.0, humidity: 55, dew_point: 47.0, wind_speed: 8.0, wind_deg: 225,
  clouds: 10, weather: [{ id: 800, description: 'clear sky' }], sunrise: SR, sunset: SS,
});

const NE_SECOND = hr({
  dt: DT_DAY, temp: 70.0, humidity: 52, dew_point: 45.0, wind_speed: 9.0, wind_deg: 45,
  clouds: 15, weather: [{ id: 800, description: 'clear sky' }], sunrise: SR, sunset: SS,
});

const EQUAL = hr({
  dt: DT_DAY, temp: 72.0, humidity: 60, dew_point: 55.0, wind_speed: 8.0, wind_deg: 0,
  clouds: 50, weather: [{ id: 802, description: 'scattered clouds' }], sunrise: SR, sunset: SS,
});

const CAPS = hr({
  dt: DT_DAY, temp: 68.0, humidity: 55, dew_point: 47.0, wind_speed: 8.0, wind_deg: 90,
  clouds: 75, weather: [{ id: 803, description: 'BROKEN CLOUDS' }], sunrise: SR, sunset: SS,
});

// Night fixtures (moon-phase emoji appended to the condition emoji, unspaced).
const NIGHT_OVERCAST = hr({
  dt: DT_NIGHT, temp: 54.0, humidity: 88, dew_point: 51.0, wind_speed: 5.0, wind_deg: 270,
  clouds: 100, weather: [{ id: 804, description: 'overcast clouds' }], sunrise: SR, sunset: SS,
});

const MIXED_DAY_FIRST = hr({
  dt: DT_DAY, temp: 62.0, humidity: 70, dew_point: 52.0, wind_speed: 9.0, wind_deg: 90,
  clouds: 75, weather: [{ id: 803, description: 'broken clouds' }], sunrise: SR, sunset: SS,
});

const MIXED_NIGHT_SECOND = hr({
  dt: DT_NIGHT_2, temp: 55.0, humidity: 82, dew_point: 50.0, wind_speed: 6.0, wind_deg: 135,
  clouds: 80, weather: [{ id: 803, description: 'broken clouds' }], sunrise: SR, sunset: SS,
});

describe('formatWeather golden parity (weatherFormatter.golden.py)', () => {
  it('production fixture (America/New_York) — FR-19', () => {
    expect(formatWeather([PRODUCTION], 'America/New_York', LAT_N)).toBe(
      '☁️\nOvercast clouds\nTemperature: 54°F\nWind: Gentle breeze\nWind Direction: W\nCloud Cover: 100%\nHumidity: 89%\nDew point: 52°F\nSunrise: 5:08am\nSunset: 6:53pm\nWeather generated by <a href="https://github.com/dtgibson/snowraven">SnowRaven</a>'
    );
  });

  it('calm wind single-hour (UTC)', () => {
    expect(formatWeather([CALM], 'UTC', LAT_N)).toBe(
      '☀️\nClear sky\nTemperature: 72°F\nWind: Calm\nWind Direction: N\nCloud Cover: 20%\nHumidity: 60%\nDew point: 55°F\nSunrise: 4:30pm\nSunset: 6:30am\nWeather generated by <a href="https://github.com/dtgibson/snowraven">SnowRaven</a>'
    );
  });

  it('gale wind single-hour (UTC)', () => {
    expect(formatWeather([GALE], 'UTC', LAT_N)).toBe(
      '🌧️\nLight rain\nTemperature: 45°F\nWind: Gale\nWind Direction: NW\nCloud Cover: 90%\nHumidity: 80%\nDew point: 40°F\nSunrise: 4:30pm\nSunset: 6:30am\nWeather generated by <a href="https://github.com/dtgibson/snowraven">SnowRaven</a>'
    );
  });

  it('multi-hour same beaufort (UTC)', () => {
    expect(formatWeather([GENTLE_A, GENTLE_B], 'UTC', LAT_N)).toBe(
      '🌤️\nFew clouds\nTemperature: 60 - 65°F\nWind: Gentle breeze\nWind Direction: E - S\nCloud Cover: 30 - 40%\nHumidity: 65 - 70%\nDew point: 48 - 50°F\nSunrise: 4:30pm\nSunset: 6:30am\nWeather generated by <a href="https://github.com/dtgibson/snowraven">SnowRaven</a>'
    );
  });

  it('multi-hour different beaufort sorted lightest-to-strongest (UTC)', () => {
    expect(formatWeather([FRESH_FIRST, LIGHT_SECOND], 'UTC', LAT_N)).toBe(
      '🌤️\nFew clouds\nTemperature: 60 - 65°F\nWind: Light breeze - Fresh breeze\nWind Direction: E - NE\nCloud Cover: 30 - 40%\nHumidity: 65 - 70%\nDew point: 48 - 50°F\nSunrise: 4:30pm\nSunset: 6:30am\nWeather generated by <a href="https://github.com/dtgibson/snowraven">SnowRaven</a>'
    );
  });

  it('multi-hour same direction dedup (UTC)', () => {
    expect(formatWeather([W_A, W_B], 'UTC', LAT_N)).toBe(
      '☀️\nClear sky\nTemperature: 70 - 72°F\nWind: Gentle breeze\nWind Direction: W\nCloud Cover: 0 - 5%\nHumidity: 48 - 50%\nDew point: 44 - 45°F\nSunrise: 4:30pm\nSunset: 6:30am\nWeather generated by <a href="https://github.com/dtgibson/snowraven">SnowRaven</a>'
    );
  });

  it('multi-hour different directions insertion order (UTC)', () => {
    expect(formatWeather([SW_FIRST, NE_SECOND], 'UTC', LAT_N)).toBe(
      '☀️\nClear sky\nTemperature: 68 - 70°F\nWind: Gentle breeze\nWind Direction: SW - NE\nCloud Cover: 10 - 15%\nHumidity: 52 - 55%\nDew point: 45 - 47°F\nSunrise: 4:30pm\nSunset: 6:30am\nWeather generated by <a href="https://github.com/dtgibson/snowraven">SnowRaven</a>'
    );
  });

  it('equal value range (UTC)', () => {
    expect(formatWeather([EQUAL, EQUAL], 'UTC', LAT_N)).toBe(
      '⛅\nScattered clouds\nTemperature: 72°F\nWind: Gentle breeze\nWind Direction: N\nCloud Cover: 50%\nHumidity: 60%\nDew point: 55°F\nSunrise: 4:30pm\nSunset: 6:30am\nWeather generated by <a href="https://github.com/dtgibson/snowraven">SnowRaven</a>'
    );
  });

  it('capitalize mixed case (UTC)', () => {
    expect(formatWeather([CAPS], 'UTC', LAT_N)).toBe(
      '🌥️\nBroken clouds\nTemperature: 68°F\nWind: Gentle breeze\nWind Direction: E\nCloud Cover: 75%\nHumidity: 55%\nDew point: 47°F\nSunrise: 4:30pm\nSunset: 6:30am\nWeather generated by <a href="https://github.com/dtgibson/snowraven">SnowRaven</a>'
    );
  });
});

// ─── formatWeather — night blocks append the moon phase (golden) ─────────────

describe('formatWeather night-block moon phase (golden parity)', () => {
  it('night single-hour appends the moon unspaced — ☁️🌗, Northern Hemisphere', () => {
    expect(formatWeather([NIGHT_OVERCAST], 'UTC', LAT_N)).toBe(
      '☁️🌗\nOvercast clouds\nTemperature: 54°F\nWind: Light breeze\nWind Direction: W\nCloud Cover: 100%\nHumidity: 88%\nDew point: 51°F\nSunrise: 4:30pm\nSunset: 6:30am\nWeather generated by <a href="https://github.com/dtgibson/snowraven">SnowRaven</a>'
    );
  });

  it('Southern Hemisphere mirrors the moon — same input, ☁️🌓 header', () => {
    expect(formatWeather([NIGHT_OVERCAST], 'UTC', LAT_S)).toBe(
      '☁️🌓\nOvercast clouds\nTemperature: 54°F\nWind: Light breeze\nWind Direction: W\nCloud Cover: 100%\nHumidity: 88%\nDew point: 51°F\nSunrise: 4:30pm\nSunset: 6:30am\nWeather generated by <a href="https://github.com/dtgibson/snowraven">SnowRaven</a>'
    );
  });

  it('any night hour makes it a night block; phase comes from the FIRST hour', () => {
    expect(formatWeather([MIXED_DAY_FIRST, MIXED_NIGHT_SECOND], 'UTC', LAT_N)).toBe(
      '🌥️🌗\nBroken clouds\nTemperature: 55 - 62°F\nWind: Light breeze - Gentle breeze\nWind Direction: E - SE\nCloud Cover: 75 - 80%\nHumidity: 70 - 82%\nDew point: 50 - 52°F\nSunrise: 4:30pm\nSunset: 6:30am\nWeather generated by <a href="https://github.com/dtgibson/snowraven">SnowRaven</a>'
    );
  });

  it('a day dt on the same fixture drops the moon and changes nothing else', () => {
    const day = hr({
      dt: DT_DAY, temp: 54.0, humidity: 88, dew_point: 51.0, wind_speed: 5.0, wind_deg: 270,
      clouds: 100, weather: [{ id: 804, description: 'overcast clouds' }], sunrise: SR, sunset: SS,
    });
    const nightOut = formatWeather([NIGHT_OVERCAST], 'UTC', LAT_N);
    const dayOut = formatWeather([day], 'UTC', LAT_N);
    expect(dayOut.split('\n')[0]).toBe('☁️');
    expect(nightOut.split('\n')[0]).toBe('☁️🌗');
    expect(dayOut.split('\n').slice(1)).toEqual(nightOut.split('\n').slice(1));
  });

  it('latitude has no effect on a day block', () => {
    expect(formatWeather([CALM], 'UTC', LAT_S)).toBe(formatWeather([CALM], 'UTC', LAT_N));
  });
});

// ─── moonPhaseEmoji — lunarphase-js@2.0.3 port, pure-UTC Julian Day ──────────
// Timestamps from the oracle's "one timestamp per phase bin" section
// (lunation k=300 of the 2451550.1 reference epoch).

describe('moonPhaseEmoji', () => {
  const BIN_CASES: Array<[number, number, string, string]> = [
    // [age, unix ts, northern, southern]
    [0.9,  1712679233, '🌑', '🌑'], // New
    [3.7,  1712921153, '🌒', '🌘'], // Waxing Crescent
    [7.4,  1713240833, '🌓', '🌗'], // First Quarter
    [11.1, 1713560513, '🌔', '🌖'], // Waxing Gibbous
    [14.8, 1713880193, '🌕', '🌕'], // Full
    [18.5, 1714199873, '🌖', '🌔'], // Waning Gibbous
    [22.1, 1714510913, '🌗', '🌓'], // Last Quarter
    [25.8, 1714830593, '🌘', '🌒'], // Waning Crescent
    [28.8, 1715089793, '🌑', '🌑'], // wraps back to New past the last bound
  ];

  it.each(BIN_CASES)('age %f → Northern Hemisphere emoji', (_age, ts, north) => {
    expect(moonPhaseEmoji(ts, LAT_N)).toBe(north);
  });

  it.each(BIN_CASES)('age %f → Southern Hemisphere mirrors', (_age, ts, _north, south) => {
    expect(moonPhaseEmoji(ts, LAT_S)).toBe(south);
  });

  it('equator (lat 0) uses the Northern set', () => {
    expect(moonPhaseEmoji(1713560513, 0)).toBe('🌔');
  });
});

describe('formatLocalTime golden (FR-18)', () => {
  it('noon -> 12:30pm (America/New_York)', () => {
    expect(formatLocalTime(1714494600, 'America/New_York')).toBe('12:30pm');
  });
  it('midnight -> 12:15am (America/New_York)', () => {
    expect(formatLocalTime(1714450500, 'America/New_York')).toBe('12:15am');
  });
});

describe('bankersRound golden (round-half-to-even, FR-14)', () => {
  it('matches Python round() at .5 boundaries', () => {
    expect(bankersRound(0.5)).toBe(0);
    expect(bankersRound(1.5)).toBe(2);
    expect(bankersRound(2.5)).toBe(2);
    expect(bankersRound(3.5)).toBe(4);
    expect(bankersRound(51.5)).toBe(52);
    expect(bankersRound(54.3)).toBe(54);
    expect(bankersRound(0.4)).toBe(0);
    expect(bankersRound(1.6)).toBe(2);
  });
});
