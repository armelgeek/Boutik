import { z } from 'zod';

import { ProductFormSchema, ProductSelectSchema } from '@/core/domain/schema/product.schema';
import type { Pagination } from '@/shared/lib/types/pagination';

export type Product = z.infer<typeof ProductSelectSchema>;

export type ProductPayload = z.infer<typeof ProductFormSchema>;

export interface PaginatedProduct {
  data: Product[];
  meta: {
    pagination?: Pagination;
  };
}
