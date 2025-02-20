import type { Filter } from '@/shared/lib/types/filter';

export const productKeys = {
  all: ['product'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (filter: Filter) => [...productKeys.lists(), filter] as const,
  detail: (slug: string) => [...productKeys.all, 'detail', slug] as const,
};

export const productCacheKeys = {
  all: ['product'],
  lists: () => [...productKeys.all, 'list'].join(':'),
  list: (filter: string) => [...productKeys.lists(), filter].join(':'),
  detail: (slug: string) => [...productKeys.all, 'detail', slug].join(':'),
};
