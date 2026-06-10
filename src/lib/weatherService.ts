// Weather service — REWORKED from the desktop's tauri/weatherService.ts. The
// fetchChecklist / parseLocalDateTimeInZone / getWeather logic is preserved
// EXCEPT for the named seam swaps and the NEW FR-36 401/403 status branches:
//   - tauriFetch                -> extFetch (./ext/http)
//   - storage                   -> ./ext/storage
//   - invoke('get_timezone')    -> getTimezone(lat, lng) (./timezone, synchronous)
//   - NEW: eBird 401/403 and OWM 401/403 emit the FR-36 key-invalid strings via
//          ./ext/errorMap BEFORE falling through to the existing generic throw.
// formatWeather output stays byte-identical (FR-13..FR-19).

import { extFetch } from './ext/http';
import { storage } from './ext/storage';
import { getTimezone } from './timezone';
import { mapStatusToMessage } from './ext/errorMap';
import { formatWeather, type HourlyResponse } from './weatherFormatter';
import { getRegionInfo, type RegionInfo } from './regionInfo';

const EBIRD_BASE = 'https://api.ebird.org/v2';
const OWM_BASE = 'https://api.openweathermap.org/data/3.0';

export interface ChecklistData {
  obs_dt: string;
  loc_name: string;
  lat: number;
  lng: number;
  duration_hrs: number;
}

// Exported so the tide service reuses the exact same checklist resolution
// (lat/lng + obs_dt + duration) rather than re-implementing it.
export async function fetchChecklist(checklistId: string, ebirdKey: string): Promise<ChecklistData> {
  const headers = { 'X-eBirdApiToken': ebirdKey };

  const res = await extFetch(`${EBIRD_BASE}/product/checklist/view/${checklistId}`, { headers });
  if (res.status === 404) throw Object.assign(new Error(mapStatusToMessage('ebird', 404)), { status: 400 });
  // NEW FR-36 branch: detect an invalid/expired eBird key before the generic throw.
  if (res.status === 401 || res.status === 403) {
    throw Object.assign(new Error(mapStatusToMessage('ebird', res.status)), { status: 502 });
  }
  if (!res.ok) throw Object.assign(new Error(mapStatusToMessage('ebird', res.status)), { status: 502 });
  const data = await res.json() as Record<string, unknown>;

  const locId = data['locId'] as string;
  let locName = (data['locName'] as string | undefined) ?? '';
  let lat: number | null = null;
  let lng: number | null = null;

  // Primary: bounding box centre from region info (best-effort, never cached).
  let region: RegionInfo | null = null;
  try { region = await getRegionInfo(locId, ebirdKey); } catch { /* best-effort — fall through to the GPS fallbacks */ }
  if (region) {
    if (!locName) locName = region.name;
    if (region.lat !== null && region.lng !== null) {
      lat = region.lat;
      lng = region.lng;
    }
  }

  // Fallback: exact GPS pin from product/lists
  if (lat === null || lng === null) {
    const listsRes = await extFetch(`${EBIRD_BASE}/product/lists/${locId}?maxResults=1`, { headers });
    if (listsRes.ok) {
      const listsData = await listsRes.json() as unknown;
      const first = Array.isArray(listsData) ? listsData[0] : listsData;
      if (first) {
        const loc = (first as Record<string, unknown>)['loc'] ?? (first as Record<string, unknown>)['location'] ?? {};
        const locObj = loc as Record<string, unknown>;
        if (!locName) locName = (locObj['name'] as string | undefined) ?? '';
        lat = (locObj['lat'] ?? locObj['latitude']) as number | null;
        lng = ((locObj['lng'] ?? locObj['longitude'] ?? locObj['lon']) as number | null);
      }
    }
  }

  // Last resort: recent observations
  if (lat === null || lng === null) {
    const obsRes = await extFetch(`${EBIRD_BASE}/data/obs/${locId}/recent?back=365`, { headers });
    if (obsRes.ok) {
      const obsList = await obsRes.json() as Array<Record<string, unknown>>;
      if (obsList.length > 0) {
        lat = obsList[0]['lat'] as number;
        lng = obsList[0]['lng'] as number;
      }
    }
  }

  if (lat === null || lng === null) {
    throw Object.assign(new Error(`Could not find coordinates for location ${locId}.`), { status: 502 });
  }

  return {
    obs_dt: data['obsDt'] as string,
    loc_name: locName || locId,
    lat,
    lng,
    duration_hrs: (data['durationHrs'] as number | undefined) ?? 1,
  };
}

