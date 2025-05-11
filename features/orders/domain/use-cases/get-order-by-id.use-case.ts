import { db } from "@/drizzle/db";
import { users } from "@/drizzle/schema";
import { orders, orderItems } from "@/drizzle/schema/orders";
import { eq } from "drizzle-orm";

export async function getOrderById(orderId: string) {
  try {
    const order = await db.query.orders.findFirst({
      where: eq(orders.id, orderId),
      with: {
        items: true, 
        user: true,
      }
    });

    if (!order) {
      const orderData = await db
        .select()
        .from(orders)
        .where(eq(orders.id, orderId))
        .limit(1);

      if (orderData.length === 0) {
        return null;
      }

      const orderItemsData = await db
        .select()
        .from(orderItems)
        .where(eq(orderItems.orderId, orderId));

      let userData = null;
      if (orderData[0].userId) {
        const userResults = await db
          .select()
          .from(users)
          .where(eq(users.id, orderData[0].userId))
          .limit(1);
        
        if (userResults.length > 0) {
          userData = userResults[0];
        }
      }

      return {
        ...orderData[0],
        items: orderItemsData,
        user: userData
      };
    }

    return order;

  } catch (error) {
    console.error(`Erreur lors de la récupération de la commande ${orderId}:`, error);
    throw error;
  }
}