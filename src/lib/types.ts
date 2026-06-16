// Shared UI state types for the popup. The ported tide SERVICE returns four
// statuses ('ok'|'too-far'|'outside-us'|'unavailable'); the UI adds a fifth,
// 'error', produced ONLY when getTide throws before the getJson seam — a
// documented divergence from the service union (FR-37a).

import type { ApiKeyService } from './ext/storage';

/** UI-layer tide status: the service's four states plus the UI 'error' (FR-37a). */
export type TideStatus = 'ok' | 'too-far' | 'outside-us' | 'unavailable' | 'error';

/** Top-level popup state (mutually exclusive). */
export type PageState =
  | 'resolving'          // key/tab status not yet known — never "missing"
  | 'not-on-checklist'   // FR-04
  | 'checklist-view'     // on the /checklist/ view page — offer edit-page link or "show anyway"
  | 'missing-keys'       // FR-41/42
  | 'permission-blocked' // FR-44
  | 'loading'            // FR-35 — nothing resolved yet
  | 'result';            // renders the two independent sub-machines

/** Key resolution status. null === resolving (FR-41), never missing. */
export interface KeyStatus {
  ebird: string | null;
  openweather: string | null;
}

/** Which required keys are missing (drives the FR-41 per-key nudges). */
export type MissingKey = ApiKeyService;

/** Weather sub-machine. */
export type WeatherState =
  | { status: 'loading' }
  | { status: 'success'; formatted: string }
  | { status: 'error'; message: string };

/** Tide sub-machine. Carries the notice/override context for too-far/outside-us. */
export type TideState =
  | { status: 'loading' }
  | { status: 'ok'; formatted: string; body: string }
  | {
      status: 'too-far' | 'outside-us';
      station: { id: string; name: string };
      distanceMi: number;
    }
  | { status: 'unavailable' }
  | { status: 'error' };
