import 'server-only';
import { eq, sql } from 'drizzle-orm';
import { db } from '@/drizzle/db';
import { brands } from '@/drizzle/schema/brands';

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

  return;
}
