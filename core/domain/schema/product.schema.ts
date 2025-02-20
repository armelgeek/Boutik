import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

import { products } from '@/drizzle/schema/products';

export const ProductSelectSchema = createSelectSchema(products);

export const ProductFormSchema = createInsertSchema(products, {
  name: (s) => s.min(1, 'Name is required.').max(255, 'Name must be at most 255 characters.'),
  image: z.any().optional(),
  price: z.number().min(1, 'Price must be at least 1.').optional(),
}).pick({
  name: true,
  image: true,
  price: true
});
