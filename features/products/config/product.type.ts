import { z } from 'zod';

import type { Pagination } from '@/shared/lib/types/pagination';
import { ProductFormSchema, ProductSelectSchema } from './product.schema';

export type Product = z.infer<typeof ProductSelectSchema>;

export type ProductPayload = z.infer<typeof ProductFormSchema>;

// Type étendu pour les produits avec informations de catégorie complètes
export interface ProductWithCategory extends Omit<Product, 'sub_category_id'> {
  sub_category_id?: string | null;
  category?: {
    id: string;
    name: string;
    slug: string;
    parentId?: string | null;
  };
  subcategory?: Array<{
    id: string;
    name: string;
    slug: string;
    parentId?: string | null;
  }>;
}

export interface PaginatedProduct {
  data: Product[];
  meta: {
    pagination?: Pagination;
  };
}

export interface PaginatedProductWithCategory {
  data: ProductWithCategory[];
  meta: {
    pagination?: Pagination;
  };
}
