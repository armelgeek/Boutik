import 'server-only';

import { sql } from 'drizzle-orm';

import { db } from '@/drizzle/db';
import { brands } from '@/drizzle/schema/brands';
import type { Filter } from '@/shared/lib/types/filter';
import { calculatePagination } from '@/shared/lib/utils/calculate-pagination';
import { createPagination } from '@/shared/lib/utils/create-pagination';
import { filterOrderByClause } from '@/shared/lib/utils/filter-order-by-clause';
import { filterWhereClause } from '@/shared/lib/utils/filter-where-clause';

export async function getBrands(filter: Filter) {

  const searchColumns = ['name'];
  const sortColumns = ['name', 'updated_at'];

  const whereClause = {
    search: filter.search,
    ...(filter.status ? { status: filter.status } : {}),
  };
  const conditions = filterWhereClause(searchColumns, whereClause);
  const sort = filterOrderByClause(sortColumns, filter.sortBy, filter.sortDir);

  const [{ count }] = await db
    .select({
      count: sql<number>`count(*)`,
    })
    .from(brands)
    .where(conditions);

  const { currentPage, itemsPerPage, offset } = calculatePagination(filter.page, filter.pageSize);
  const pagination = createPagination(count, currentPage, itemsPerPage, offset);

  const data = await db
    .select()
    .from(brands)
    .where(conditions)
    .orderBy(sort)
    .limit(itemsPerPage)
    .offset(offset);

  const result = {
    data,
    meta: {
      pagination,
    },
  };
  return result;
}
