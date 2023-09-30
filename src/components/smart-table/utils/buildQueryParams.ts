export type QueryParams = {
  search?: string;
  sort?: {
    field: string;
    direction: string;
  };
  limit?: number;
  offset?: number;
};

const buildQueryParams = (params: QueryParams = {}) => {
  let queryParams = "";

  if (params.search) {
    queryParams = queryParams.concat(`search=${params.search}`);
  }

  if (params.sort) {
    if (queryParams.length) {
      queryParams = queryParams.concat("&");
    }

    queryParams = queryParams.concat(
      `sortField=${params.sort.field}&sortDirection=${params.sort.direction}`
    );
  }

  if (params.limit) {
    if (queryParams.length) {
      queryParams = queryParams.concat("&");
    }

    queryParams = queryParams.concat(`limit=${params.limit}`);
  }

  if (params.offset) {
    if (queryParams.length) {
      queryParams = queryParams.concat("&");
    }

    queryParams = queryParams.concat(`offset=${params.offset}`);
  }

  return queryParams;
};

export default buildQueryParams;
