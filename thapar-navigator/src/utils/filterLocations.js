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
  const normalizedQuery = query.toLowerCase().trim();

  return locations.filter((location) => {
    const matchesCategory = category === 'all' || location.category === category;
    const categoryLabel = categories[location.category]?.label || '';
    const matchesSearch = !normalizedQuery
      || location.name.toLowerCase().includes(normalizedQuery)
      || location.shortName.toLowerCase().includes(normalizedQuery)
      || location.tags.some((tag) => tag.toLowerCase().includes(normalizedQuery))
      || categoryLabel.toLowerCase().includes(normalizedQuery);

    return matchesCategory && matchesSearch;
  });
}
