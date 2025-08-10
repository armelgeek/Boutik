import 'server-only';
import { sql } from 'drizzle-orm';
import { db } from '@/drizzle/db';
import { categories } from '@/drizzle/schema/categories';
import type { Filter } from '@/shared/lib/types/filter';
import { calculatePagination } from '@/shared/lib/utils/calculate-pagination';
import { createPagination } from '@/shared/lib/utils/create-pagination';
import { filterOrderByClause } from '@/shared/lib/utils/filter-order-by-clause';
import { filterWhereClause } from '@/shared/lib/utils/filter-where-clause';

export async function getCategories(filter: Filter) {
  const searchColumns = ['name'];
  const sortColumns = ['name'];

  const whereClause = {
    search: filter.search
  };
  const conditions = filterWhereClause(searchColumns, whereClause);
  const sort = filterOrderByClause(sortColumns, filter.sortBy, filter.sortDir);

  const [{ count }] = await db
    .select({
      count: sql<number>`count(*)`,
    })
    .from(categories)
    .where(conditions);

  const { currentPage, itemsPerPage, offset } = calculatePagination(filter.page, filter.pageSize);
  const pagination = createPagination(count, currentPage, itemsPerPage, offset);

  const data = await db
    .select({
      id: categories.id,
      name: categories.name,
      slug: categories.slug,
      image: categories.image,
      parent_id: categories.parent_id,
      createdAt: categories.createdAt,
      updatedAt: categories.updatedAt,
      parent: sql<{
        id: string;
        name: string;
        slug: string;
        image?: string | null;
        createdAt: string;
        updatedAt: string;
      }>`json_build_object(
        'id', parent.id,
        'name', parent.name,
        'slug', parent.slug,
        'image', parent.image,
        'createdAt', parent.created_at,
        'updatedAt', parent.updated_at
      )`
    })
    .from(categories)
    .leftJoin(
      sql`${categories} AS parent`,
      sql`parent.id = ${categories.parent_id}`
    )
    .where(conditions)
    .orderBy(sort)
    .limit(itemsPerPage)
    .offset(offset);

  return {
    data,
    meta: {
      pagination,
    },
  };
}