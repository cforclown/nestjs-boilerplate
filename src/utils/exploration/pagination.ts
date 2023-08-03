export interface IPaginationSort {
  by: string;
  order: 'asc' | 'desc';
}

export interface IPaginationPayload {
  page: number;
  limit: number;
  sort?: IPaginationSort;
}

export interface IPagination extends IPaginationPayload {
  pageCount: number;
}
