import 'server-only';

import { eq, sql } from 'drizzle-orm';

import { db } from '@/drizzle/db';
import { categories } from '@/drizzle/schema/categories';
import { CategoryPayload } from '../../config/category.type';

export async function updateCategory(slug: string, payload: CategoryPayload) {
  const existingCategory = await db.query.categories.findFirst({
    where: eq(categories.slug, slug),
  });

  if (!existingCategory) {
    throw new Error('Category not found');
  }

  await db
    .update(categories)
    .set({ ...payload, updatedAt: sql`NOW()` })
    .where(eq(categories.slug, slug));

  return;
}
