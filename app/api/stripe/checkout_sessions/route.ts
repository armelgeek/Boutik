import { auth } from '@/auth';
import { createOrder } from '@/features/orders/domain/use-cases/create-order.use-case';
import { CartItem } from '@/features/products/config/cart.type';
import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-02-24.acacia',
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
                image: Array.isArray(item.image) ? item.image[0] : item.image, // Prendre la première image
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

        // Create line items with direct price data instead of Stripe product IDs
        const lineItems = cartItems.map((item) => ({
            price_data: {
                currency: 'eur', // ou 'usd' selon votre devise
                product_data: {
                    name: `${item.name} - Size: ${item.size}`,
                    images: item.image ? [item.image] : [], // Utiliser l'image unique
                },
                unit_amount: Math.round(item.price * 100), // Prix en centimes
            },
            quantity: item.quantity,
        }));

        const session = await stripe.checkout.sessions.create({
            mode: 'payment',
            payment_method_types: ['card'],
            line_items: lineItems,
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