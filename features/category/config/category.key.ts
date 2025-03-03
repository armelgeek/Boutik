import type { Filter } from '@/shared/lib/types/filter';

export const categoryKeys = {
  all: ['category'] as const,
  sub: ['subcategory'] as const,
  subs: ['subcategories'] as const,
  lists: () => [...categoryKeys.all, 'list'] as const,
  list: (filter: Filter) => [...categoryKeys.lists(), filter] as const,
  detail: (slug: string) => [...categoryKeys.all, 'detail', slug] as const,
};
