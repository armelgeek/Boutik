import 'server-only';
import { db } from '@/drizzle/db';
import { categories } from '@/drizzle/schema/categories';

export async function getSelectCategories() {
  
  const data = await db
    .select({
      id: categories.id,
      name: categories.name,
      slug: categories.slug,
      parent_id: categories.parent_id,
      created_at: categories.createdAt,
      updated_at: categories.updatedAt,
    })
    .from(categories)

  const filtered = data ? data.filter((d) => d.parent_id == null): []
  return {
    data: filtered,
    meta: {
      pagination: {
        total: filtered.length,
        currentPage: 1,
        pageSize: filtered.length,
        hasNextPage: false,
        hasPreviousPage: false,
      },
    },
  };
}