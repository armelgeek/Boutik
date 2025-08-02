import { db } from "@/drizzle/db";
import { orders } from "@/drizzle/schema/orders";
import { eq } from "drizzle-orm";
import { getOrderWithDetails } from "./get-order-details.use-case";
import { emitEmailEvent } from "@/shared/lib/events/email-events";

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'payment_failed';

export async function updateOrderStatus(orderId: string, status: OrderStatus): Promise<void> {
    try {
        // Mettre à jour le statut de la commande
        await db
            .update(orders)
            .set({
                status: status,
                updatedAt: new Date()
            })
            .where(eq(orders.id, orderId));

        // Récupérer les détails de la commande pour l'email
        const orderDetails = await getOrderWithDetails(orderId);
        
        if (orderDetails && orderDetails.user.email) {
            // Préparer les données pour l'email
            const orderItems = orderDetails.items.map(item => ({
                name: item.product.name,
                quantity: item.quantity,
                price: item.price,
                size: item.size
            }));

            // Utiliser le système d'événements pour envoyer l'email
            await emitEmailEvent('order.status_updated', {
                orderId: orderDetails.id,
                customerName: orderDetails.user.name,
                customerEmail: orderDetails.user.email,
                status: status,
                orderItems: orderItems,
                total: orderDetails.total
            });

            console.log(`Order status update email sent for order ${orderId} to ${orderDetails.user.email}`);
        }

    } catch (error) {
        console.error(`Erreur lors de la mise à jour de la commande ${orderId}:`, error);
        throw error;
    }
}