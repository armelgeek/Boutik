import 'server-only';
import { eq } from 'drizzle-orm';
import slugify from 'slugify';

import { db } from '@/drizzle/db';
import { products } from '@/drizzle/schema/products';
import { ProductPayload } from '../../config/product.type';
import stripe from '@/shared/lib/config/stripe';

export async function createProduct(payload: ProductPayload) {
  const slug = slugify(payload.name, { lower: true });
  
  return await db.transaction(async (tx) => {
    const existingProduct = await tx.query.products.findFirst({
      where: eq(products.slug, slug),
    });
    
    if (existingProduct) {
      throw new Error('Product with this name already exists');
    }
    
    const stripeProduct = await stripe.products.create({
      name: payload.name,
      description: payload.description,
    });
    
    const stripePrice = await stripe.prices.create({
      product: stripeProduct.id,
      unit_amount: Math.round(payload.price * 100), 
      currency: 'usd',
    });
    
    const [product] = await tx
      .insert(products)
      .values({
        ...payload,
        slug,
        id: stripePrice.id, 
        stripeProductId: stripeProduct.id,
      })
      .returning();
    
    if (!product) {
      await stripe.products.del(stripeProduct.id);
      throw new Error('Failed to create product');
    }
    
    return product;
  });
}