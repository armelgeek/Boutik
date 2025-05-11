import { db } from "@/drizzle/db";
import { orders } from "@/drizzle/schema/orders";
import { eq } from "drizzle-orm";

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'payment_failed';

export async function updateOrderStatus(orderId: string, status: OrderStatus): Promise<void> {
    try {
        await db
            .update(orders)
            .set({
                status: status,
                updatedAt: new Date()
            })
            .where(eq(orders.id, orderId));

    } catch (error) {
        console.error(`Erreur lors de la mise à jour de la commande ${orderId}:`, error);
        throw error;
    }
}