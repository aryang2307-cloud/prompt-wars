/**
 * Estimate current crowding from a location's category and the local hour.
 * This is a client-side estimate until a live occupancy feed is connected.
 *
 * @param {Object} location - Campus location.
 * @param {Date} [date=new Date()] - Time used for the estimate.
 * @returns {{label: string, tone: string}} Crowd status.
 */
export function getCrowdStatus(location, date = new Date()) {
  const hour = date.getHours();
  const name = location?.name?.toLowerCase() || '';
  const isBusySpot = /library|csed|cos complex/.test(name);
  const peak = hour >= 10 && hour < 14;
  const evening = hour >= 17 && hour < 20;

  if (isBusySpot && (peak || evening)) return { label: 'Packed', tone: 'red' };
  if (isBusySpot || peak) return { label: 'Moderate', tone: 'amber' };
  return { label: 'Quiet', tone: 'green' };
}

/**
 * Build a delivery instruction URL for a hostel or food location.
 *
 * @param {Object} location - Destination location.
 * @returns {string} Shareable delivery instruction URL.
 */
export function getDeliveryLink(location) {
  const destination = location?.name || 'Campus gate';
  const landmark = location?.category === 'hostel'
    ? `${destination} main hostel gate`
    : `${destination} food outlet entrance`;
  const params = new URLSearchParams({
    destination,
    lat: String(location?.lat ?? ''),
    lng: String(location?.lng ?? ''),
    landmark,
    instruction: `Deliver to ${destination}. Meet at the ${landmark}; call on arrival.`,
  });
  return `${window.location.origin}${window.location.pathname}?${params.toString()}`;
}

/**
 * Keep late-night food outlets and study-friendly academic locations.
 *
 * @param {Array<Object>} locations - Campus locations.
 * @returns {Array<Object>} Locations useful after regular hours.
 */
export function getNightLocations(locations) {
  return (Array.isArray(locations) ? locations : []).filter((location) => {
    const text = `${location?.name || ''} ${(location?.tags || []).join(' ')}`.toLowerCase();
    const isStudyHub = location?.category === 'academic' && /library|study|csed|lab/.test(text);
    const isLateFood = location?.category === 'food' && /10\s*pm|11\s*pm|12\s*am|24\s*hours/i.test(location?.timing || '');
    return isStudyHub || isLateFood;
  });
}

/**
 * Keep library, lawn, and department spaces suitable for quiet study.
 *
 * @param {Array<Object>} locations - Campus locations.
 * @returns {Array<Object>} Quiet study locations.
 */
export function getQuietStudyLocations(locations) {
  return (Array.isArray(locations) ? locations : []).filter((location) => {
    const text = `${location?.name || ''} ${(location?.tags || []).join(' ')}`.toLowerCase();
    return /library|study|reading|lawn|wifi|quiet/.test(text);
  });
}
