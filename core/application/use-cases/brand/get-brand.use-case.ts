
import { eq } from 'drizzle-orm';

import { db } from '@/drizzle/db';
import { brands } from '@/drizzle/schema';

export async function getBrand(slug: string) {

  const data = await db.query.brands.findFirst({
    where: eq(brands.slug, slug)
  });

  if (!data) {
    throw new Error('Brand not found');
  }


  return data;
}
