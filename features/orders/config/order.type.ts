import type { Pagination } from '@/shared/lib/types/pagination';
import { Order } from '@/features/products/config/order.type';


export interface PaginatedOrder {
  data: Order[];
  meta: {
    pagination?: Pagination;
  };
}
