export interface Filter {
  [key: string]: unknown;
  search?: string;
  category?: string[];
  subCategory?: string[];
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortDir?: string;
  minPrice?: number;
  maxPrice?: number;
}
