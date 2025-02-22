import 'server-only';
import { eq } from 'drizzle-orm';
import { db } from '@/drizzle/db';
import { categories } from '@/drizzle/schema/categories';

export async function deleteCategory(slug: string) {
  const existingCategory = await db.query.categories.findFirst({
    where: eq(categories.slug, slug),
  });

  if (!existingCategory) {
    throw new Error('Category not found');
  }

  await db
    .delete(categories)
    .where(eq(categories.slug, slug));

  return;
}
