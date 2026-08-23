import { describe, expect, it } from 'vitest';
import { getMessCountdown, getMessMenu } from './messMenu';

describe('mess menu utilities', () => {
  it('returns a daily menu and closing hour', () => {
    const menu = getMessMenu(new Date(2026, 7, 23, 12));

    expect(menu.day).toBe('Sunday');
    expect(menu.meals.length).toBe(3);
    expect(menu.closesAt).toBe(22);
  });

  it('formats the time remaining before closing', () => {
    expect(getMessCountdown(22, new Date(2026, 7, 23, 20, 30))).toBe('1h 30m left');
    expect(getMessCountdown(22, new Date(2026, 7, 23, 22, 0))).toBe('Closed for today');
  });
});