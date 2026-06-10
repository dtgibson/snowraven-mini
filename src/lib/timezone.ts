// In-browser coordinate -> IANA timezone, the extension replacement for the
// desktop's `invoke('get_timezone')` (weatherService.ts:150 / src-tauri lib.rs).
// Backed by @photostructure/tz-lookup: synchronous, dependency-free, with
// bundled boundary data and no WASM/init step — so getWeather can compute
// startTs/endTs BEFORE the OpenWeather fetch (FR-08a).
//
// ARGUMENT ORDER (the #1 silent-bug risk): the desktop calls get_tz_name(lng, lat),
// but @photostructure/tz-lookup takes (latitude, longitude). The getTimezone(lat, lng)
// seam therefore feeds (lat, lng) straight through in library order — DO NOT copy
// the desktop's (lng, lat) order.
//
// UTC fallback (FR-08): a null / empty / thrown result coerces to 'UTC' so
// weather still formats.

import tzlookup from '@photostructure/tz-lookup';

/** Resolve an IANA timezone name for the coordinates. Synchronous. UTC fallback. */
export function getTimezone(lat: number, lng: number): string {
  try {
    const zone = tzlookup(lat, lng);
    return zone && zone.length > 0 ? zone : 'UTC';
  } catch {
    return 'UTC';
  }
}
