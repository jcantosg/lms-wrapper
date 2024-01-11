export interface Pagination {
  page: number;
  limit: number;
  total: number;
}

export interface CollectionResponse<T> {
  items: T[];
  pagination: Pagination;
}