async function fetchHistorical(lat: number, lng: number, dt: number, owmKey: string): Promise<HourlyResponse> {
  const url = `${OWM_BASE}/onecall/timemachine?lat=${lat}&lon=${lng}&dt=${dt}&appid=${owmKey}&units=imperial`;
  const res = await extFetch(url);
  // NEW FR-36 branch: detect an invalid/expired OpenWeather key before the generic throw.
  if (res.status === 401 || res.status === 403) {
    throw Object.assign(new Error(mapStatusToMessage('openweather', res.status)), { status: 502 });
  }
  if (!res.ok) throw Object.assign(new Error(mapStatusToMessage('openweather', res.status)), { status: 502 });
  return res.json() as Promise<HourlyResponse>;
}

// Parse "YYYY-MM-DD HH:MM" or "YYYY-MM-DD" as local time in the given timezone,
// return Unix timestamp in milliseconds. Uses iterative convergence to handle DST.
function parseLocalDateTimeInZone(dtStr: string, tzName: string): number {
  const normalized = dtStr.length === 10 ? `${dtStr} 00:00` : dtStr;
  const [datePart, timePart] = normalized.split(' ');
  const [year, month, day] = datePart.split('-').map(Number);
  const [hour, minute] = timePart.split(':').map(Number);

  // Start with a UTC guess and iterate until local time matches
  let utcMs = Date.UTC(year, month - 1, day, hour, minute);
  for (let i = 0; i < 3; i++) {
    const fmt = new Intl.DateTimeFormat('en-CA', {
      timeZone: tzName,
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', hour12: false,
    });
    const parts = fmt.formatToParts(new Date(utcMs));
    const get = (t: string) => parseInt(parts.find(p => p.type === t)!.value, 10);
    const localHour = get('hour') === 24 ? 0 : get('hour');
    const localMin = get('minute');
    const localYear = get('year');
    const localMonth = get('month');
    const localDay = get('day');

    const diffMs =
      (year - localYear) * 365.25 * 86400000 +
      (month - localMonth) * 30 * 86400000 +
      (day - localDay) * 86400000 +
      (hour - localHour) * 3600000 +
      (minute - localMin) * 60000;

    if (Math.abs(diffMs) < 60000) break;
    utcMs += diffMs;
  }
  return utcMs;
}

export interface WeatherResult {
  formatted: string;
  checklist_id: string;
  loc_name: string;
  obs_dt: string;
}

export async function getWeather(checklistId: string): Promise<WeatherResult> {
  const [ebirdKey, owmKey] = await Promise.all([
    storage.getApiKey('ebird'),
    storage.getApiKey('openweather'),
  ]);

  if (!ebirdKey || !owmKey) {
    throw Object.assign(
      new Error('API key not configured. Add it in Settings.'),
      { status: 500, detail: 'API key not configured. Add it in Settings.' }
    );
  }

  const checklist = await fetchChecklist(checklistId, ebirdKey);
  const tzName: string = getTimezone(checklist.lat, checklist.lng);

  const obsDtMs = parseLocalDateTimeInZone(checklist.obs_dt, tzName);
  const startTs = Math.floor(obsDtMs / 1000);
  const durationMs = (checklist.duration_hrs || 1) * 3600 * 1000;
  const endTs = Math.floor((obsDtMs + durationMs) / 1000);

  const timestamps = startTs === endTs ? [startTs] : [startTs, endTs];

  const hourlyResponses = await Promise.all(
    timestamps.map(ts => fetchHistorical(checklist.lat, checklist.lng, ts, owmKey))
  );

  return {
    formatted: formatWeather(hourlyResponses, tzName),
    checklist_id: checklistId,
    loc_name: checklist.loc_name,
    obs_dt: checklist.obs_dt,
  };
}
