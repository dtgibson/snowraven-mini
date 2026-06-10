// Thin fetch wrapper — the extension-context replacement for SnowRaven's
// `tauriFetch` (frontend/src/lib/tauri/http.ts). Wraps the global `fetch` with
// a hard request timeout via AbortController and returns the native `Response`,
// so the ported services read `.status` / `.ok` / `.json()` unchanged.
//
// Runs inside the secure extension context (chrome-extension:// / moz-extension://),
// where CORS is governed by the granted optional_host_permissions, not page CORS.

export const DEFAULT_TIMEOUT_MS = 10_000;

/**
 * `fetch` with a hard request timeout. Drop-in replacement for the desktop's
 * `tauriFetch` (imported as `extFetch` everywhere). On timeout it aborts and
 * throws a typed error (`{ status: 0, timeout: true }`) that the services'
 * existing catch blocks already surface.
 */
export async function extFetch(
  input: RequestInfo | URL,
  init: RequestInit & { timeoutMs?: number } = {},
): Promise<Response> {
  const { timeoutMs = DEFAULT_TIMEOUT_MS, ...rest } = init;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(input, { ...rest, signal: controller.signal });
  } catch (err) {
    if (controller.signal.aborted) {
      throw Object.assign(
        new Error('The request timed out — check your connection and try again.'),
        { status: 0, timeout: true },
      );
    }
    throw err;
  } finally {
    clearTimeout(timer);
  }
}
