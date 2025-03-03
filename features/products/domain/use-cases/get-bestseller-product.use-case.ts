import 'server-only';
import { eq } from 'drizzle-orm';
import { db } from '@/drizzle/db';
import { products } from '@/drizzle/schema/products';

export async function getBestSellerProducts() {

  const data = await db
    .select({
      id: products.id,
      name: products.name,
      slug: products.slug,
      price: products.price,
      images: products.images
      })
    .from(products)
    .where(eq(products.bestseller, true))
    .limit(4)
    .offset(0)

  return {
    data
  };
}