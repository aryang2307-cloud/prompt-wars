import { describe, expect, it } from 'vitest';
import { COOL_ROUTE_GEOJSON } from './coolRoutes';

describe('cool route data', () => {
  it('contains a dashed route and translucent polygons for covered areas', () => {
    const route = COOL_ROUTE_GEOJSON.features[0];

    expect(COOL_ROUTE_GEOJSON.type).toBe('FeatureCollection');
    expect(route.properties.mode).toBe('cool-route');
    expect(route.geometry.type).toBe('LineString');
    expect(route.geometry.coordinates.length).toBeGreaterThan(2);
    expect(COOL_ROUTE_GEOJSON.features.slice(1).every((feature) => feature.geometry.type === 'Polygon')).toBe(true);
    expect(COOL_ROUTE_GEOJSON.features).toHaveLength(4);
  });
});
