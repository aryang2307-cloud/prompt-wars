export const COOL_ROUTE_GEOJSON = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: { name: 'Cool route through covered walkways', mode: 'cool-route', zone: 'route' },
      geometry: {
        type: 'LineString',
        coordinates: [
          [76.3625, 30.3564],
          [76.3658, 30.3557],
          [76.3676, 30.3550],
          [76.3685, 30.3547],
          [76.3690, 30.3544],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { name: 'Covered corridor', mode: 'cool', zone: 'walkway' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [76.3622, 30.3562],
            [76.3628, 30.3566],
            [76.3660, 30.3559],
            [76.3678, 30.3552],
            [76.3692, 30.3546],
            [76.3688, 30.3542],
            [76.3674, 30.3548],
            [76.3657, 30.3555],
            [76.3622, 30.3562],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { name: 'Central shaded plaza', mode: 'cool', zone: 'plaza' },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [76.3688, 30.3541],
          [76.3698, 30.3541],
          [76.3698, 30.3548],
          [76.3688, 30.3548],
          [76.3688, 30.3541],
        ]],
      },
    },
    {
      type: 'Feature',
      properties: { name: 'COS covered walkway', mode: 'cool', zone: 'walkway' },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [76.3618, 30.3539],
          [76.3624, 30.3539],
          [76.3624, 30.3545],
          [76.3618, 30.3545],
          [76.3618, 30.3539],
        ]],
      },
    },
  ],
};
