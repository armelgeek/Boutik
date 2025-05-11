import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id;
  if (!id.startsWith('cs_')) {
    throw Error('Incorrect CheckoutSession ID.');
  }
  const checkout_session = await stripe.checkout.sessions.retrieve(id);

  return NextResponse.json(checkout_session);
}