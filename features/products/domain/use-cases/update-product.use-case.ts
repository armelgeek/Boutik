import 'server-only';
import { eq, sql } from 'drizzle-orm';

import { db } from '@/drizzle/db';
import { products } from '@/drizzle/schema/products';
import { ProductPayload } from '../../config/product.type';
import stripe from '@/shared/lib/config/stripe';


export async function updateProduct(slug: string, payload: ProductPayload) {
  return await db.transaction(async (tx) => {
    const existingProduct = await tx.query.products.findFirst({
      where: eq(products.slug, slug),
    });

    if (!existingProduct) {
      throw new Error('Product not found');
    }

    const priceId = existingProduct.id;
    const stripeProductId = existingProduct.stripeProductId;

    try {
      if (stripeProductId) {
        await stripe.products.update(stripeProductId, {
          name: payload.name,
          description: payload.description || '',
        });
      }

      if (existingProduct.price !== payload.price) {
        const newStripePrice = await stripe.prices.create({
          product: stripeProductId,
          unit_amount: Math.round(payload.price * 100),
          currency: 'usd',
        });

        // Désactiver l'ancien prix
        await stripe.prices.update(priceId, {
          active: false
        });

        await tx
          .update(products)
          .set({
            ...payload,
            id: newStripePrice.id,
            date: sql`NOW()`
          })
          .where(eq(products.slug, slug));
      } else {

        await tx
          .update(products)
          .set({
            ...payload,
            date: sql`NOW()`
          })
          .where(eq(products.slug, slug));
      }
    } catch (error:any) {
      console.error('Error updating Stripe resources:', error);
      throw new Error(`Failed to update product in Stripe: ${error.message}`);
    }
      
    return { message: 'Product updated successfully' };
  });
}