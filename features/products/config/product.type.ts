import { z } from 'zod';

import type { Pagination } from '@/shared/lib/types/pagination';
import { ProductFormSchema, ProductSelectSchema } from './product.schema';

export type Product = z.infer<typeof ProductSelectSchema>;

export type ProductPayload = z.infer<typeof ProductFormSchema>;

export interface PaginatedProduct {
  data: Product[];
  meta: {
    pagination?: Pagination;
  };
}
