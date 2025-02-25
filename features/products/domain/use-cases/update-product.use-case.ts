import 'server-only';

import { eq, sql } from 'drizzle-orm';

import { db } from '@/drizzle/db';
import { products } from '@/drizzle/schema/products';
import { ProductPayload } from '../../config/product.type';

export async function updateProduct(slug: string, payload: ProductPayload) {
  return await db.transaction(async (tx) => {

    const existingProduct = await tx.query.products.findFirst({
      where: eq(products.slug, slug),
    });

    if (!existingProduct) {
      throw new Error('Product not found');
    }
    await tx
      .update(products)
      .set({ ...payload, date: sql`NOW()` })
      .where(eq(products.slug, slug));
      
    return { message: 'Product updated successfully' };
  });
}
