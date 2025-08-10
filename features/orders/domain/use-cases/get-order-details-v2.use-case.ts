import { db } from "@/drizzle/db";
import { orders, orderItems } from "@/drizzle/schema/orders";
import { products } from "@/drizzle/schema/products";
import { eq, sql } from "drizzle-orm";

interface ShippingAddress {
  fullName: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  phone: string;
}

export interface OrderWithDetails {
  id: string;
  userId: string;
  status: string;
  total: number;
  shippingAddress: ShippingAddress | null;
  createdAt: Date;
  updatedAt: Date;
  user: {
    id: string;
    name: string;
    email: string;
  };
  items: Array<{
    id: string;
    productId: string;
    quantity: number;
    price: number;
    size?: string;
    product: {
      id: string;
      name: string;
      images: string[];
    };
  }>;
}

export async function getOrderWithDetails(orderId: string): Promise<OrderWithDetails | null> {
  try {
    // Récupérer la commande
    const [orderResult] = await db
      .select()
      .from(orders)
      .where(eq(orders.id, orderId));

    if (!orderResult) {
      return null;
    }

    // Récupérer les informations utilisateur avec une requête SQL directe
    const userResult = await db.execute(
      sql`SELECT id, name, email FROM users WHERE id = ${orderResult.userId}`
    );

    const user = userResult[0] as { id: string; name: string; email: string } | undefined;

    // Récupérer les items de la commande avec les détails du produit
    const orderItemsResult = await db
      .select({
        id: orderItems.id,
        productId: orderItems.productId,
        quantity: orderItems.quantity,
        price: orderItems.price,
        size: orderItems.size,
        productName: products.name,
        productImages: products.images,
      })
      .from(orderItems)
      .leftJoin(products, eq(orderItems.productId, products.id))
      .where(eq(orderItems.orderId, orderId));

    // Construire l'objet résultat
    const order: OrderWithDetails = {
      id: orderResult.id,
      userId: orderResult.userId || '',
      status: orderResult.status,
      total: orderResult.total,
      shippingAddress: orderResult.shippingAddress as ShippingAddress | null,
      createdAt: orderResult.createdAt,
      updatedAt: orderResult.updatedAt,
      user: {
        id: user?.id || '',
        name: user?.name || 'Customer',
        email: user?.email || '',
      },
      items: orderItemsResult.map(item => ({
        id: item.id,
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
        size: item.size || undefined,
        product: {
          id: item.productId,
          name: item.productName || 'Product',
          images: item.productImages || [],
        },
      })),
    };

    return order;
  } catch (error) {
    console.error(`Error fetching order details for ${orderId}:`, error);
    throw error;
  }
}
