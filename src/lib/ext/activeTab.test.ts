import { describe, it, expect, vi } from 'vitest';
import { readActiveTab } from './activeTab';

function onTab(url: string | undefined) {
  (globalThis as unknown as { chrome: unknown }).chrome = {
    tabs: { query: vi.fn().mockResolvedValue([{ url }]) },
  };
}

describe('readActiveTab', () => {
  it('detects the Edit Comments page (subID in the query string)', async () => {
    onTab('https://ebird.org/edit/effort?subID=S355015734');
    const r = await readActiveTab();
    expect(r.pageType).toBe('edit');
    expect(r.checklistId).toBe('S355015734');
  });

  it('detects the checklist view page (subID in the path)', async () => {
    onTab('https://ebird.org/checklist/S355015734');
    const r = await readActiveTab();
    expect(r.pageType).toBe('checklist-view');
    expect(r.checklistId).toBe('S355015734');
  });

  it('tolerates extra/reordered query params on the edit page', async () => {
    onTab('https://ebird.org/edit/effort?foo=1&subID=S99&bar=2');
    const r = await readActiveTab();
    expect(r.pageType).toBe('edit');
    expect(r.checklistId).toBe('S99');
  });

  it('treats other eBird pages as other', async () => {
    onTab('https://ebird.org/home');
    const r = await readActiveTab();
    expect(r.pageType).toBe('other');
    expect(r.checklistId).toBeNull();
  });

  it('rejects non-eBird hosts and non-https', async () => {
    onTab('https://example.com/edit/effort?subID=S1');
    expect((await readActiveTab()).pageType).toBe('other');
    onTab('http://ebird.org/checklist/S1');
    expect((await readActiveTab()).pageType).toBe('other');
  });

  it('handles an unreadable active-tab URL', async () => {
    onTab(undefined);
    const r = await readActiveTab();
    expect(r.pageType).toBe('other');
    expect(r.url).toBeNull();
  });
});
