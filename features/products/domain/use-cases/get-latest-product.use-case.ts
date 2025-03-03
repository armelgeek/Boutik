import 'server-only';
import { desc } from 'drizzle-orm';
import { db } from '@/drizzle/db';
import { products } from '@/drizzle/schema/products';

export async function getLatestProducts() {

  const data = await db
    .select({
      id: products.id,
      name: products.name,
      slug: products.slug,
      price: products.price,
      images: products.images
      })
    .from(products)
    .limit(8)
    .orderBy(desc(products.date))
    .offset(0)

  return {
    data
  };
}