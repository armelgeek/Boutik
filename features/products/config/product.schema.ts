import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

import { products } from '@/drizzle/schema/products';
import { z } from 'zod';

export const ProductSelectSchema = createSelectSchema(products);

export const ProductFormSchema = createInsertSchema(products, {
  name: (s) => s.min(1, 'Name is required.').max(255, 'Name must be at most 255 characters.'),
  price: (s) => s.min(1, 'Price is required.'),
  category_id: (s) => s.min(1, 'Category is required.'),
  sizes: z.array(z.string()).optional(),
  images: z.array(z.string()).optional(),
  bestseller: z.boolean().optional(),
}).pick({
  name: true,
  description: true,
  price: true,
  category_id: true,
  sub_category_id: true,
  images: true,
  sizes: true,
  bestseller: true
});
