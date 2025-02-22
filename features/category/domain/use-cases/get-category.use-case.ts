import { eq } from 'drizzle-orm';

import { db } from '@/drizzle/db';
import { categories } from '@/drizzle/schema';

export async function getCategory(slug: string) {

  const data = await db.query.categories.findFirst({
    where: eq(categories.slug, slug)
  });

  if (!data) {
    throw new Error('Category not found');
  }


  return data;
}
