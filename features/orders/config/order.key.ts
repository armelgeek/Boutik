import type { Filter } from '@/shared/lib/types/filter';

export const orderKeys = {
  all: ['order'] as const,
  lists: () => [...orderKeys.all, 'list'] as const,
  list: (filter: Filter) => [...orderKeys.lists(), filter] as const,
  detail: (slug: string) => [...orderKeys.all, 'detail', slug] as const,
};
