import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

import { eq } from 'drizzle-orm';
import Stripe from 'stripe';

import { db } from '@/drizzle/db';
import { orders } from '@/drizzle/schema';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-04-10',
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  const body = await request.text();
  const sig = await headers();
  const iz = sig.get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, iz, endpointSecret);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error(`Erreur de webhook: ${err.message}`);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }

  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object as Stripe.Checkout.Session;
      const orderId = session.metadata?.orderId;

      if (orderId && session.payment_intent) {
        const paymentIntentId =
          typeof session.payment_intent === 'string'
            ? session.payment_intent
            : session.payment_intent.id;


            
          await db
            .update(orders)
            .set({
              status: 'processing',
              stripePaymentIntentId: paymentIntentId,
              updatedAt: new Date(),
            })
            .where(eq(orders.id, orderId));

        console.log(`Order ${orderId} updated with payment intent ${paymentIntentId}`);
        //TODO: send mail
      }

      break;

    case 'payment_intent.succeeded':
      break;

    case 'payment_intent.payment_failed': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      if (paymentIntent.metadata?.orderId) {
        await db
          .update(orders)
          .set({
            status: 'payment_failed',
            updatedAt: new Date(),
          })
          .where(eq(orders.id, paymentIntent.metadata.orderId));
      }
        //TODO: send mail
      break;
    }

    case 'charge.refunded': {
      const charge = event.data.object as Stripe.Charge;
      if (charge.payment_intent) {
        const [order] = await db
          .select()
          .from(orders)
          .where(
            eq(
              orders.stripePaymentIntentId,
              typeof charge.payment_intent === 'string'
                ? charge.payment_intent
                : charge.payment_intent.id,
            ),
          );

        if (order) {
          await db
            .update(orders)
            .set({
              refundStatus: charge.refunded ? 'refunded' : 'partial_refund',
              updatedAt: new Date(),
            })
            .where(eq(orders.id, order.id));
        }
          //TODO: send mail
      }
      break;
    }

    default:
      break;
  }

  return NextResponse.json({ received: true }, { status: 200 });
}
