export interface Collection<T> {
  totalItems: number;
  data: T[];
}

export interface PageCollection<T> {
  totalItems: number;
  data: T[];
  pageNumber: number;
  pageSize: number;
}
