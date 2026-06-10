// Golden parity test for formatTide — encodes the EXACT FR-28a byte string,
// including the U+2013 EN DASH in the level range and the literal
// `Tide: Rising (turned during your checklist)` trend line, as .toBe.
// FR-28/FR-28a / QA-28a.

import { describe, it, expect } from 'vitest';
import { formatTide } from './tideFormatter';
import type { TideReading } from './tide';
import type { TideStation } from './tideStations';

const STATION: TideStation = {
  id: '8518750', name: 'The Battery', lat: 40.7, lng: -74.01, state: 'NY', obs: true,
};

const FR28A: TideReading = {
  source: 'observed',
  levelMin: 2.34,
  levelMax: 5.61,
  trend: 'rising',
  turnedDuring: true,
  prevHL: { kind: 'low', v: 1.82, timeLocal: '7:42am' },
  nextHL: { kind: 'high', v: 5.61, timeLocal: '1:58pm' },
  station: STATION,
  distanceMi: 3.4,
};

describe('formatTide golden parity (FR-28a)', () => {
  it('produces the exact FR-28a byte string (U+2013 dash, turned-during trend)', () => {
    expect(formatTide(FR28A)).toBe(
      '🌊\nObserved\nWater level: 2.3 – 5.6 ft\nTide: Rising (turned during your checklist)\nPrevious low: 1.8 ft at 7:42am\nNext high: 5.6 ft at 1:58pm\nStation: The Battery (8518750), 3.4 mi away\nRelative to MLLW\nTide data from NOAA CO-OPS · via <a href="https://github.com/dtgibson/snowraven">SnowRaven</a>'
    );
  });

  it('renders a single value (no dash) when levelMin === levelMax', () => {
    const single: TideReading = { ...FR28A, levelMin: 3.0, levelMax: 3.0 };
    expect(formatTide(single)).toContain('Water level: 3.0 ft');
  });
});
