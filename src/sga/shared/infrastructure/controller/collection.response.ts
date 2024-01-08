export interface Pagination {
  page: number;
  count: number;
  total: number;
}

export interface CollectionResponse<T> {
  items: T[];
  pagination: Pagination;
}
