import { db } from "@/drizzle/db";
import { orders } from "@/drizzle/schema";
import stripe from "@/shared/lib/config/stripe";
import { and, eq } from "drizzle-orm";
import { sendOrderStatusUpdateEmail } from "@/shared/lib/config/email";
import { getOrderWithDetails } from "./get-order-details.use-case";

export async function cancelOrder({
    orderId,
    userId,
    reason,
}: {
    orderId: string;
    userId: string;
    reason: string;
}) {
    try {
        const [order] = await db
            .select()
            .from(orders)
            .where(and(eq(orders.id, orderId), eq(orders.userId, userId)));

        if (!order) {
            throw new Error('Order not found or access denied');
        }

        const cancellableStatuses = ['pending', 'processing'];
        if (!cancellableStatuses.includes(order.status)) {
            throw new Error(`Cannot cancel order with status: ${order.status}`);
        }

        let refundStatus = null;
        if (order.stripePaymentIntentId) {
            try {
                const refund = await stripe.refunds.create({
                    payment_intent: order.stripePaymentIntentId,
                    reason: 'requested_by_customer',
                });

                refundStatus = refund.status;
            } catch (stripeError) {
                console.error('Stripe refund error:', stripeError);
                throw new Error('Failed to process refund. Please contact support.');
            }
        }

        const [updatedOrder] = await db
            .update(orders)
            .set({
                status: 'cancelled',
                cancellationReason: reason,
                refundStatus,
                updatedAt: new Date(),
            })
            .where(eq(orders.id, orderId))
            .returning();

        // Envoyer l'email de notification de cancellation
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
                    status: 'cancelled',
                    orderItems: orderItems,
                    total: orderDetails.total
                });

                console.log(`Order cancellation email sent for order ${orderId} to ${orderDetails.user.email}`);
            }
        } catch (emailError) {
            console.error('Failed to send cancellation email:', emailError);
            // Ne pas faire échouer la cancellation si l'email échoue
        }

        return updatedOrder;
    } catch (error) {
        console.error('Order cancellation error:', error);
        throw error;
    }
}