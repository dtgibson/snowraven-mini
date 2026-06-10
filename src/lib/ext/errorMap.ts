// NEW owner of the FR-36 status -> message mapping. No SnowRaven analog: the
// desktop surfaced err.detail/err.message with no status branching, and the
// 401/403 key-invalid strings do not exist anywhere in the SnowRaven frontend.
//
// Pure helper. Given a service and a non-OK res.status, returns the FR-36 string.
// Called from the reworked branches in weatherService.ts so the new strings live
// in ONE place (FR-36/FR-42). The 401/403 messages point the user at the Options
// page; 429 deliberately falls into the generic message (QA-36a).

export type ApiService = 'ebird' | 'openweather';

const EBIRD_GENERIC = 'Could not fetch checklist data. Please try again.';
const OWM_GENERIC = 'Weather data unavailable for this checklist.';

/**
 * Map a non-OK response status to the FR-36 user-facing message for the service.
 * - eBird 404            -> 'Checklist not found. Check the ID and try again.'
 * - eBird 401/403        -> 'eBird API key invalid. Check it in Settings.'
 * - OpenWeather 401/403  -> 'OpenWeather API key invalid. Check it in Settings.'
 * - any other non-OK     -> the service's generic message (incl. 429).
 */
export function mapStatusToMessage(service: ApiService, status: number): string {
  if (service === 'ebird') {
    if (status === 404) return 'Checklist not found. Check the ID and try again.';
    if (status === 401 || status === 403) return 'eBird API key invalid. Check it in Settings.';
    return EBIRD_GENERIC;
  }
  // openweather
  if (status === 401 || status === 403) return 'OpenWeather API key invalid. Check it in Settings.';
  return OWM_GENERIC;
}
