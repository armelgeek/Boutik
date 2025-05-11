
import { db } from '@/drizzle/db';
import { orders, products, users } from '@/drizzle/schema';
import { sql, count, sum, eq, desc, and } from 'drizzle-orm';

export async function getOrderSummary() {
    const ordersCountResult = await db
        .select({ count: count() })
        .from(orders);

    const ordersCount = ordersCountResult[0].count;

    const productsCountResult = await db
        .select({ count: count() })
        .from(products);

    const productsCount = productsCountResult[0].count;

    const usersCountResult = await db
        .select({ count: count(orders.userId) })
        .from(orders);

    const usersCount = usersCountResult[0].count;

    const totalSalesResult = await db
        .select({
            totalSales: sum(orders.total)
        })
        .from(orders)
        .where(eq(orders.status, 'delivered'));

    const totalSales = {
        _sum: {
            totalPrice: totalSalesResult[0].totalSales || 0,
        },
    };

    const salesData = [];
    const now = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const month = `${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getFullYear()).slice(-2)}`;
      salesData.push({
        month,
        totalSales: 0 
      });
    }
    
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);
    
    const salesDataResult = await db
      .select({
        month: sql`to_char(${orders.createdAt}, 'MM/YY')`.as('month'),
        totalSales: sum(orders.total).as('total_sales')
      })
      .from(orders)
      .where(
        sql`${orders.status} = 'delivered'`
      )
      .groupBy(sql`to_char(${orders.createdAt}, 'MM/YY')`)
      .orderBy(sql`to_char(${orders.createdAt}, 'MM/YY')`);
    
    if (salesDataResult && salesDataResult.length > 0) {
      salesDataResult.forEach(result => {
        const monthIndex = salesData.findIndex(item => item.month === result.month);
        if (monthIndex !== -1) {
          salesData[monthIndex].totalSales = Number(result.totalSales) || 0;
        }
      });
    }
  

    const latestSalesResult = await db
        .select({
            id: orders.id,
            totalPrice: orders.total,
            createdAt: orders.createdAt,
            userName: users.name
        })
        .from(orders)
        .leftJoin(users, eq(orders.userId, users.id))
        .where(eq(orders.status, 'delivered'))
        .orderBy(desc(orders.createdAt))
        .limit(6);
   
    const latestSales = latestSalesResult.map((order: any) => ({
        id: order.id,
        totalPrice: order.totalPrice,
        createdAt: order.createdAt,
        user: { name: order.userName }
    }));
    return {
        ordersCount,
        productsCount,
        usersCount,
        totalSales,
        latestSales,
        salesData,
    };
}
