// Read the active tab's URL on the toolbar-click gesture via the `activeTab`
// permission only (FR-01). Classify the eBird page and recover the checklist ID.
//
// Two pages carry a checklist ID in DIFFERENT places:
//   • Edit page (where you paste a comment): the ID is in the QUERY string —
//       https://ebird.org/edit/effort?subID=S355015734
//   • Checklist view page: the ID is in the PATH —
//       https://ebird.org/checklist/S355015734
// Everything else is 'other'. No content script, no background worker, no polling.

import { extractChecklistId, isValidChecklistId } from '../checklistId';

export type EbirdPageType = 'edit' | 'checklist-view' | 'other';

export interface ActiveTabResult {
  /** The raw active-tab URL, when readable. */
  url: string | null;
  /** Which kind of eBird page this is. */
  pageType: EbirdPageType;
  /** The validated checklist ID (S\d+) when found; null otherwise. */
  checklistId: string | null;
}

const OTHER: Omit<ActiveTabResult, 'url'> = { pageType: 'other', checklistId: null };

/** Read the active tab and classify it as an eBird edit / checklist-view / other page. */
export async function readActiveTab(): Promise<ActiveTabResult> {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  const url = tabs[0]?.url ?? null;
  if (!url) return { url: null, ...OTHER };

  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return { url, ...OTHER };
  }

  // Require https + the ebird.org host (or a subdomain). chrome://, about:, and
  // non-eBird pages fall through to 'other' (FR-04).
  const host = parsed.hostname;
  const isEbird = host === 'ebird.org' || host.endsWith('.ebird.org');
  if (parsed.protocol !== 'https:' || !isEbird) return { url, ...OTHER };

  // Edit pages (the paste target) carry the subID in the query string.
  const queryId = parsed.searchParams.get('subID');
  if (parsed.pathname.startsWith('/edit/') && queryId && isValidChecklistId(queryId)) {
    return { url, pageType: 'edit', checklistId: queryId };
  }

  // Checklist view pages carry the subID in the path (/checklist/S…).
  const pathId = extractChecklistId(parsed.pathname);
  if (parsed.pathname.startsWith('/checklist/') && isValidChecklistId(pathId)) {
    return { url, pageType: 'checklist-view', checklistId: pathId };
  }

  // Fallback: any other eBird page that still exposes a valid subID — prefer the
  // query form (treat as edit-capable), then the path form (view).
  if (queryId && isValidChecklistId(queryId)) return { url, pageType: 'edit', checklistId: queryId };
  if (isValidChecklistId(pathId)) return { url, pageType: 'checklist-view', checklistId: pathId };

  return { url, ...OTHER };
}
