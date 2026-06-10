// Combined three-origin host-permission flow (FR-43/FR-43a/FR-44). On the first
// lookup click, inside the click handler before any await: a contains() pre-check,
// then ONE chrome.permissions.request listing all three API hosts together.
// All-or-nothing — there is no per-origin partial-grant state in v1.

export const API_ORIGINS: string[] = [
  'https://api.ebird.org/*',
  'https://api.openweathermap.org/*',
  'https://api.tidesandcurrents.noaa.gov/*',
];

/** True when all three API hosts are already granted. */
export async function hasApiPermissions(): Promise<boolean> {
  return chrome.permissions.contains({ origins: API_ORIGINS });
}

/**
 * Request all three API origins together from a user gesture. Returns true when
 * granted (or already held), false when denied. Must be called synchronously
 * within the gesture, before any await that could consume activation.
 */
export async function requestApiPermissions(): Promise<boolean> {
  if (await hasApiPermissions()) return true;
  return chrome.permissions.request({ origins: API_ORIGINS });
}
