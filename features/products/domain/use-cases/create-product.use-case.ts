import 'server-only';

import { eq } from 'drizzle-orm';
import slugify from 'slugify';

import { db } from '@/drizzle/db';
import { products } from '@/drizzle/schema/products';
import { ProductPayload } from '../../config/product.type';
import { product_images } from '@/drizzle/schema';

export async function createProduct(payload: ProductPayload) {
  const slug = slugify(payload.name, { lower: true });

  return await db.transaction(async (tx) => {
    const existingProduct = await tx.query.products.findFirst({
      where: eq(products.slug, slug),
    });

    if (existingProduct) {
      throw new Error('Product with this name already exists');
    }
    const { images, ...rest } = payload;

    const [product] = await tx
      .insert(products)
      .values({ ...rest, slug })
      .returning();

    if (!product) {
      throw new Error('Failed to create product');
    }
    if (images?.length) {
      await tx.insert(product_images).values(
        images.map((img) => ({
          image: img,
          product_id: product.id,
        }))
      );
    }

    /**
    if (payload.sizes?.length) {
      await tx.insert(product_sizes).values(
        payload.sizes.map((size) => ({
          size,
          product_id: product.id,
        }))
      );
    } */

    return product;
  });
}
