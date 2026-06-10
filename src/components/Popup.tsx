// Popup orchestrator (reworked from the desktop WeatherTideSection). Inverts the
// desktop "Load-then-no-copy" model: it auto-runs on open, best-effort
// auto-copies weather within the activation window, and owns the full state
// machine from schema.md "Data Flow & State":
//
//   Phase 0  resolve keys           (FR-41)
//   Phase 1  read active tab + validate (FR-01..04)
//   Phase 2  key gate               (FR-41/42)
//   Phase 3  combined permission request (FR-43a/44)
//   Phase 4  shared eBird resolution (one fetchChecklist for both blocks)
//   Phase 5  timezone               (sync, FR-08/08a)
//   Phase 6  weather + tide in parallel (FR-35)
//   Phase 7  auto-copy weather      (reliable via clipboardWrite, FR-30/48a)
//
// No Load button, no combined copy button. The manual weather Copy button is the
// guaranteed copy path (FR-48a).

import { useCallback, useEffect, useRef, useState } from 'react';
import type { PageState, WeatherState, TideState, MissingKey } from '../lib/types';
import { storage } from '../lib/ext/storage';
import { readActiveTab } from '../lib/ext/activeTab';
import { requestApiPermissions, hasApiPermissions, API_ORIGINS } from '../lib/ext/permissions';
import { openOptions } from '../lib/ext/options';
import { copyText } from '../lib/ext/clipboard';
import { getWeather } from '../lib/weatherService';
import { getTide } from '../lib/tideService';
import { WeatherTidePanel } from './WeatherTidePanel';
import { Footer } from './Footer';
import { RavenMark, PinIcon, KeyIcon, ArrowRightIcon, ShieldIcon, CheckIcon } from './Icons';

function Header({ loc, sub }: { loc?: string; sub?: string }) {
  return (
    <div className="sr-pop-head">
      <span className="sr-brand">
        <span className="sr-mark" aria-hidden="true">
          <RavenMark size={18} />
        </span>
        SnowRaven Mini
      </span>
      {loc && (
        <span className="sr-pop-context">
          <span className="sr-loc">{loc}</span>
          {sub}
        </span>
      )}
    </div>
  );
}

