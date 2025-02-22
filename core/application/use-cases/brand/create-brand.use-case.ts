import 'server-only';

import { eq } from 'drizzle-orm';
import slugify from 'slugify';

import { BrandPayload } from '@/core/domain/brand/brand.type';
import { db } from '@/drizzle/db';
import { brands } from '@/drizzle/schema/brands';

export async function createBrand(payload: BrandPayload) {
  const slug = slugify(payload.name, { lower: true });

  const existingBrand = await db.query.brands.findFirst({
    where: eq(brands.slug, slug),
  });

  if (existingBrand) {
    throw new Error('Brand with this name already exists');
  }

  const [brand] = await db
    .insert(brands)
    .values({ ...payload, slug, country: 'United States' })
    .returning();

  return brand;
}
