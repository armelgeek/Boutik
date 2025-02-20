import {
  createLoader,
  createSerializer,
  parseAsArrayOf,
  parseAsInteger,
  parseAsString,
} from 'nuqs/server';

export const productsSearchParams = {
  search: parseAsString.withDefault(''),
  page: parseAsInteger.withDefault(1),
  pageSize: parseAsInteger.withDefault(10),
  sortBy: parseAsString.withDefault(''),
  sortDir: parseAsString.withDefault(''),
  status: parseAsArrayOf(parseAsString),
};

export const loadSearchParams = createLoader(productsSearchParams);
export const serializeSearchParams = createSerializer(productsSearchParams);
