// Unit tests for the FR-36 status -> message mapper (the single owner of the NEW
// 401/403 key-invalid strings). Covers the 401/403-vs-429 distinction (QA-36a).

import { describe, it, expect } from 'vitest';
import { mapStatusToMessage } from './errorMap';

describe('mapStatusToMessage — eBird', () => {
  it('404 -> checklist not found', () => {
    expect(mapStatusToMessage('ebird', 404)).toBe('Checklist not found. Check the ID and try again.');
  });
  it('401/403 -> eBird key invalid (NEW FR-36 branch)', () => {
    expect(mapStatusToMessage('ebird', 401)).toBe('eBird API key invalid. Check it in Settings.');
    expect(mapStatusToMessage('ebird', 403)).toBe('eBird API key invalid. Check it in Settings.');
  });
  it('429 falls into the generic try-again bucket, NOT key-invalid (QA-36a)', () => {
    expect(mapStatusToMessage('ebird', 429)).toBe('Could not fetch checklist data. Please try again.');
  });
  it('other non-OK -> generic', () => {
    expect(mapStatusToMessage('ebird', 500)).toBe('Could not fetch checklist data. Please try again.');
  });
});

describe('mapStatusToMessage — OpenWeather', () => {
  it('401/403 -> OpenWeather key invalid (NEW FR-36 branch)', () => {
    expect(mapStatusToMessage('openweather', 401)).toBe('OpenWeather API key invalid. Check it in Settings.');
    expect(mapStatusToMessage('openweather', 403)).toBe('OpenWeather API key invalid. Check it in Settings.');
  });
  it('429 falls into the generic unavailable bucket, NOT key-invalid (QA-36a)', () => {
    expect(mapStatusToMessage('openweather', 429)).toBe('Weather data unavailable for this checklist.');
  });
  it('other non-OK -> generic', () => {
    expect(mapStatusToMessage('openweather', 502)).toBe('Weather data unavailable for this checklist.');
  });
});
