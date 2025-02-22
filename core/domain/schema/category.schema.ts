import { z } from 'zod';

export const CategorySelectSchema = z.object({
    categoryId: z.string().uuid(),
    slug: z.string(),
    name: z.string(),
    description: z.string().nullable(),
    parent_id: z.string().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
});

export const CategoryFormSchema = z.object({
    slug: z.string(),
    name: z.string(),
    description: z.string().nullable(),
    parent_id: z.string().nullable(),
});