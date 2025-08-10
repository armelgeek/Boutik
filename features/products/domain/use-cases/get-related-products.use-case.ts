import 'server-only';
import { sql } from 'drizzle-orm';
import { db } from '@/drizzle/db';
import { products } from '@/drizzle/schema/products';

export async function getRelatedProducts(categoryId: string, limit: number = 5) {
  const data = await db
    .select({
      id: products.id,
      name: products.name,
      slug: products.slug,
      price: products.price,
      images: products.images,
      bestseller: products.bestseller
    })
    .from(products)
    .where(sql`${products.category_id} = ${categoryId}`)
    .limit(limit);

  return data;
}
