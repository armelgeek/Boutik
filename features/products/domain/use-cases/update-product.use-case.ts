import 'server-only';

import { eq, sql } from 'drizzle-orm';

import { db } from '@/drizzle/db';
import { products } from '@/drizzle/schema/products';
import { ProductPayload } from '../../config/product.type';
import { product_images } from '@/drizzle/schema';

export async function updateProduct(slug: string, payload: ProductPayload) {
  return await db.transaction(async (tx) => {

    const existingProduct = await tx.query.products.findFirst({
      where: eq(products.slug, slug),
    });

    if (!existingProduct) {
      throw new Error('Product not found');
    }
    const { images, ...rest } = payload;
    await tx
      .update(products)
      .set({ ...rest, date: sql`NOW()` })
      .where(eq(products.slug, slug));

    await tx.delete(product_images).where(eq(product_images.product_id, existingProduct.id));
   // await tx.delete(product_sizes).where(eq(product_sizes.product_id, existingProduct.id));

    if (images?.length) {
      await tx.insert(product_images).values(
        images.map((img) => ({
          image: img,
          product_id: existingProduct.id,
        }))
      );
    }

    // Ajouter les nouvelles tailles si fournies
    /**if (payload.sizes?.length) {
      await tx.insert(product_sizes).values(
        payload.sizes.map((size) => ({
          size,
          product_id: existingProduct.id,
        }))
      );
    }**/

    return { message: 'Product updated successfully' };
  });
}
