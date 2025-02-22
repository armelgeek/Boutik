import { z } from 'zod';

import { BrandFormSchema, BrandSelectSchema } from '@/features/brand/config/brand.schema';
import type { Pagination } from '@/shared/lib/types/pagination';

export type Brand = z.infer<typeof BrandSelectSchema>;

export type BrandPayload = z.infer<typeof BrandFormSchema>;

export interface PaginatedBrand {
  data: Brand[];
  meta: {
    pagination?: Pagination;
  };
}
