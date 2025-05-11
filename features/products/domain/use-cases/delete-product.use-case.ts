import 'server-only';
import { eq } from 'drizzle-orm';
import { db } from '@/drizzle/db';
import { products } from '@/drizzle/schema/products';
import stripe from '@/shared/lib/config/stripe';

export async function deleteProduct(slug: string) {
  const existingProduct = await db.query.products.findFirst({
    where: eq(products.slug, slug),
  });

  if (!existingProduct) {
    throw new Error('Product not found');
  }

  const priceId = existingProduct.id;
  const stripeProductId = existingProduct.stripeProductId;

  return await db.transaction(async (tx) => {
    await tx
      .delete(products)
      .where(eq(products.slug, slug));

    try {
      await stripe.prices.update(priceId, {
        active: false
      });
      if (stripeProductId) {
        await stripe.products.update(stripeProductId, {
          active: false
        });
      }
    } catch (error) {
      console.error('Error updating Stripe resources:', error);
    }

    return;
  });
}