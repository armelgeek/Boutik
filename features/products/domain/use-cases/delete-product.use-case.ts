import 'server-only';
import { eq } from 'drizzle-orm';
import { db } from '@/drizzle/db';
import { products } from '@/drizzle/schema/products';

export async function deleteProduct(slug: string) {
  const existingProduct = await db.query.products.findFirst({
    where: eq(products.slug, slug),
  });

  if (!existingProduct) {
    throw new Error('Product not found');
  }

  await db
    .delete(products)
    .where(eq(products.slug, slug));

  return;
}
