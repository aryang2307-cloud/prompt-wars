import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { CAT, LOCATIONS, TABS } from '../data';
import { filterLocations } from '../utils/filterLocations';
import { LocationFilters } from './LocationFilters';

const renderFilters = (overrides = {}) => {
  const props = {
    query: '',
    onQueryChange: vi.fn(),
    onClearQuery: vi.fn(),
    tab: 'all',
    onTabChange: vi.fn(),
    tabs: TABS,
    categories: CAT,
    resultCount: LOCATIONS.length,
    ...overrides,
  };

  return { ...render(<LocationFilters {...props} />), props };
};

describe('filterLocations', () => {
  it('finds a location by name or short name', () => {
    const results = filterLocations(LOCATIONS, 'all', 'library', CAT);

    expect(results).toHaveLength(1);
    expect(results[0].name).toContain('Library');
  });

  it.each([
    ['academic', 'academic'],
    ['hostel', 'hostel'],
    ['food', 'food'],
    ['recreation', 'recreation'],
  ])('filters locations by the %s category', (category, expectedCategory) => {
    const results = filterLocations(LOCATIONS, category, '', CAT);

    expect(results.length).toBeGreaterThan(0);
    expect(results.every((location) => location.category === expectedCategory)).toBe(true);
  });
});

describe('LocationFilters', () => {
  it('reports the current result count and sends search changes', () => {
    const onQueryChange = vi.fn();
    renderFilters({ query: 'library', resultCount: 1, onQueryChange });

    expect(screen.getByText(/1 location/)).toBeInTheDocument();
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'cos' } });

    expect(onQueryChange).toHaveBeenCalledWith('cos');
  });

  it('sends category tab selection', () => {
    const onTabChange = vi.fn();
    renderFilters({ onTabChange });

    fireEvent.click(screen.getByRole('tab', { name: 'Show food locations' }));

    expect(onTabChange).toHaveBeenCalledWith('food');
  });
});
