import { db } from "@/drizzle/db";
import { orders, orderItems } from "@/drizzle/schema/orders";
import { CartItem } from "@/features/cart/hooks/use-cart";

interface CreateOrderParams {
  userId?: string;
  items: CartItem[];
  total: number;
  shippingAddress?: {
    fullName: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
    phone: string;
  };
}

export async function createOrder({ userId, items, total, shippingAddress }: CreateOrderParams) {
  return db.transaction(async (tx) => {
    // Créer la commande
    const [order] = await tx
      .insert(orders)
      .values({
        userId,
        total,
        items: items,
        shippingAddress,
        status: 'pending'
      })
      .returning();

    // Créer les éléments de la commande
    const orderItemsToInsert = items.map((item) => ({
      orderId: order.id,
      productId: item.id,
      quantity: item.quantity,
      price: item.price,
      size: item.size
    }));

    await tx.insert(orderItems).values(orderItemsToInsert);

    return order;
  });
}
