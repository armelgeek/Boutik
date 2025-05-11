import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { orderService } from '../domain/order.service';

export const ORDER_KEYS = {
  all: ['orders'] as const,
  lists: () => [...ORDER_KEYS.all, 'list'] as const,
  list: (filters: any) => [...ORDER_KEYS.lists(), { filters }] as const,
  details: () => [...ORDER_KEYS.all, 'detail'] as const,
  detail: (slug: string) => [...ORDER_KEYS.details(), slug] as const,
};

export const useOrders = (filters: any) => {
  const { data, isLoading } = useQuery({
    queryKey: ORDER_KEYS.list(filters),
    queryFn: () => orderService.list(filters),
    placeholderData: keepPreviousData,
  });

  const pageSize = filters.pageSize || 10;
  const total = data?.total ?? 0;
  const totalPages = Math.ceil(total / pageSize);
  return {
    data: data?.data ?? [],
    meta: {
      total,
      totalPages,
      pageSize,
      page: filters.page || 1
    },
    isLoading,
  };
};
