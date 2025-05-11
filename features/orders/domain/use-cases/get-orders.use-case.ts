import 'server-only';
import { db } from '@/drizzle/db';
import { sql, and, eq } from 'drizzle-orm';
import { orders, orderItems } from '@/drizzle/schema';
import { products } from '@/drizzle/schema/products';
import type { Filter } from '@/shared/lib/types/filter';
import { calculatePagination } from '@/shared/lib/utils/calculate-pagination';
import { createPagination } from '@/shared/lib/utils/create-pagination';

export async function getOrders(filter: Filter) {
    const conditions = [];

    /**if (filter.search && filter.search.trim() !== '') {
        conditions.push(
            sql`LOWER(${orders.status}) LIKE LOWER(${`%${filter.search}%`})`
        );
    }**/

    if (filter.userId) {
        conditions.push(eq(orders.userId, filter.userId));
    }

    /**if (filter.fromDate) {
      conditions.push(gte(orders.createdAt, new Date(filter.fromDate)));
    }
  
    if (filter.toDate) {
      conditions.push(lte(orders.createdAt, new Date(filter.toDate)));
    }**/

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const [{ count }] = await db
        .select({
            count: sql<number>`count(*)`,
        })
        .from(orders)
        .where(whereClause);

    const { currentPage, itemsPerPage, offset } = calculatePagination(
        filter.page || 1,
        filter.pageSize || 10
    );

    const pagination = createPagination(count, currentPage, itemsPerPage, offset);

    const rawOrders = await db
        .select({
            order: orders,
            item: orderItems,
            product: products,
        })
        .from(orders)
        .leftJoin(orderItems, eq(orderItems.orderId, orders.id))
        .leftJoin(products, eq(products.id, orderItems.productId))
        .where(whereClause)
        .orderBy(orders.createdAt)
        .limit(itemsPerPage)
        .offset(offset);

    // Group the results by order ID
    const grouped = rawOrders.reduce((acc, row) => {
        const orderId = row.order.id;
        if (!acc[orderId]) {
            acc[orderId] = {
                ...row.order,
                items: [],
            };
        }
        
        // Only add items if they exist (not null)
        if (row.item) {
            acc[orderId].items.push({
                ...row.item,
                product: row.product,
            });
        }
        
        return acc;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }, {} as Record<string, any>);

    return {
        data: Object.values(grouped),
        meta: {
            pagination,
        },
    };
}