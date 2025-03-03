export interface Filter {
  [key: string]: unknown;
  search?: string;
  category_id?: string;
  sub_category_id?: string;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortDir?: string;
}
