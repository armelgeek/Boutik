import { z } from 'zod';

import { CategoryFormSchema, CategorySelectSchema } from './category.schema';
import type { Pagination } from '@/shared/lib/types/pagination';

export type Category = z.infer<typeof CategorySelectSchema>;

export type CategoryPayload = z.infer<typeof CategoryFormSchema>;

export interface PaginatedCategory {
  data: Category[];
  meta: {
    pagination?: Pagination;
  };
}
