import 'server-only';
import { isNotNull } from 'drizzle-orm';
import { db } from '@/drizzle/db';
import { categories } from '@/drizzle/schema/categories';

export async function getHasParentCategories() {
  const data = await db
    .select({
      id: categories.id,
      name: categories.name,
      slug: categories.slug,
      parent_id: categories.parent_id,
      image: categories.image,
      created_at: categories.createdAt,
      updated_at: categories.updatedAt,
    })
    .from(categories)
    .where(isNotNull(categories.parent_id));

  return {
    data,
    meta: {
      pagination: {
        total: data.length,
        currentPage: 1,
        pageSize: data.length,
        hasNextPage: false,
        hasPreviousPage: false,
      },
    },
  };
}