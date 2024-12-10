/**
 * @param {Object} options
 * @param {String} options.authDocId - The authenticated user's document ID to restrict access to their data
 * @param {Function} options.getData - Function to fetch data (e.g., getAllUsers)
 * @param {String} [options.search] - Optional search term to filter results
 * @param {Number} [options.limit] - Limit for pagination
 * @param {Number} [options.page] - Page number for pagination (1-based index)
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
  page,
  orderBy,
  order,
  searchFields = [],
}) => {
  let results = [];

  const batchSize = parseInt(limit, 10);
  const queryOffset = (page - 1) * batchSize;

  const buildQuery = (query, field, searchValue) => {
    if (!isNaN(searchValue)) {
     
      return query
        .where(field, ">=", parseFloat(searchValue))
        .where(field, "<=", parseFloat(searchValue));
    } else {
      //const lowerSearchValue = searchValue.toLowerCase();
      return query
        .where(field, ">=", searchValue)
        .where(field, "<=", searchValue + "\uf8ff");
    }
  };

  const getResults = async (query) => {
    query = query.orderBy(orderBy, order).limit(batchSize).offset(queryOffset);

    const snapshot = await query.get();
    return snapshot.docs.map((doc) => {
      const userData = doc.data();
      if (userData.hasOwnProperty("password")) {
        delete userData.password;
      }
      return userData;
    });
  };

  if (search && searchFields.length > 0) {
    for (const field of searchFields) {
      let query = getData(authDocId);
      query = buildQuery(query, field, search);
      const data = await getResults(query);
      results = [...results, ...data];
    }

    results = Array.from(new Set(results.map(JSON.stringify))).map(JSON.parse);
  } else {
    const query = getData(authDocId);
    results = await getResults(query);
  }

  const totalItemsQuery = await getData(authDocId);
  const totalItemsSnapshot = await totalItemsQuery.get();
  const totalItems = totalItemsSnapshot.size;

  const totalPages = Math.ceil(totalItems / batchSize);
  const currentPage = Number(page);

  return {
    data: results,
    meta: {
      limit: batchSize,
      offset: queryOffset,
      orderBy,
      order,
      totalItems,
      totalPages,
      currentPage,
      hasNextPage: queryOffset + batchSize < totalItems,
      hasPrevPage: queryOffset > 0,
    },
  };
};
