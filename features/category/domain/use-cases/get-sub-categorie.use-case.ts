import 'server-only';
import { eq } from 'drizzle-orm';
import { db } from '@/drizzle/db';
import { categories } from '@/drizzle/schema/categories';

export async function getSubCategories(categoryId: string) {
  
  const data = await db
    .select({
      id: categories.id,
      name: categories.name,
      slug: categories.slug,
      created_at: categories.createdAt,
      updated_at: categories.updatedAt,
    })
    .from(categories)
    .where(eq(categories.parent_id, categoryId))

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