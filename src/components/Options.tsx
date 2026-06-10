// Options page (FR-40). Two masked/secret API-key fields (eBird, OpenWeather),
// each with a reveal toggle and a "Get a free key ↗" link, a filled-green Save
// button with a "Saved" confirmation, and the "Keys stay on this device."
// privacy line. Backed by ext/storage (chrome.storage.local). No component
// library — plain TSX + the design-system classes. See design-spec.md §Options.

import { useEffect, useState } from 'react';
import { storage } from '../lib/ext/storage';
import { RavenMark, EyeIcon, EyeOffIcon, CheckIcon, LockIcon } from './Icons';
import { Footer } from './Footer';

interface KeyFieldProps {
  id: string;
  label: string;
  getKeyHref: string;
  help: string;
  value: string;
  onChange: (v: string) => void;
}

function KeyField({ id, label, getKeyHref, help, value, onChange }: KeyFieldProps) {
  const [revealed, setRevealed] = useState(false);
  const helpId = `${id}-help`;
  return (
    <div className="sr-field">
      <div className="sr-field-top">
        <label htmlFor={id}>{label}</label>
        <a className="sr-getkey" href={getKeyHref} target="_blank" rel="noreferrer">
          Get a free key ↗
        </a>
      </div>
      <div className="sr-input-wrap">
        <input
          id={id}
          type={revealed ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete="off"
          spellCheck={false}
          aria-describedby={helpId}
        />
        <button
          type="button"
          className="sr-reveal-btn"
          onClick={() => setRevealed((r) => !r)}
          aria-label={`${revealed ? 'Hide' : 'Show'} ${label}`}
          aria-pressed={revealed}
        >
          {revealed ? <EyeOffIcon /> : <EyeIcon />}
        </button>
      </div>
      <p className="sr-help" id={helpId}>
        {help}
      </p>
    </div>
  );
}

export function Options() {
  const [ebird, setEbird] = useState('');
  const [openweather, setOpenweather] = useState('');
  const [saved, setSaved] = useState(false);

  // Load the stored keys on mount.
  useEffect(() => {
    void Promise.all([storage.getApiKey('ebird'), storage.getApiKey('openweather')]).then(
      ([e, o]) => {
        setEbird(e ?? '');
        setOpenweather(o ?? '');
      },
    );
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Empty -> delete (matches the empty-string -> null storage contract).
    await Promise.all([
      ebird.trim() ? storage.setApiKey('ebird', ebird.trim()) : storage.deleteApiKey('ebird'),
      openweather.trim()
        ? storage.setApiKey('openweather', openweather.trim())
        : storage.deleteApiKey('openweather'),
    ]);
    setSaved(true);
    setTimeout(() => setSaved(false), 2400);
  };

  return (
    <div className="sr-options-page">
      <div className="sr-options">
        <div className="sr-options-head">
          <span className="sr-brand">
            <span className="sr-mark" aria-hidden="true">
              <RavenMark size={22} />
            </span>
            SnowRaven Mini Settings
          </span>
          <p>Bring your own free API keys. SnowRaven Mini has no account and no server.</p>
        </div>
        <div className="sr-options-body">
          <form onSubmit={onSubmit}>
            <KeyField
              id="ebird-key"
              label="eBird API key"
              getKeyHref="https://ebird.org/api/keygen"
              help="Resolves the checklist’s location and time. Needed for both weather and tide."
              value={ebird}
              onChange={setEbird}
            />
            <KeyField
              id="ow-key"
              label="OpenWeather API key"
              getKeyHref="https://openweathermap.org/api"
              help="Fetches historical weather for the checklist’s hour. Tide (NOAA) needs no key."
              value={openweather}
              onChange={setOpenweather}
            />

            <div className="sr-options-foot">
              <button type="submit" className="sr-btn-primary" id="save-btn">
                Save keys
              </button>
              <span className="sr-save-confirm" role="status" aria-live="polite">
                {saved && (
                  <>
                    <CheckIcon size={15} /> Saved
                  </>
                )}
              </span>
            </div>

            <p className="sr-privacy-note">
              <span className="sr-ico" aria-hidden="true">
                <LockIcon />
              </span>
              Keys stay on this device. They’re sent only to eBird and OpenWeather as your request’s
              authentication, nowhere else.
            </p>
          </form>
        </div>
        <Footer />
      </div>
    </div>
  );
}
