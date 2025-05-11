import { db } from "@/drizzle/db";
import { orders, orderItems } from "@/drizzle/schema/orders";
import { DisplayCartItem } from "@/features/cart/hooks/use-sorted-cart";

export interface CreateOrderParams {
  userId?: string;
  items: DisplayCartItem[];
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
    const [order] = await tx
      .insert(orders)
      .values({
        userId,
        total,
        shippingAddress,
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date()
      })
      .returning();


    const tempData = Object.entries(items).flatMap(([itemId, item]) =>  ({
          id: item.id,
          size: item.size,
          quantity: item.quantity,
          name: item.name,
          price: item.price,
          image: item.image
        })
    );
    const orderItemsToInsert = tempData.map((item) => ({
      orderId: order.id,
      productId: item.id,
      quantity: item.quantity,
      price: item.price,
      size: item.size || null,
      createdAt: new Date()
    }));

    if (orderItemsToInsert.length > 0) {
      await tx.insert(orderItems).values(orderItemsToInsert);
    }

    return order;
  });
}