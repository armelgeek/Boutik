import type { Filter } from '@/shared/lib/types/filter';

export const categoryKeys = {
  all: ['category'] as const,
  lists: () => [...categoryKeys.all, 'list'] as const,
  list: (filter: Filter) => [...categoryKeys.lists(), filter] as const,
  detail: (slug: string) => [...categoryKeys.all, 'detail', slug] as const,
};

export const categoryCacheKeys = {
  all: ['category'],
  lists: () => [...categoryKeys.all, 'list'].join(':'),
  list: (filter: string) => [...categoryKeys.lists(), filter].join(':'),
  detail: (slug: string) => [...categoryKeys.all, 'detail', slug].join(':'),
};
