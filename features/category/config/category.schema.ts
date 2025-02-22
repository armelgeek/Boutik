import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

import { categories } from '@/drizzle/schema/categories';

export const CategorySelectSchema = createSelectSchema(categories);

export const CategoryFormSchema = createInsertSchema(categories, {
  name: (s) => s.min(1, 'Name is required.').max(255, 'Name must be at most 255 characters.'),
  parent_id: (s) => s.optional().nullable(),
}).pick({
  name: true,
  parent_id: true,
});
