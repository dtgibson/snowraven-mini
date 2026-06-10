// Service test for the REWORKED tideService with global fetch + chrome.storage
// mocked. Covers the too-far classification (FR-22/FR-23): an inland US checklist
// resolves coordinates via the shared fetchChecklist, then classifyTideLocation
// returns 'too-far' (nearest station > TIDE_MAX_MILES) and getTide short-circuits
// to the notice WITHOUT firing any NOAA call (force=false). NOAA is keyless and
// never touched here.

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getTide } from './tideService';

// Central Kansas — far inland, inside the US bounding boxes, > 600 mi from the
// nearest bundled station (verified against the shipped JSON).
const KANSAS_LAT = 38.5;
const KANSAS_LNG = -98.0;

function installFetch() {
  globalThis.fetch = vi.fn(async (input: RequestInfo | URL) => {
    const url = typeof input === 'string' ? input : input.toString();
    if (url.includes('api.tidesandcurrents.noaa.gov')) {
      throw new Error('NOAA must NOT be called when the station is too far (force=false)');
    }
    if (url.includes('/product/checklist/view/')) {
      return {
        status: 200,
        ok: true,
        json: async () => ({ locId: 'L1', locName: 'Inland Marsh, KS', obsDt: '2026-05-31 07:42', durationHrs: 1 }),
      } as unknown as Response;
    }
    if (url.includes('/ref/region/info/')) {
      return {
        status: 200,
        ok: true,
        json: async () => ({
          result: 'Inland Marsh, KS',
          bounds: { minX: KANSAS_LNG, maxX: KANSAS_LNG, minY: KANSAS_LAT, maxY: KANSAS_LAT },
        }),
      } as unknown as Response;
    }
    throw new Error(`unexpected url ${url}`);
  }) as unknown as typeof fetch;
}

beforeEach(() => {
  (globalThis as unknown as { chrome: unknown }).chrome = {
    storage: { local: { get: vi.fn().mockResolvedValue({ ebird: 'valid-key' }), set: vi.fn(), remove: vi.fn() } },
  };
  installFetch();
});

describe('getTide — too-far classification (FR-22/FR-23)', () => {
  it('returns too-far with the nearest station + distance, and does NOT call NOAA', async () => {
    const res = await getTide('S12345678');
    expect(res.status).toBe('too-far');
    expect(res.station).toBeDefined();
    expect(res.station!.id).toBeTruthy();
    expect(res.distanceMi).toBeGreaterThan(25); // beyond TIDE_MAX_MILES
    expect(res.formatted).toBeUndefined(); // no NOAA reading fetched
  });
});

describe('getTide — missing eBird key throws (FR-37a trigger #1)', () => {
  it('throws before any fetch when the eBird key is not configured', async () => {
    (globalThis as unknown as { chrome: { storage: { local: { get: ReturnType<typeof vi.fn> } } } }).chrome
      .storage.local.get = vi.fn().mockResolvedValue({});
    await expect(getTide('S12345678')).rejects.toThrow(/eBird API key not configured/);
  });
});
