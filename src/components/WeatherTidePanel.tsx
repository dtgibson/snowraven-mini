// Single-checklist view (reworked from the desktop WeatherTidePanel): the
// weather block + its manual Copy button, and the five tide states each with
// their own affordance. Drops the desktop A/B badge, IdentityHeader,
// ReconciliationNote and the combined copy button (FR-32). All color via
// var(--sr-*). See pipeline/checklist-weather/design-spec.md.

import { useState } from 'react';
import type { WeatherState, TideState } from '../lib/types';
import { copyText } from '../lib/ext/clipboard';
import { tideTooFarNotice, tideOverrideLabel } from '../lib/tideNotice';
import { openOptions } from '../lib/ext/options';
import { CopyIcon, CheckIcon, AlertIcon } from './Icons';

// A monospace output block — the MonoBlock pattern, white-space: pre so wrapping
// never alters the bytes (FR-34).
function MonoBlock({ text }: { text: string }) {
  return <pre className="sr-mono">{text}</pre>;
}

// The eyebrow label + (optional) per-block Copy button on one space-between row.
// The Copy button flips to "Copied!" for ~2000 ms (FR-33) and announces via the
// shared polite live region (FR-48).
function BlockEyebrow({
  label,
  copyLabel,
  ariaLabel,
  onCopy,
}: {
  label: string;
  copyLabel?: string;
  ariaLabel?: string;
  onCopy?: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const handle = () => {
    if (!onCopy) return;
    onCopy();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="sr-eyebrow-row">
      <span className="sr-eyebrow">{label}</span>
      {onCopy && (
        <button
          type="button"
          className={`sr-btn-copy${copied ? ' is-copied' : ''}`}
          onClick={handle}
          aria-label={ariaLabel}
        >
          {copied ? <CheckIcon /> : <CopyIcon />}
          <span className="label">{copied ? 'Copied!' : (copyLabel ?? 'Copy')}</span>
        </button>
      )}
    </div>
  );
}

export interface WeatherTidePanelProps {
  weather: WeatherState;
  tide: TideState;
  /** Re-run the tide lookup with force=true (FR-39). */
  onTideOverride: () => void;
  /** Announce a transient message via the shared polite live region (FR-48). */
  announce: (msg: string) => void;
  /** True when the weather block was auto-copied to the clipboard this open. */
  autoCopied: boolean;
}

export function WeatherTidePanel({ weather, tide, autoCopied, onTideOverride, announce }: WeatherTidePanelProps) {
  const weatherOk = weather.status === 'success';
  const tideOk = tide.status === 'ok';

  return (
    <>
      {/* ── Weather slot ─────────────────────────────────────────────── */}
      <div>
        <BlockEyebrow
          label="Weather"
          ariaLabel="Copy weather to clipboard"
          onCopy={
            weatherOk
              ? () => {
                  void copyText(weather.formatted).then((ok) => {
                    if (ok) announce('Weather copied to clipboard');
                  });
                }
              : undefined
          }
        />
        {weather.status === 'loading' && (
          <div className="sr-status-row" role="status">
            <span className="sr-spinner" aria-hidden="true" />
            Loading weather…
          </div>
        )}
        {weather.status === 'success' && <MonoBlock text={weather.formatted} />}
        {weather.status === 'success' && autoCopied && (
          <div className="sr-copied-banner">
            <CheckIcon size={14} />
            <span>Copied to clipboard. Paste it into your checklist comment.</span>
          </div>
        )}
        {weather.status === 'error' && (
          <div className="sr-alert" role="alert">
            <span className="sr-ico" aria-hidden="true">
              <AlertIcon />
            </span>
            <div>
              <div className="sr-title">{weather.message}</div>
              <div className="sr-sub">
                <button type="button" className="sr-link-alert" onClick={openOptions}>
                  Open Settings →
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Tide slot ────────────────────────────────────────────────── */}
      <div>
        <BlockEyebrow
          label="Tide"
          ariaLabel="Copy tide to clipboard"
          onCopy={
            tideOk
              ? () => {
                  void copyText(tide.formatted).then((ok) => {
                    if (ok) announce('Tide copied to clipboard');
                  });
                }
              : undefined
          }
        />
        {tide.status === 'loading' && (
          <div className="sr-status-row" role="status">
            <span className="sr-spinner" aria-hidden="true" />
            Loading tide…
          </div>
        )}
        {tide.status === 'ok' && <MonoBlock text={tide.formatted} />}
        {(tide.status === 'too-far' || tide.status === 'outside-us') && (
          <div className="sr-notice sr-notice-amber">
            <span className="sr-amber-text">
              <span className="sr-ico" aria-hidden="true">
                <AlertIcon size={15} />
              </span>
              <span>{tideTooFarNotice(tide.station.name, tide.distanceMi, tide.status)}</span>
            </span>
            <button
              type="button"
              className="sr-btn-ghost"
              onClick={onTideOverride}
              aria-label={
                tide.status === 'too-far'
                  ? 'Show the nearest tide station anyway'
                  : 'Show the nearest US tide station'
              }
            >
              {tideOverrideLabel(tide.status)}
            </button>
          </div>
        )}
        {tide.status === 'unavailable' && (
          <div className="sr-status-row" role="status">
            No tide reading available.
          </div>
        )}
        {tide.status === 'error' && (
          <div className="sr-status-row" role="status">
            <span className="sr-ico" aria-hidden="true">
              <AlertIcon size={14} />
            </span>
            Tide data unavailable right now.
          </div>
        )}
      </div>
    </>
  );
}
