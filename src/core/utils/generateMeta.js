/**
 * @param {Object} options
 * @param {String} options.authDocId - The authenticated user's document ID to restrict access to their data
 * @param {Function} options.getData - Function to fetch data (e.g., getAllUsers)
 * @param {String} [options.search] - Optional search term to filter results
 * @param {Number} [options.limit] - Limit for pagination
 * @param {Number} [options.offset] - Offset for pagination
 * @param {String} [options.orderBy] - Field to sort by
 * @param {String} [options.order] - Order direction ('asc' or 'desc')
 * @param {Array} [options.searchFields] - Fields to search against, e.g., ['name', 'email']
 * @returns {Object} - Returns an object containing both data and meta
 */
export const generateMeta = async ({
  authDocId,
  getData,
  search,
  limit,
  offset,
  orderBy,
  order,
  searchFields = [],
}) => {
  let results = [];

  const buildQuery = (query, field, searchValue) => {
    if (!isNaN(searchValue)) {
      return query
        .where(field, ">=", parseFloat(searchValue))
        .where(field, "<=", parseFloat(searchValue));
    } else {
      return query
        .where(field, ">=", searchValue)
        .where(field, "<=", searchValue + "\uf8ff");
    }
  };

  const getResults = async (query) => {
    query = query
      .orderBy(orderBy || "name", order || "asc") 
      .limit(parseInt(limit, 10) || 20) 
      .offset(parseInt(offset, 10) || 0); 

    const snapshot = await query.get();
    return snapshot.docs.map((doc) => doc.data());
  };

  if (search && searchFields.length > 0) {
    const lowerSearch = search.toLowerCase();

    for (const field of searchFields) {
      let query = getData(authDocId);
      query = buildQuery(query, field, lowerSearch);
      const data = await getResults(query);
      results = [...results, ...data];
    }

    results = Array.from(new Set(results.map(JSON.stringify))).map(JSON.parse);
  } else {
    const query = getData(authDocId); // No search, just fetch the data
    results = await getResults(query);
  }

  const totalItems = results.length;
  const totalPages = Math.ceil(totalItems / limit);
  const currentPage = Math.floor(offset / limit) + 1;

  return {
    data: results,
    meta: {
      limit: parseInt(limit, 10),
      offset: parseInt(offset, 10),
      orderBy,
      order,
      totalItems,
      totalPages,
      currentPage,
      hasNextPage: offset + limit < totalItems,
      hasPrevPage: offset > 0,
    },
  };
};
