// Clipboard seam — the WEB branch only of SnowRaven's clipboard.ts (the
// isTauri()/@tauri-apps branch is dropped). `navigator.clipboard.writeText`
// first, then the legacy textarea + execCommand fallback. Never throws —
// returns true on success, false otherwise.
//
// LOAD-BEARING (clipboard.ts:3-11): an auto-copy that runs AFTER an await can
// lose user activation and throw NotAllowedError. The manifest holds
// `clipboardWrite` (NFR-01) to make the post-lookup weather auto-copy reliable,
// and the manual Copy button is the guaranteed fresh-gesture fallback
// (FR-30/FR-31/FR-48a).

/** Write text to the clipboard. Returns true on success, false otherwise. */
export async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // fall through to legacy method
  }

  try {
    const el = document.createElement('textarea');
    el.value = text;
    el.style.cssText = 'position:fixed;opacity:0;pointer-events:none';
    document.body.appendChild(el);
    el.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(el);
    return ok;
  } catch {
    return false;
  }
}
