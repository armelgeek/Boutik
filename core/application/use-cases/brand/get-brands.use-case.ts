import 'server-only';

import { createHash } from 'crypto';

import { sql } from 'drizzle-orm';

import { brandCacheKeys } from '@/core/domain/brand/brand.key';
import { serializeSearchParams } from '@/core/domain/brand/brand.param';
import { db } from '@/drizzle/db';
import { brands } from '@/drizzle/schema/brands';
import { redis } from '@/shared/lib/config/redis';
import type { Filter } from '@/shared/lib/types/filter';
import { calculatePagination } from '@/shared/lib/utils/calculate-pagination';
import { createPagination } from '@/shared/lib/utils/create-pagination';
import { filterOrderByClause } from '@/shared/lib/utils/filter-order-by-clause';
import { filterWhereClause } from '@/shared/lib/utils/filter-where-clause';

const CACHE_TTL = 3600;

export async function getBrands(filter: Filter) {
  const serialize = serializeSearchParams(filter);
  const hash = createHash('md5').update(serialize).digest('hex');
  const cacheKey = brandCacheKeys.list(hash);

  const cached = await redis.get(cacheKey);
  if (cached) return JSON.parse(cached);

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

  await redis.set(cacheKey, JSON.stringify(result), { EX: CACHE_TTL });

  return result;
}
