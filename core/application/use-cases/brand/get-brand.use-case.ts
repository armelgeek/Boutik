import { createHash } from 'crypto';

import { eq } from 'drizzle-orm';

import { brandCacheKeys } from '@/core/domain/brand/brand.key';
import { db } from '@/drizzle/db';
import { brands } from '@/drizzle/schema';
import { redis } from '@/shared/lib/config/redis';

const CACHE_TTL = 3600;

export async function getBrand(slug: string) {
  const hash = createHash('md5').update(slug).digest('hex');
  const cacheKey = brandCacheKeys.detail(hash);

  const cached = await redis.get(cacheKey);
  if (cached) return JSON.parse(cached);

  const data = await db.query.brands.findFirst({
    where: eq(brands.slug, slug),
  });

  if (!data) {
    throw new Error('Brand not found');
  }

  await redis.set(cacheKey, JSON.stringify(data), { EX: CACHE_TTL });

  return data;
}
