import {
    createLoader,
    createSerializer,
    parseAsInteger,
    parseAsString
  } from 'nuqs/server';
  
  export const orderSearchParams = {
    search: parseAsString.withDefault(''),
    userId: parseAsString.withDefault(''),
    page: parseAsInteger.withDefault(1),
    pageSize: parseAsInteger.withDefault(10),
  };
  
  export const loadSearchParams = createLoader(orderSearchParams);
  export const serializeSearchParams = createSerializer(orderSearchParams);
  