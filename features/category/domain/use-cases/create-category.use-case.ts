import 'server-only';

import { eq } from 'drizzle-orm';
import slugify from 'slugify';

import { db } from '@/drizzle/db';
import { categories } from '@/drizzle/schema/categories';
import { CategoryPayload } from '../../config/category.type';

export async function createCategory(payload: CategoryPayload) {
  const slug = slugify(payload.name, { lower: true });

  const existingCategory = await db.query.categories.findFirst({
    where: eq(categories.slug, slug),
  });

  if (existingCategory) {
    throw new Error('Category with this name already exists');
  }

  const [category] = await db
    .insert(categories)
    .values({ ...payload, slug })
    .returning();

  return category;
}
