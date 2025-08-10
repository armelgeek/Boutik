import 'server-only';
import { eq } from 'drizzle-orm';
import slugify from 'slugify';
import { randomUUID } from 'crypto';

import { db } from '@/drizzle/db';
import { products } from '@/drizzle/schema/products';
import { ProductPayload } from '../../config/product.type';

export async function createProduct(payload: ProductPayload) {
  const slug = slugify(payload.name, { lower: true });
  const productId = randomUUID();
  
  return await db.transaction(async (tx) => {
    const existingProduct = await tx.query.products.findFirst({
      where: eq(products.slug, slug),
    });
    
    if (existingProduct) {
      throw new Error('Product with this name already exists');
    }
    
    const [product] = await tx
      .insert(products)
      .values({
        ...payload,
        id: productId,
        slug,
        // Garder une valeur temporaire pour stripeProductId jusqu'à migration du schema
        stripeProductId: `local_${productId}`,
      })
      .returning();
    
    if (!product) {
      throw new Error('Failed to create product');
    }
    
    return product;
  });
}