import {
  createLoader,
  createSerializer,
  parseAsInteger,
  parseAsString,
  parseAsArrayOf
} from 'nuqs/server';

export const productsSearchParams = {
  search: parseAsString.withDefault(''),
  page: parseAsInteger.withDefault(1),
  pageSize: parseAsInteger.withDefault(10),
  sortBy: parseAsString.withDefault('name'),
  sortDir: parseAsString.withDefault('asc'),
  category: parseAsArrayOf(parseAsString).withDefault([]),
  subCategory: parseAsArrayOf(parseAsString).withDefault([]),
  minPrice: parseAsInteger.withDefault(null),
  maxPrice: parseAsInteger.withDefault(null)
};

export const loadSearchParams = createLoader(productsSearchParams);
export const serializeSearchParams = createSerializer(productsSearchParams);
