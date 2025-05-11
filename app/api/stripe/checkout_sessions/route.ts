import { auth } from '@/auth';
import { createOrder } from '@/features/orders/domain/use-cases/create-order.use-case';
import { CartItem } from '@/features/products/config/cart.type';
import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

export type DisplayCartItem = {
    id: string;
    size: string;
    quantity: number;
    name: string;
    price: number;
    image: string[];
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2024-04-10',
});

export async function POST(request: NextRequest) {
    try {
        const sess = await auth.api.getSession({
            headers: await headers(),
        });

        const body = await request.json() as Record<string, CartItem[]>;

        if (!body.items || body.items.length === 0) {
            return NextResponse.json(
                { error: 'Le panier est vide' },
                { status: 400 }
            );
        }

        const cartItems = Object.values(body.items).flatMap(item =>
            Object.entries(item.sizes).map(([size, quantity]) => ({
                id: item.id,
                name: item.name,
                price: item.price,
                image: item.image,
                size,
                quantity
            }))
        );

        const amount = cartItems.reduce((total, item) => {
            return total + (item.price * item.quantity);
        }, 0);

        const order = await createOrder({
            ...body,
            items: cartItems,
            total: amount,
            userId: sess?.user.id
        });

        const orderId = order.id;

        const itemsData = Object.entries(cartItems).map(([, { id, quantity }]) => ({
            price: id,
            quantity,
        }))
        const session = await stripe.checkout.sessions.create({
            mode: 'payment',
            payment_method_types: ['card'],
            line_items: itemsData,
            success_url: `${request.headers.get('origin')}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${request.headers.get('origin')}/place-order`,
            metadata: {
                orderId: orderId
            },
            payment_intent_data: {
                metadata: {
                    orderId: orderId
                }
            },
        });

        console.log('Session created:', session);
        return NextResponse.json({ sessionId: session.id, url: session.url });

    } catch (error) {
        console.error('Erreur lors de la création de la session Stripe:', error);
        return NextResponse.json(
            { error: 'Échec de la création de la session de paiement' },
            { status: 500 }
        );
    }
}