export function Popup() {
  const [pageState, setPageState] = useState<PageState>('resolving');
  const [missingKeys, setMissingKeys] = useState<MissingKey[]>([]);
  const [weather, setWeather] = useState<WeatherState>({ status: 'loading' });
  const [tide, setTide] = useState<TideState>({ status: 'loading' });
  const [locName, setLocName] = useState<string | undefined>(undefined);
  const [liveMsg, setLiveMsg] = useState('');
  // Whether the weather block was auto-copied this open — drives the visible
  // "Copied to clipboard" confirmation in the weather slot.
  const [autoCopied, setAutoCopied] = useState(false);

  // The validated checklist ID for this open (set during Phase 1).
  const checklistIdRef = useRef<string | null>(null);
  // Auto-copy fires at most once per popup open (FR-30).
  const autoCopiedRef = useRef(false);
  // Guard against the StrictMode double-invoke / re-runs.
  const startedRef = useRef(false);

  // Write into the (previously settled) live region so AT announces it.
  const announce = useCallback((msg: string) => {
    setLiveMsg('');
    // next microtask: re-populate so a changed value is announced
    queueMicrotask(() => setLiveMsg(msg));
  }, []);

  // Phase 4-7: the shared lookup. Weather and tide run in parallel; each catches
  // its own error so neither rejects the other (FR-35).
  const runLookup = useCallback(
    async (checklistId: string) => {
      setWeather({ status: 'loading' });
      setTide({ status: 'loading' });
      setAutoCopied(false);

      const weatherP = getWeather(checklistId).then(
        async (res) => {
          setLocName(res.loc_name);
          setWeather({ status: 'success', formatted: res.formatted });
          // Phase 7 — best-effort auto-copy weather ONLY, once per open (FR-30/31/48a).
          if (!autoCopiedRef.current) {
            autoCopiedRef.current = true;
            const ok = await copyText(res.formatted);
            if (ok) setAutoCopied(true);
            announce(
              ok
                ? 'Weather copied to clipboard'
                : 'Weather ready. Use the Copy weather button to copy.',
            );
          }
        },
        (err: unknown) => {
          const message = err instanceof Error && err.message ? err.message : 'Something went wrong. Please try again.';
          setWeather({ status: 'error', message });
        },
      );

      const tideP = getTide(checklistId).then(
        (res) => {
          if (res.loc_name) setLocName((prev) => prev ?? res.loc_name);
          if (res.status === 'ok' && res.formatted) {
            setTide({ status: 'ok', formatted: res.formatted });
          } else if (res.status === 'too-far' || res.status === 'outside-us') {
            setTide({
              status: res.status,
              station: res.station ?? { id: '', name: '' },
              distanceMi: res.distanceMi ?? 0,
            });
          } else {
            setTide({ status: 'unavailable' });
          }
        },
        // A getTide throw before the getJson seam (missing eBird key, or any
        // fetchChecklist throw) surfaces as the tide 'error' state (FR-37a).
        () => {
          setTide({ status: 'error' });
        },
      );

      await Promise.allSettled([weatherP, tideP]);
    },
    [announce],
  );

  // The override re-runs the tide lookup with force=true (FR-39), reusing the
  // same nearest station (no re-selection).
  const onTideOverride = useCallback(() => {
    const id = checklistIdRef.current;
    if (!id) return;
    setTide({ status: 'loading' });
    getTide(id, true).then(
      (res) => {
        if (res.status === 'ok' && res.formatted) {
          setTide({ status: 'ok', formatted: res.formatted });
        } else {
          setTide({ status: 'unavailable' });
        }
      },
      () => setTide({ status: 'error' }),
    );
  }, []);

  // Ensure host permission (requested from THIS click — chrome.permissions.request
  // needs a user gesture and CANNOT fire from popup auto-load, which only throws),
  // then run the lookup. Shared by the Grant button (permission-blocked) and the
  // "Show weather anyway" button (checklist-view).
  const proceed = useCallback(async () => {
    const id = checklistIdRef.current;
    if (!id) return;
    const granted = await requestApiPermissions();
    if (!granted) {
      setPageState('permission-blocked');
      return;
    }
    setPageState('result');
    void runLookup(id);
  }, [runLookup]);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    (async () => {
      try {
        // Phase 0 — resolve keys + Phase 1 — read active tab (concurrently).
        const [ebird, openweather, tab] = await Promise.all([
          storage.getApiKey('ebird'),
          storage.getApiKey('openweather'),
          readActiveTab(),
        ]);

        // Phase 1 gate — no eBird checklist on this page (FR-04).
        if (tab.pageType === 'other' || !tab.checklistId) {
          setPageState('not-on-checklist');
          return;
        }
        checklistIdRef.current = tab.checklistId;

        // Phase 2 — key gate (FR-41/42). Both keys are required; the nudge names
        // every missing key.
        const missing: MissingKey[] = [];
        if (!ebird) missing.push('ebird');
        if (!openweather) missing.push('openweather');
        if (missing.length) {
          setMissingKeys(missing);
          setPageState('missing-keys');
          return;
        }

        // On the checklist VIEW page you can't paste a comment — point to the
        // edit page, but offer "show weather anyway" (the subID is in this URL
        // too). The lookup then waits for that button, which is also the gesture
        // that drives the permission request.
        if (tab.pageType === 'checklist-view') {
          setPageState('checklist-view');
          return;
        }

        // Phase 3 — edit page (the paste target). If host permission is already
        // granted, run now; otherwise show the Grant button (the request needs a
        // click — it cannot fire from popup auto-load).
        if (await hasApiPermissions()) {
          setPageState('result');
          void runLookup(tab.checklistId);
        } else {
          setPageState('permission-blocked');
        }
      } catch {
        // Never leave the popup spinning on an unexpected error.
        setWeather({ status: 'error', message: 'Something went wrong. Please try again.' });
        setTide({ status: 'error' });
        setPageState('result');
      }
    })();
  }, [runLookup]);

  // ── Render ──────────────────────────────────────────────────────────
  return (
    <div className="sr-popup">
      {pageState === 'not-on-checklist' && <Header />}
      {pageState === 'checklist-view' && <Header />}
      {pageState === 'missing-keys' && <Header />}
      {pageState === 'permission-blocked' && <Header />}
      {(pageState === 'resolving' || pageState === 'loading' || pageState === 'result') && (
        <Header loc={locName} />
      )}

      <div className="sr-pop-body">
        {/* Shared polite live region (FR-48/48a) — empty until an event writes it. */}
        <span className="sr-only" role="status" aria-live="polite">
          {liveMsg}
        </span>

        {(pageState === 'resolving' || pageState === 'loading') && (
          <div className="sr-status-row" role="status">
            <span className="sr-spinner" aria-hidden="true" />
            Loading weather &amp; tide…
          </div>
        )}

        {pageState === 'not-on-checklist' && (
          <div className="sr-info-state">
            <span className="sr-ico" aria-hidden="true">
              <PinIcon />
            </span>
            <h3>No checklist on this page</h3>
            <p>Open a checklist’s Edit Comments page to get its weather.</p>
          </div>
        )}

        {pageState === 'checklist-view' && (
          <div className="sr-info-state">
            <span className="sr-ico" aria-hidden="true">
              <PinIcon />
            </span>
            <h3>You’re on the checklist page</h3>
            <p>
              To paste the weather into a comment, open this checklist’s{' '}
              <span className="sr-strong">Edit Comments</span> page, or show it here anyway.
            </p>
            <div className="sr-cv-actions">
              <button type="button" className="sr-btn-primary" onClick={proceed}>
                Show weather anyway
              </button>
              {checklistIdRef.current && (
                <a
                  className="sr-link-action"
                  href={`https://ebird.org/edit/effort?subID=${checklistIdRef.current}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Open Edit Comments
                  <ArrowRightIcon />
                </a>
              )}
            </div>
          </div>
        )}

        {pageState === 'missing-keys' && (
          <div className="sr-notice sr-notice-neutral">
            <span className="sr-ico" aria-hidden="true">
              <KeyIcon />
            </span>
            <div className="sr-nudge-body">
              <div>
                {missingKeys.includes('ebird') && missingKeys.includes('openweather') ? (
                  <>
                    <span className="sr-strong">eBird and OpenWeather API keys</span> aren’t set yet.
                    Add them once and a single click does the lookup.
                  </>
                ) : missingKeys.includes('ebird') ? (
                  <>
                    <span className="sr-strong">eBird API key</span> isn’t set yet. Add it once and a
                    single click does the lookup.
                  </>
                ) : (
                  <>
                    <span className="sr-strong">OpenWeather API key</span> isn’t set yet. Add it once
                    and a single click does the lookup.
                  </>
                )}
              </div>
              <div className="sr-nudge-actions">
                <span className="sr-nudge-meta">
                  {missingKeys.includes('ebird') && !missingKeys.includes('openweather') && (
                    <>OpenWeather key: <span className="sr-strong">set ✓</span></>
                  )}
                  {missingKeys.includes('openweather') && !missingKeys.includes('ebird') && (
                    <>eBird key: <span className="sr-strong">set ✓</span></>
                  )}
                </span>
                <button type="button" className="sr-link-action" onClick={openOptions}>
                  Go to Settings
                  <ArrowRightIcon />
                </button>
              </div>
            </div>
          </div>
        )}

        {pageState === 'permission-blocked' && (
          <div className="sr-perm">
            <div className="sr-lead">
              <span className="sr-ico" aria-hidden="true">
                <ShieldIcon />
              </span>
              <div>
                <h3>Allow SnowRaven Mini to reach these?</h3>
                <p>
                  It needs to call eBird, OpenWeather, and NOAA directly from your browser, nothing
                  else.
                </p>
              </div>
            </div>
            <ul className="sr-host-list">
              {API_ORIGINS.map((origin) => (
                <li key={origin}>
                  <span className="sr-dot" aria-hidden="true" />
                  {new URL(origin.replace('/*', '')).hostname}
                </li>
              ))}
            </ul>
            <button type="button" className="sr-btn-primary" onClick={proceed}>
              <CheckIcon size={15} />
              Grant access
            </button>
          </div>
        )}

        {pageState === 'result' && (
          <WeatherTidePanel
            weather={weather}
            tide={tide}
            autoCopied={autoCopied}
            onTideOverride={onTideOverride}
            announce={announce}
          />
        )}
      </div>
      <Footer />
    </div>
  );
}
