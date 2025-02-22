import 'server-only';

import { eq, sql } from 'drizzle-orm';

import { BrandPayload } from '@/core/domain/brand/brand.type';
import { db } from '@/drizzle/db';
import { brands } from '@/drizzle/schema/brands';

export async function updateBrand(slug: string, payload: BrandPayload) {
  const existingBrand = await db.query.brands.findFirst({
    where: eq(brands.slug, slug),
  });

  if (!existingBrand) {
    throw new Error('Brand not found');
  }

  await db
    .update(brands)
    .set({ ...payload, updatedAt: sql`NOW()` })
    .where(eq(brands.slug, slug));

  return;
}
