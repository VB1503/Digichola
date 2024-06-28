export const getRecentSearches = (key = 'recentSearches') => {
  const searches = localStorage.getItem(key);
  return searches ? JSON.parse(searches) : [];
};

export const addRecentSearch = (searchQuery, key = 'recentSearches', maxItems = 10) => {
  const searches = getRecentSearches(key);
  
  // Add timestamp to the search query
  const searchWithTimestamp = {
      ...searchQuery,
      timestamp: new Date().toISOString(),
  };

  // Remove duplicates based on business ID and add the new search to the top
  const updatedSearches = [searchWithTimestamp, ...searches.filter(query => query.business_id !== searchQuery.business_id)];

  // Limit the number of items
  if (updatedSearches.length > maxItems) {
      updatedSearches.pop();
  }

  localStorage.setItem(key, JSON.stringify(updatedSearches));
};
