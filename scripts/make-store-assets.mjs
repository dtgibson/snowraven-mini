// Generate the store listing image assets (npm run store:assets).
//
// Renders each asset as an exact-sized HTML document and screenshots it with
// the system headless Chromium, then flattens it through sharp so the PNG has
// no alpha channel (a Chrome Web Store requirement). The popup/options markup
// uses the real component classes from src/globals.css, so the screenshots show
// the genuine UI. Inter is embedded from store/assets/render/fonts/*.woff2 so
// the brand typeface renders even though it is not installed system-wide.
//
// Build-time only; nothing here ships in the extension bundle.
//   node scripts/make-store-assets.mjs

import { readFileSync, writeFileSync, mkdirSync, existsSync, rmSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import sharp from 'sharp';

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO = join(HERE, '..');
const RENDER = join(REPO, 'store', 'assets', 'render');
const OUT = join(REPO, 'store', 'assets');
const FONTS = join(RENDER, 'fonts');

const CHROMIUM = process.env.CHROMIUM || '/snap/bin/chromium';

mkdirSync(RENDER, { recursive: true });
mkdirSync(OUT, { recursive: true });

// ---- Inter, embedded so the render does not depend on a system install ----
function fontFace(weight, file) {
  const p = join(FONTS, file);
  if (!existsSync(p)) {
    console.warn(`! missing ${file} — Inter ${weight} will fall back`);
    return '';
  }
  const b64 = readFileSync(p).toString('base64');
  return `@font-face{font-family:Inter;font-style:normal;font-weight:${weight};font-display:block;src:url(data:font/woff2;base64,${b64}) format("woff2");}`;
}
const FONT_CSS = [
  fontFace(400, 'inter-400.woff2'),
  fontFace(700, 'inter-700.woff2'),
  fontFace(800, 'inter-800.woff2'),
].join('\n');

// ---- raven mark (brand/icon.svg artwork) ----
const RAVEN_PATHS = '<g transform="translate(4,4)" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"><path d="M16 7h.01"/><path d="M3.4 18H12a8 8 0 0 0 8-8V7a4 4 0 0 0-7.28-2.3L2 20"/><path d="m20 7 2 .5-2 .5"/><path d="M10 18v3"/><path d="M14 17.75V21"/><path d="M7 18a6 6 0 0 0 3.84-10.61"/></g>';
const tile = (s) => `<svg width="${s}" height="${s}" viewBox="0 0 32 32"><rect width="32" height="32" rx="7" fill="#2D8653"/>${RAVEN_PATHS}</svg>`;
const ico = (path, stroke, w = 2) => `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round">${path}</svg>`;
const CHECK = '<path d="M20 6 9 17l-5-5"/>';
const SHIELD = '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/>';
const PIN = '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>';
const KEY = '<circle cx="7.5" cy="15.5" r="3.5"/><path d="m10 13 6-6"/><path d="m14 5 3 3"/><path d="m17 8 2-2"/>';
const ALERT = '<path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z"/><path d="M12 9v4"/><path d="M12 17h.01"/>';
const LOCK = '<rect width="18" height="11" x="3" y="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>';
const EYE = '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>';

// ---- shared CSS: tokens (light + .dark), component classes, frame, promo ----
const CSS = `
${FONT_CSS}
:root{
  --sr-primary:#2d8653;--sr-primary-hover:#266f45;--sr-primary-fg:#fff;
  --sr-bg:#fff;--sr-fg:#0f1117;--sr-muted:#f4f4f5;--sr-muted-fg:#6b6b73;
  --sr-accent:#e8f5ee;--sr-accent-fg:#1a5c38;--sr-secondary:#f0faf4;
  --sr-border:#e4e4e7;--sr-input-border:#8a8a93;--sr-ring:#2d8653;
  --sr-warning-fg:#92400e;--sr-warning-bg:#fffbeb;--sr-warning-bd:#fde68a;
  --sr-mono-bg:#fafafa;--sr-radius:.5rem;
  --sr-font-sans:Inter,"Noto Sans","Noto Color Emoji",sans-serif;
  --sr-font-mono:"DejaVu Sans Mono","Noto Sans Mono","Noto Color Emoji",monospace;
  --canvas:linear-gradient(135deg,#f0faf4 0%,#ffffff 60%,#eef7f1 100%);
  --canvas-fg:#0f1117;--canvas-sub:#3f5247;--wm:#2D8653;
}
.dark{
  --sr-bg:#18181b;--sr-fg:#f4f4f5;--sr-muted:#27272a;--sr-muted-fg:#a1a1aa;
  --sr-accent:#052e16;--sr-accent-fg:#34d399;--sr-secondary:#064e3b;
  --sr-primary:#34d399;--sr-primary-fg:#052e16;
  --sr-border:#27272a;--sr-input-border:#8a8a93;--sr-ring:#34d399;
  --sr-warning-fg:#fde68a;--sr-warning-bg:#1c1002;--sr-warning-bd:#78350f;
  --sr-mono-bg:#1c1c1f;
  --canvas:linear-gradient(135deg,#10231a 0%,#18181b 60%,#0c1f17 100%);
  --canvas-fg:#f4f4f5;--canvas-sub:#a7c6b6;--wm:#34d399;
}
*{box-sizing:border-box}
html,body{margin:0;padding:0}
body{font-family:var(--sr-font-sans);-webkit-font-smoothing:antialiased}

/* ---- frame ---- */
.shot{position:relative;overflow:hidden;background:var(--canvas);color:var(--canvas-fg)}
.shot .wm{position:absolute;right:-90px;top:-70px;width:540px;height:540px;opacity:.06}
.copy{position:absolute;left:96px;top:50%;transform:translateY(-50%);max-width:440px}
.copy .kicker{display:inline-flex;align-items:center;gap:10px;font-size:1rem;font-weight:700;color:var(--sr-accent-fg);background:var(--sr-accent);border-radius:999px;padding:9px 18px;margin-bottom:28px}
.copy h3{font-size:3.25rem;line-height:1.05;font-weight:800;letter-spacing:-.03em;margin:0 0 22px}
.copy p{font-size:1.4rem;line-height:1.45;color:var(--canvas-sub);margin:0;font-weight:500}
.device{position:absolute;right:118px;top:50%;transform:translateY(-50%);border-radius:16px;box-shadow:0 40px 90px rgba(0,0,0,.22),0 8px 24px rgba(0,0,0,.12);overflow:hidden;border:1px solid var(--sr-border)}

/* ---- promo tile ---- */
.promo{position:relative;overflow:hidden;background:radial-gradient(120% 140% at 100% 0%,#f0faf4 0%,#ffffff 55%);font-family:var(--sr-font-sans)}
.promo .pad{position:absolute;inset:0;padding:30px 32px;display:flex;flex-direction:column;justify-content:space-between}
.promo .top{display:flex;align-items:center;gap:16px}
.promo .top .t{box-shadow:0 6px 16px rgba(45,134,83,.28);border-radius:14px;display:block}
.promo .word{font-size:1.7rem;font-weight:800;letter-spacing:-.02em;line-height:1.04;color:#0f1117}
.promo .tag{font-size:1.04rem;color:#3f5247;font-weight:600;line-height:1.3;max-width:23ch}
.promo .peek{position:absolute;right:-12px;bottom:-14px;width:212px;transform:rotate(-3deg);background:#fff;border:1px solid var(--sr-border);border-radius:12px;box-shadow:0 16px 40px rgba(15,17,23,.16);overflow:hidden}
.promo .peek .eb{font-size:.55rem;font-weight:700;text-transform:uppercase;letter-spacing:.09em;color:#6b6b73;padding:8px 12px 0}
.promo .peek pre{margin:0;padding:8px 12px 11px;font-family:var(--sr-font-mono);font-size:.6rem;line-height:1.6;white-space:pre;color:#0f1117}

/* ---- popup ---- */
.sr-popup{width:380px;background:var(--sr-bg);color:var(--sr-fg)}
.sr-pop-head{display:flex;align-items:center;gap:9px;padding:13px 16px;border-bottom:1px solid var(--sr-border)}
.sr-brand{font-size:.9375rem;font-weight:600;letter-spacing:-.01em;display:flex;align-items:center;gap:8px}
.sr-pop-context{margin-left:auto;font-size:.6875rem;color:var(--sr-muted-fg);text-align:right;line-height:1.35;max-width:56%}
.sr-pop-context .sr-loc{display:block;font-weight:600;color:var(--sr-fg);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.sr-pop-body{padding:14px;display:flex;flex-direction:column;gap:14px}
.sr-eyebrow{font-size:.6875rem;text-transform:uppercase;letter-spacing:.08em;color:var(--sr-muted-fg);font-weight:600}
.sr-eyebrow-row{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:9px}
.sr-mono{font-family:var(--sr-font-mono);font-size:.8125rem;line-height:1.7;background:var(--sr-mono-bg);border:1px solid var(--sr-border);border-radius:var(--sr-radius);padding:14px 16px;margin:0;white-space:pre;overflow:hidden;color:var(--sr-fg)}
.sr-btn-copy{height:28px;padding:0 11px;background:var(--sr-accent);color:var(--sr-accent-fg);border:1.5px solid transparent;border-radius:6px;font-family:inherit;font-size:.75rem;font-weight:600;display:inline-flex;align-items:center;gap:5px;white-space:nowrap}
.sr-copied-banner{display:flex;align-items:center;gap:7px;margin-top:8px;padding:7px 11px;border-radius:8px;background:var(--sr-accent);color:var(--sr-accent-fg);font-size:.8125rem;font-weight:600;line-height:1.35}
.sr-divider{border:none;border-top:1px solid var(--sr-border);margin:0;width:100%}
.sr-footer{text-align:center;font-size:.75rem;color:var(--sr-muted-fg);padding:11px 16px 13px;border-top:1px solid var(--sr-border)}
.sr-footer a{color:inherit;text-decoration:none}
.sr-footer span{opacity:.6}

/* notice / nudge / permission / info */
.sr-notice-amber{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:13px 15px;background:var(--sr-warning-bg);border:1px solid var(--sr-warning-bd);color:var(--sr-warning-fg);border-radius:8px;font-size:.8125rem;line-height:1.5}
.sr-notice-amber .tx{display:flex;gap:8px;align-items:flex-start}
.sr-notice-amber .tx svg{flex-shrink:0;margin-top:1px}
.sr-btn-ghost{min-height:32px;padding:0 13px;background:var(--sr-accent);color:var(--sr-accent-fg);border:1.5px solid transparent;border-radius:7px;font-family:inherit;font-size:.75rem;font-weight:600;display:inline-flex;align-items:center;gap:6px;white-space:nowrap;flex-shrink:0}
.sr-perm{display:flex;flex-direction:column;gap:14px;padding:18px 16px 16px}
.sr-perm .lead{display:flex;gap:11px;align-items:flex-start}
.sr-perm .lead .ic{flex-shrink:0;width:36px;height:36px;border-radius:10px;background:var(--sr-accent);color:var(--sr-accent-fg);display:inline-flex;align-items:center;justify-content:center}
.sr-perm h3{margin:0 0 4px;font-size:.9375rem;font-weight:600}
.sr-perm p{margin:0;font-size:.8125rem;line-height:1.5;color:var(--sr-muted-fg)}
.sr-host-list{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:6px}
.sr-host-list li{display:flex;align-items:center;gap:8px;font-size:.8125rem;font-family:var(--sr-font-mono);color:var(--sr-fg);background:var(--sr-muted);border:1px solid var(--sr-border);border-radius:7px;padding:7px 10px}
.sr-host-list .dot{width:6px;height:6px;border-radius:50%;background:var(--sr-primary);flex-shrink:0}
.sr-btn-primary{width:100%;min-height:38px;padding:0 16px;background:var(--sr-primary);color:var(--sr-primary-fg);border:0;border-radius:var(--sr-radius);font-family:inherit;font-size:.875rem;font-weight:600;display:inline-flex;align-items:center;justify-content:center;gap:8px}
.sr-info{display:flex;flex-direction:column;align-items:center;text-align:center;gap:12px;padding:26px 22px 22px}
.sr-info .ic{width:44px;height:44px;display:inline-flex;align-items:center;justify-content:center;border-radius:12px;background:var(--sr-muted);color:var(--sr-muted-fg)}
.sr-info h3{margin:0;font-size:.9375rem;font-weight:600}
.sr-info p{margin:0;font-size:.8125rem;line-height:1.55;color:var(--sr-muted-fg);max-width:30ch}
.sr-cv{display:flex;flex-direction:column;gap:10px;width:100%;padding:0 16px 18px}
.sr-link{background:none;border:0;padding:0;font:inherit;font-size:.8125rem;font-weight:600;color:var(--sr-primary);align-self:center;text-decoration:none}

/* options */
.sr-options{width:600px;background:var(--sr-bg);color:var(--sr-fg);border:1px solid var(--sr-border);border-radius:12px;overflow:hidden}
.sr-options-head{padding:22px 28px 20px;border-bottom:1px solid var(--sr-border)}
.sr-options-head .sr-brand{font-size:1.0625rem}
.sr-options-head p{margin:8px 0 0;color:var(--sr-muted-fg);font-size:.875rem}
.sr-options-body{padding:24px 28px 26px}
.sr-field{margin-bottom:22px}
.sr-field-top{display:flex;align-items:baseline;justify-content:space-between;gap:12px;margin-bottom:7px}
.sr-field label{font-size:.875rem;font-weight:600}
.sr-getkey{font-size:.8125rem;color:var(--sr-primary);text-decoration:none;font-weight:500;white-space:nowrap}
.sr-input-wrap{position:relative;display:flex}
.sr-field .inp{width:100%;height:42px;padding:0 44px 0 13px;background:var(--sr-bg);color:var(--sr-fg);border:1px solid var(--sr-input-border);border-radius:var(--sr-radius);font-family:var(--sr-font-mono);font-size:.9375rem;letter-spacing:.04em;display:flex;align-items:center}
.sr-reveal{position:absolute;right:6px;top:50%;transform:translateY(-50%);width:32px;height:32px;display:inline-flex;align-items:center;justify-content:center;color:var(--sr-fg)}
.sr-help{margin:7px 0 0;font-size:.8125rem;color:var(--sr-muted-fg);line-height:1.45}
.sr-foot{display:flex;align-items:center;gap:14px;margin-top:4px}
.sr-foot .sr-btn-primary{width:auto;padding:0 22px}
.sr-saved{display:inline-flex;align-items:center;gap:6px;font-size:.8125rem;font-weight:600;color:var(--sr-accent-fg)}
.sr-privacy{margin-top:20px;padding-top:18px;border-top:1px solid var(--sr-border);display:flex;align-items:center;gap:8px;font-size:.8125rem;color:var(--sr-muted-fg)}
.sr-privacy svg{color:var(--sr-primary);flex-shrink:0}
`;

// ---- popup state markup ----
const brand = `<span class="sr-brand">${tile(20)} SnowRaven Mini</span>`;
const footer = `<div class="sr-footer"><a>SnowRaven Mini</a> <span>&middot;</span> <a>Help</a></div>`;

const WEATHER = `&#9729;&#65039;
Overcast clouds
Temperature: 54&deg;F
Wind: Gentle breeze
Wind Direction: W
Cloud Cover: 100%
Humidity: 89%
Dew point: 52&deg;F
Sunrise: 5:08am
Sunset: 6:53pm
Weather generated by &lt;a href="..."&gt;SnowRaven&lt;/a&gt;`;

const TIDE = `&#127754;
Observed
Water level: 2.3 &ndash; 5.6 ft
Tide: Rising (turned during your checklist)
Previous low: 1.8 ft at 7:42am
Next high: 5.6 ft at 1:58pm
Station: The Battery (8518750), 3.4 mi away
Relative to MLLW
Tide data from NOAA CO-OPS &middot; via &lt;a href="..."&gt;SnowRaven&lt;/a&gt;`;

const WEATHER_INLAND = `&#9728;&#65039;
Clear sky
Temperature: 61&deg;F
Wind: Light breeze
Wind Direction: NW
Cloud Cover: 4%
Humidity: 47%
Dew point: 39&deg;F
Sunrise: 5:33am
Sunset: 8:21pm
Weather generated by &lt;a href="..."&gt;SnowRaven&lt;/a&gt;`;

function popupResult() {
  return `<div class="sr-popup">
    <div class="sr-pop-head">${brand}<span class="sr-pop-context"><span class="sr-loc">The Battery, New York</span>Jun 7, 6:42am</span></div>
    <div class="sr-pop-body">
      <div>
        <div class="sr-eyebrow-row"><span class="sr-eyebrow">Weather</span><span class="sr-btn-copy">${ico(CHECK, 'currentColor', 2.5)} Copied</span></div>
        <pre class="sr-mono">${WEATHER}</pre>
        <div class="sr-copied-banner">${ico(CHECK, 'currentColor', 2.5)} Copied to clipboard. Paste it into your checklist comment.</div>
      </div>
      <hr class="sr-divider" />
      <div>
        <div class="sr-eyebrow-row"><span class="sr-eyebrow">Tide</span><span class="sr-btn-copy">Copy</span></div>
        <pre class="sr-mono">${TIDE}</pre>
      </div>
    </div>${footer}
  </div>`;
}

function popupTideNotice() {
  return `<div class="sr-popup">
    <div class="sr-pop-head">${brand}<span class="sr-pop-context"><span class="sr-loc">Ridgefield NWR, WA</span>May 19, 7:10am</span></div>
    <div class="sr-pop-body">
      <div>
        <div class="sr-eyebrow-row"><span class="sr-eyebrow">Weather</span><span class="sr-btn-copy">${ico(CHECK, 'currentColor', 2.5)} Copied</span></div>
        <pre class="sr-mono">${WEATHER_INLAND}</pre>
      </div>
      <hr class="sr-divider" />
      <div>
        <div class="sr-eyebrow-row"><span class="sr-eyebrow">Tide</span></div>
        <div class="sr-notice-amber"><span class="tx">${ico(ALERT, 'currentColor', 2)}<span>The nearest tide station is 38 miles away.</span></span><button class="sr-btn-ghost">Show it anyway</button></div>
      </div>
    </div>${footer}
  </div>`;
}

function popupPermission() {
  return `<div class="sr-popup">
    <div class="sr-pop-head">${brand}</div>
    <div class="sr-perm">
      <div class="lead"><span class="ic">${ico(SHIELD, 'currentColor', 2)}</span><div><h3>Allow SnowRaven Mini to reach these?</h3><p>It needs to call eBird, OpenWeather, and NOAA directly from your browser, nothing else.</p></div></div>
      <ul class="sr-host-list">
        <li><span class="dot"></span>api.ebird.org</li>
        <li><span class="dot"></span>api.openweathermap.org</li>
        <li><span class="dot"></span>api.tidesandcurrents.noaa.gov</li>
      </ul>
      <button class="sr-btn-primary">${ico(SHIELD, 'currentColor', 2.2)} Grant access</button>
    </div>${footer}
  </div>`;
}

function popupChecklistView() {
  return `<div class="sr-popup">
    <div class="sr-pop-head">${brand}</div>
    <div class="sr-info">
      <span class="ic">${ico(PIN, 'currentColor', 2)}</span>
      <h3>You're on the checklist page</h3>
      <p>SnowRaven Mini pastes weather into the Edit Comments page. Open it for this checklist, or show the weather right here.</p>
    </div>
    <div class="sr-cv">
      <button class="sr-btn-primary">Show weather anyway</button>
      <a class="sr-link">Open Edit Comments &rsaquo;</a>
    </div>${footer}
  </div>`;
}

function optionsCard() {
  const field = (label, val) => `<div class="sr-field">
      <div class="sr-field-top"><label>${label}</label><a class="sr-getkey">Get a free key &rsaquo;</a></div>
      <div class="sr-input-wrap"><div class="inp">${val}</div><span class="sr-reveal">${ico(EYE, 'currentColor', 2)}</span></div>
    </div>`;
  return `<div class="sr-options">
    <div class="sr-options-head">${brand}<p>Your keys stay on this device. Enter them once.</p></div>
    <div class="sr-options-body">
      ${field('eBird API key', '&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;')}
      ${field('OpenWeather API key', '&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;')}
      <div class="sr-foot"><button class="sr-btn-primary">Save keys</button><span class="sr-saved">${ico(CHECK, 'currentColor', 2.5)} Saved</span></div>
      <div class="sr-privacy">${ico(LOCK, 'currentColor', 2)} Keys stay on this device. They're sent only to eBird and OpenWeather, for authentication, nowhere else.</div>
    </div>
  </div>`;
}

function frame({ theme, kicker, h3, p, device }) {
  const wm = `<svg class="wm" viewBox="0 0 32 32" aria-hidden="true"><g transform="translate(4,4)" stroke="var(--wm)" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" fill="none"><path d="M16 7h.01"/><path d="M3.4 18H12a8 8 0 0 0 8-8V7a4 4 0 0 0-7.28-2.3L2 20"/><path d="m20 7 2 .5-2 .5"/><path d="M10 18v3"/><path d="M14 17.75V21"/><path d="M7 18a6 6 0 0 0 3.84-10.61"/></g></svg>`;
  return `<div class="shot ${theme === 'dark' ? 'dark' : ''}" style="width:1280px;height:800px">
    ${wm}
    <div class="copy">
      <span class="kicker">${tile(24)} SnowRaven Mini</span>
      <h3>${h3}</h3>
      <p>${p}</p>
    </div>
    <div class="device">${device}</div>
  </div>`;
}

function promoTile() {
  return `<div class="promo" style="width:440px;height:280px">
    <div class="pad">
      <div class="top"><span class="t">${tile(60)}</span><div class="word">SnowRaven<br>Mini</div></div>
      <div class="tag">Weather and tide for your eBird checklist, in one click.</div>
    </div>
    <div class="peek"><div class="eb">Weather</div><pre>&#9729;&#65039;
Overcast clouds
Temperature: 54&deg;F
Wind: Gentle breeze
Wind Direction: W</pre></div>
  </div>`;
}

function doc(w, h, inner) {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><style>${CSS}
  html,body{width:${w}px;height:${h}px;overflow:hidden;background:#fff}</style></head><body>${inner}</body></html>`;
}

const ASSETS = [
  { name: 'promo-tile-440x280', w: 440, h: 280, inner: promoTile() },
  { name: 'screenshot-1-result-light', w: 1280, h: 800, inner: frame({ theme: 'light', h3: 'Weather and tide, already on your clipboard.', p: "One click on your eBird checklist. The weather block copies itself; the tide sits right below.", device: popupResult() }) },
  { name: 'screenshot-1-result-dark', w: 1280, h: 800, inner: frame({ theme: 'dark', h3: 'Weather and tide, already on your clipboard.', p: "One click on your eBird checklist. The weather block copies itself; the tide sits right below.", device: `<div class="dark">${popupResult()}</div>` }) },
  { name: 'screenshot-2-options-light', w: 1280, h: 800, inner: frame({ theme: 'light', h3: 'Your keys stay on your device.', p: 'Two free keys, stored locally, sent only to eBird and OpenWeather.', device: optionsCard() }) },
  { name: 'screenshot-2-options-dark', w: 1280, h: 800, inner: frame({ theme: 'dark', h3: 'Your keys stay on your device.', p: 'Two free keys, stored locally, sent only to eBird and OpenWeather.', device: `<div class="dark">${optionsCard()}</div>` }) },
  { name: 'screenshot-3-permission-light', w: 1280, h: 800, inner: frame({ theme: 'light', h3: 'Asks only for what it needs.', p: 'Reaches three bird and weather APIs, nothing else, and only when you say so.', device: popupPermission() }) },
  { name: 'screenshot-4-tide-notice-light', w: 1280, h: 800, inner: frame({ theme: 'light', h3: 'Honest about tide.', p: 'When the nearest NOAA station is far or inland, it says so, with an override.', device: popupTideNotice() }) },
  { name: 'screenshot-5-checklist-view-light', w: 1280, h: 800, inner: frame({ theme: 'light', h3: 'On the checklist page? One tap to the right spot.', p: 'It offers the Edit Comments page, or shows the weather right where you are.', device: popupChecklistView() }) },
];

for (const a of ASSETS) {
  const htmlPath = join(RENDER, `${a.name}.html`);
  const rawPath = join(RENDER, `${a.name}.raw.png`);
  const outPath = join(OUT, `${a.name}.png`);
  writeFileSync(htmlPath, doc(a.w, a.h, a.inner));
  execFileSync(CHROMIUM, [
    '--headless=new', '--no-sandbox', '--disable-gpu', '--hide-scrollbars',
    '--force-device-scale-factor=1', `--window-size=${a.w},${a.h}`,
    '--virtual-time-budget=2500', `--screenshot=${rawPath}`, `file://${htmlPath}`,
  ], { stdio: ['ignore', 'ignore', 'ignore'] });
  // Flatten onto white so the PNG has no alpha (Chrome Web Store requirement),
  // and assert exact dimensions.
  await sharp(rawPath).flatten({ background: '#ffffff' }).png({ compressionLevel: 9 }).toFile(outPath);
  const meta = await sharp(outPath).metadata();
  const okSize = meta.width === a.w && meta.height === a.h;
  const okAlpha = !meta.hasAlpha;
  rmSync(rawPath, { force: true }); // drop the pre-flatten intermediate
  console.log(`${okSize && okAlpha ? 'ok ' : 'BAD'} store/assets/${a.name}.png — ${meta.width}x${meta.height}, alpha=${meta.hasAlpha}`);
}
console.log('done.');
