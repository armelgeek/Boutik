import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

import { eq } from 'drizzle-orm';
import Stripe from 'stripe';

import { db } from '@/drizzle/db';
import { orders } from '@/drizzle/schema';
import { sendOrderStatusUpdateEmail } from '@/shared/lib/config/email';
import { getOrderWithDetails } from '@/features/orders/domain/use-cases/get-order-details.use-case';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia',
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
        
        // Envoyer l'email de confirmation de paiement
        try {
          const orderDetails = await getOrderWithDetails(orderId);
          
          if (orderDetails && orderDetails.user.email) {
            const orderItems = orderDetails.items.map(item => ({
              name: item.product.name,
              quantity: item.quantity,
              price: item.price,
              size: item.size
            }));

            await sendOrderStatusUpdateEmail({
              customerName: orderDetails.user.name,
              customerEmail: orderDetails.user.email,
              orderId: orderDetails.id,
              status: 'processing',
              orderItems: orderItems,
              total: orderDetails.total
            });

            console.log(`Payment confirmation email sent for order ${orderId} to ${orderDetails.user.email}`);
          }
        } catch (emailError) {
          console.error('Failed to send payment confirmation email:', emailError);
        }
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
          
        // Envoyer l'email de notification d'échec de paiement
        try {
          const orderDetails = await getOrderWithDetails(paymentIntent.metadata.orderId);
          
          if (orderDetails && orderDetails.user.email) {
            const orderItems = orderDetails.items.map(item => ({
              name: item.product.name,
              quantity: item.quantity,
              price: item.price,
              size: item.size
            }));

            await sendOrderStatusUpdateEmail({
              customerName: orderDetails.user.name,
              customerEmail: orderDetails.user.email,
              orderId: orderDetails.id,
              status: 'payment_failed',
              orderItems: orderItems,
              total: orderDetails.total
            });

            console.log(`Payment failed email sent for order ${paymentIntent.metadata.orderId} to ${orderDetails.user.email}`);
          }
        } catch (emailError) {
          console.error('Failed to send payment failed email:', emailError);
        }
      }
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
            
          // Envoyer l'email de notification de remboursement
          try {
            const orderDetails = await getOrderWithDetails(order.id);
            
            if (orderDetails && orderDetails.user.email) {
              const orderItems = orderDetails.items.map(item => ({
                name: item.product.name,
                quantity: item.quantity,
                price: item.price,
                size: item.size
              }));

              await sendOrderStatusUpdateEmail({
                customerName: orderDetails.user.name,
                customerEmail: orderDetails.user.email,
                orderId: orderDetails.id,
                status: 'cancelled', // Use cancelled status for refund emails
                orderItems: orderItems,
                total: orderDetails.total
              });

              console.log(`Refund email sent for order ${order.id} to ${orderDetails.user.email}`);
            }
          } catch (emailError) {
            console.error('Failed to send refund email:', emailError);
          }
        }
      }
      break;
    }

    default:
      break;
  }

  return NextResponse.json({ received: true }, { status: 200 });
}
