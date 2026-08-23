import { describe, expect, it } from 'vitest';
import { getCrowdStatus, getDeliveryLink, getNightLocations, getQuietStudyLocations } from './campusFeatures';

const dateAt = (hour) => new Date(2026, 7, 23, hour, 0);

describe('campus feature utilities', () => {
  it('predicts peak crowding for the library', () => {
    expect(getCrowdStatus({ name: 'Central Library' }, dateAt(12)).label).toBe('Packed');
  });

  it('keeps late food and study hubs in night mode', () => {
    const locations = getNightLocations([
      { category: 'food', name: 'Kravings', timing: '10AM - 10PM' },
      { category: 'academic', name: 'Central Library', tags: ['Study'], timing: '24 Hours' },
      { category: 'food', name: 'Lunch Cafe', timing: '8AM - 8PM' },
    ]);

    expect(locations.map((location) => location.name)).toEqual(['Kravings', 'Central Library']);
  });

  it('generates delivery links with destination coordinates and landmarks', () => {
    const link = getDeliveryLink({ category: 'hostel', name: 'Vyom Hall', lat: 30.35, lng: 76.36 });

    expect(link).toContain('destination=Vyom+Hall');
    expect(link).toContain('landmark=Vyom+Hall+main+hostel+gate');
    expect(link).toContain('lat=30.35');
  });

  it('keeps quiet study spaces in quiet-study mode', () => {
    const locations = getQuietStudyLocations([
      { name: 'Central Library', tags: ['Study'] },
      { name: 'Nirvana Park', tags: ['Park'] },
      { name: 'CSED Reading Space', tags: ['WiFi'] },
    ]);

    expect(locations.map((location) => location.name)).toEqual(['Central Library', 'CSED Reading Space']);
  });
});
