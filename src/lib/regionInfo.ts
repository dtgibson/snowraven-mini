// eBird region-info lookup (ref/region/info/{locId}) — the bounding-box-centre
// PRIMARY coordinate source. REWORKED from the desktop's regionInfo.ts: the
// networkCache cachedGet wrapper is dropped (the popup is single-shot, which
// trivially satisfies FR-07 "failed region-info not cached"), so the function
// is made async and returns the inner closure's result directly. tauriFetch ->
// extFetch. The fetch/parse/return logic is preserved verbatim.

import { extFetch } from './ext/http';

const EBIRD_BASE = 'https://api.ebird.org/v2';

export interface RegionInfo {
  /** Human-readable place name ('' when eBird has none). */
  name: string;
  /** Bounding-box centre, when eBird supplies bounds. */
  lat: number | null;
  lng: number | null;
}

export async function getRegionInfo(locId: string, ebirdKey: string): Promise<RegionInfo | null> {
  const res = await extFetch(`${EBIRD_BASE}/ref/region/info/${locId}`, {
    headers: { 'X-eBirdApiToken': ebirdKey },
  });
  if (!res.ok) return null;
  const data = (await res.json()) as { result?: string; name?: string; bounds?: Record<string, number> };
  const b = data.bounds ?? {};
  const hasBounds = 'minX' in b && 'maxX' in b && 'minY' in b && 'maxY' in b;
  return {
    name: data.result || data.name || '',
    lat: hasBounds ? (b['minY'] + b['maxY']) / 2 : null,
    lng: hasBounds ? (b['minX'] + b['maxX']) / 2 : null,
  };
}
