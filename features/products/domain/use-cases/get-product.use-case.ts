import { eq } from 'drizzle-orm';

import { db } from '@/drizzle/db';
import { products } from '@/drizzle/schema';

export async function getProduct(slug: string) {

  const data = await db.query.products.findFirst({
    where: eq(products.slug, slug)
    
  });

  if (!data) {
    throw new Error('Product not found');
  }


  return data;
}
