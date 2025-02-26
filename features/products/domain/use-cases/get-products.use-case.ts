import 'server-only';
import { sql } from 'drizzle-orm';
import { db } from '@/drizzle/db';
import { products } from '@/drizzle/schema/products';
import { categories } from '@/drizzle/schema/categories';
import type { Filter } from '@/shared/lib/types/filter';
import { calculatePagination } from '@/shared/lib/utils/calculate-pagination';
import { createPagination } from '@/shared/lib/utils/create-pagination';
import { filterOrderByClause } from '@/shared/lib/utils/filter-order-by-clause';
import { filterWhereClause } from '@/shared/lib/utils/filter-where-clause';

export async function getProducts(filter: Filter) {
  const searchColumns = ['name'];
  const sortColumns = ['name', 'date'];

  const whereClause = {
    search: filter.search
  };
  const conditions = filterWhereClause(searchColumns, whereClause);
  // const sort = filterOrderByClause(sortColumns, filter.sortBy, filter.sortDir);

  const [{ count }] = await db
    .select({
      count: sql<number>`count(*)`,
    })
    .from(products)
    .where(conditions);

  const { currentPage, itemsPerPage, offset } = calculatePagination(filter.page, filter.pageSize);
  const pagination = createPagination(count, currentPage, itemsPerPage, offset);

  const data = await db
    .select({
      id: products.id,
      name: products.name,
      slug: products.slug,
      price: products.price,
      description: products.description,
      category: sql<{
        id: string;
        name: string;
        slug: string;
      }>`json_build_object(
        'id', category.id,
        'name', category.name,
        'slug', category.slug
      )`,
      sub_category: sql<{
        id: string;
        name: string;
        slug: string;
      }>`json_build_object(
        'id', sub_category.id,
        'name', sub_category.name,
        'slug', sub_category.slug
      )`,
      created_at: products.date,
    })
    .from(products)
    .leftJoin(
      sql`${categories} AS category`,
      sql`category.id = ${products.category_id}`
    )
    .leftJoin(
      sql`${categories} AS sub_category`,
      sql`sub_category.id = ${products.sub_category_id}`
    )
    .where(conditions)
    //.orderBy(sort)
    .limit(itemsPerPage)
    .offset(offset);

  return {
    data,
    meta: {
      pagination,
    },
  };
}