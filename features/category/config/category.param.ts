import {
  createLoader,
  createSerializer,
  parseAsInteger,
  parseAsString,
  parseAsArrayOf
} from 'nuqs/server';

export const categoriesSearchParams = {
  search: parseAsString.withDefault(''),
  page: parseAsInteger.withDefault(1),
  pageSize: parseAsInteger.withDefault(10),
  sortBy: parseAsString.withDefault('name'),
  sortDir: parseAsString.withDefault('asc'),
  category: parseAsArrayOf(parseAsString).withDefault([]),
  subCategory: parseAsArrayOf(parseAsString).withDefault([])
};

export const loadSearchParams = createLoader(categoriesSearchParams);
export const serializeSearchParams = createSerializer(categoriesSearchParams);
