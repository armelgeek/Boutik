import {
    createLoader,
    createSerializer,
    parseAsArrayOf,
    parseAsInteger,
    parseAsString,
} from 'nuqs/server';

export const categorySearchParams = {
    search: parseAsString.withDefault(''),
    page: parseAsInteger.withDefault(1),
    pageSize: parseAsInteger.withDefault(10),
    sortBy: parseAsString.withDefault(''),
    sortDir: parseAsString.withDefault('')
};

export const loadSearchParams = createLoader(categorySearchParams);
export const serializeSearchParams = createSerializer(categorySearchParams);