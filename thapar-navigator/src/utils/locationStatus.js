/**
 * Return whether a location is open at a given time.
 *
 * @param {Object} location - Location with a timing string.
 * @param {Date} [date=new Date()] - Time used for the status calculation.
 * @returns {boolean} Whether the location is currently open.
 */
export function isLocationOpen(location, date = new Date()) {
  const timing = location?.timing || '';
  if (/24\s*hours/i.test(timing)) return true;
  if (/event-based/i.test(timing)) return false;

  const match = timing.match(/(\d{1,2})\s*([AP]M)\s*-\s*(\d{1,2})\s*([AP]M)/i);
  if (!match) return false;

  const toMinutes = (hour, period) => {
    let normalizedHour = Number(hour) % 12;
    if (period.toUpperCase() === 'PM') normalizedHour += 12;
    return normalizedHour * 60;
  };

  const start = toMinutes(match[1], match[2]);
  const end = toMinutes(match[3], match[4]);
  const current = date.getHours() * 60 + date.getMinutes();
  return end < start ? current >= start || current < end : current >= start && current < end;
}

/**
 * Return the category-filtered food outlets from a location collection.
 *
 * @param {Array<Object>} locations - Campus locations.
 * @returns {Array<Object>} Food locations with valid coordinates.
 */
export function getFoodLocations(locations) {
  return (Array.isArray(locations) ? locations : []).filter((location) => location?.category === 'food');
}
