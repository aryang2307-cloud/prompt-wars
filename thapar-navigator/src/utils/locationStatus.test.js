import { describe, expect, it } from 'vitest';
import { getFoodLocations, isLocationOpen } from './locationStatus';

const canteen = { category: 'food', timing: '8AM - 8PM' };

describe('isLocationOpen', () => {
  it('returns open during an outlet schedule', () => {
    expect(isLocationOpen(canteen, new Date(2026, 7, 23, 12, 0))).toBe(true);
  });

  it('returns closed outside an outlet schedule', () => {
    expect(isLocationOpen(canteen, new Date(2026, 7, 23, 21, 0))).toBe(false);
  });

  it('keeps 24-hour locations open', () => {
    expect(isLocationOpen({ timing: '24 Hours' })).toBe(true);
  });
});

describe('getFoodLocations', () => {
  it('returns only food outlets', () => {
    expect(getFoodLocations([{ category: 'food' }, { category: 'academic' }])).toHaveLength(1);
  });
});
