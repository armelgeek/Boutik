import 'server-only';

import { eq, sql } from 'drizzle-orm';

import { brandKeys } from '@/core/domain/brand/brand.key';
import { db } from '@/drizzle/db';
import { brands } from '@/drizzle/schema/brands';
import { redis } from '@/shared/lib/config/redis';

export async function deleteBrand(slug: string) {
  const existingBrand = await db.query.brands.findFirst({
    where: eq(brands.slug, slug),
  });

  if (!existingBrand) {
    throw new Error('Brand not found');
  }

  await db
    .update(brands)
    .set({ status: 'deleted', updatedAt: sql`NOW()` })
    .where(eq(brands.slug, slug));

  const cacheKey = [...brandKeys.all, '*'].join(':');
  const cache = await redis.keys(cacheKey);
  if (cache.length) {
    await redis.del(cache);
  }

  return;
}
