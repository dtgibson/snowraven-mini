// Service tests for the REWORKED weatherService with global fetch + chrome.storage
// mocked. Covers:
//   - fetchChecklist happy path: checklist view + region-info coordinate resolution
//   - eBird 401 -> the NEW FR-36 'eBird API key invalid. Check it in Settings.' throw
// These exercise the seam swaps (extFetch, ext/storage) and the new errorMap branch
// without touching the network.

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { fetchChecklist } from './weatherService';

type FetchHandler = (url: string, init?: RequestInit) => { status: number; ok: boolean; json: () => Promise<unknown> };

function installFetch(handler: FetchHandler) {
  globalThis.fetch = vi.fn(async (input: RequestInfo | URL) => {
    const url = typeof input === 'string' ? input : input.toString();
    const r = handler(url);
    return {
      status: r.status,
      ok: r.ok,
      json: r.json,
    } as unknown as Response;
  }) as unknown as typeof fetch;
}

beforeEach(() => {
  // Minimal chrome.storage.local stub (weatherService only reads keys in getWeather,
  // but fetchChecklist takes the key as an argument; stub anyway for safety).
  (globalThis as unknown as { chrome: unknown }).chrome = {
    storage: { local: { get: vi.fn().mockResolvedValue({}), set: vi.fn(), remove: vi.fn() } },
  };
});

describe('fetchChecklist (REWORKED — seam-swapped)', () => {
  it('resolves obs_dt / loc_name / lat / lng from checklist view + region-info', async () => {
    installFetch((url) => {
      if (url.includes('/product/checklist/view/')) {
        return {
          status: 200,
          ok: true,
          json: async () => ({
            locId: 'L99',
            locName: 'Pillar Point Harbor',
            obsDt: '2026-05-31 07:42',
            durationHrs: 1.5,
          }),
        };
      }
      if (url.includes('/ref/region/info/')) {
        return {
          status: 200,
          ok: true,
          // bounding box centre -> lat=(minY+maxY)/2, lng=(minX+maxX)/2
          json: async () => ({
            result: 'Pillar Point Harbor',
            bounds: { minX: -122.5, maxX: -122.49, minY: 37.49, maxY: 37.51 },
          }),
        };
      }
      throw new Error(`unexpected url ${url}`);
    });

    const data = await fetchChecklist('S12345678', 'valid-key');
    expect(data.obs_dt).toBe('2026-05-31 07:42');
    expect(data.loc_name).toBe('Pillar Point Harbor');
    expect(data.duration_hrs).toBe(1.5);
    expect(data.lat).toBeCloseTo(37.5, 5);
    expect(data.lng).toBeCloseTo(-122.495, 5);
  });

  it('maps an eBird 401 to the FR-36 key-invalid message (NEW branch)', async () => {
    installFetch((url) => {
      if (url.includes('/product/checklist/view/')) {
        return { status: 401, ok: false, json: async () => ({}) };
      }
      throw new Error(`unexpected url ${url}`);
    });

    await expect(fetchChecklist('S12345678', 'bad-key')).rejects.toThrow(
      'eBird API key invalid. Check it in Settings.',
    );
  });

  it('maps an eBird 404 to the checklist-not-found message (ported branch)', async () => {
    installFetch((url) => {
      if (url.includes('/product/checklist/view/')) {
        return { status: 404, ok: false, json: async () => ({}) };
      }
      throw new Error(`unexpected url ${url}`);
    });

    await expect(fetchChecklist('S404', 'valid-key')).rejects.toThrow(
      'Checklist not found. Check the ID and try again.',
    );
  });
});
