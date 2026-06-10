// Unit tests for the AS-IS checklistId helpers (FR-02/FR-03). Covers the URL/raw
// extraction and the /^S\d+$/ validation that ext/activeTab.ts gates on.

import { describe, it, expect } from 'vitest';
import { extractChecklistId, isValidChecklistId } from './checklistId';

describe('extractChecklistId', () => {
  it('pulls the ID out of a full eBird checklist URL', () => {
    expect(extractChecklistId('https://ebird.org/checklist/S12345678')).toBe('S12345678');
  });
  it('strips a query string', () => {
    expect(extractChecklistId('https://ebird.org/checklist/S12345678?foo=bar')).toBe('S12345678');
  });
  it('strips a trailing slash', () => {
    expect(extractChecklistId('https://ebird.org/checklist/S12345678/')).toBe('S12345678');
  });
  it('returns a bare ID unchanged', () => {
    expect(extractChecklistId('S987654321')).toBe('S987654321');
  });
  it('trims whitespace', () => {
    expect(extractChecklistId('  S42  ')).toBe('S42');
  });
});

describe('isValidChecklistId', () => {
  it('accepts an S-prefixed numeric ID', () => {
    expect(isValidChecklistId('S12345678')).toBe(true);
    expect(isValidChecklistId('S1')).toBe(true);
  });
  it('rejects non-checklist paths and malformed IDs', () => {
    expect(isValidChecklistId('s12345678')).toBe(false); // lowercase
    expect(isValidChecklistId('S12ab')).toBe(false);
    expect(isValidChecklistId('12345678')).toBe(false);
    expect(isValidChecklistId('explore')).toBe(false);
    expect(isValidChecklistId('')).toBe(false);
  });
});
