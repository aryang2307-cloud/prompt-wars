/**
 * Filter campus locations by category and a case-insensitive search query.
 *
 * @param {Array<Object>} locations - Campus locations to filter.
 * @param {string} category - Category id, or `all` for every category.
 * @param {string} query - Search text matched against location metadata.
 * @param {Object} categories - Category metadata keyed by category id.
 * @returns {Array<Object>} Locations matching both filters.
 */
export function filterLocations(locations, category, query, categories) {
  const normalizedQuery = typeof query === 'string' ? query.toLowerCase().trim() : '';
  const categoryMap = categories || {};

  return (Array.isArray(locations) ? locations : []).filter((location) => {
    if (!location || typeof location.name !== 'string') return false;
    if (!Number.isFinite(location.lat) || !Number.isFinite(location.lng)) return false;

    const matchesCategory = category === 'all' || location.category === category;
    const categoryLabel = categoryMap[location.category]?.label || '';
    const tags = Array.isArray(location.tags) ? location.tags : [];
    const matchesSearch = !normalizedQuery
      || location.name.toLowerCase().includes(normalizedQuery)
      || (location.shortName || '').toLowerCase().includes(normalizedQuery)
      || tags.some((tag) => typeof tag === 'string' && tag.toLowerCase().includes(normalizedQuery))
      || categoryLabel.toLowerCase().includes(normalizedQuery);

    return matchesCategory && matchesSearch;
  });
}
