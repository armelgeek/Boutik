export async function getFakeOrderSummary() {
    const ordersCount = 245;
    const productsCount = 78;
    const usersCount = 123;

    const totalSales = {
        _sum: {
            totalPrice: 45823.75,
        },
    };

    const salesData = [
        { month: '01/25', totalSales: 6000 },
        { month: '02/25', totalSales: 7300 },
        { month: '03/25', totalSales: 8200 },
        { month: '04/25', totalSales: 9100 },
        { month: '05/25', totalSales: 10000 },
        { month: '06/25', totalSales: 10223.75 },
    ];

    const latestSales = [
        {
            id: 'order1',
            totalPrice: 125.50,
            createdAt: new Date('2025-05-10T10:30:00'),
            user: { name: 'Alice Martin' },
        },
        {
            id: 'order2',
            totalPrice: 78.99,
            createdAt: new Date('2025-05-09T14:10:00'),
            user: { name: 'Jean Dupont' },
        },
        {
            id: 'order3',
            totalPrice: 199.95,
            createdAt: new Date('2025-05-08T09:20:00'),
            user: { name: 'Claire Petit' },
        },
        {
            id: 'order4',
            totalPrice: 55.00,
            createdAt: new Date('2025-05-07T17:40:00'),
            user: { name: 'Marc Noël' },
        },
        {
            id: 'order5',
            totalPrice: 89.90,
            createdAt: new Date('2025-05-06T12:00:00'),
            user: { name: 'Sophie Bernard' },
        },
        {
            id: 'order6',
            totalPrice: 149.99,
            createdAt: new Date('2025-05-05T16:15:00'),
            user: { name: 'Luc Lefèvre' },
        },
    ];

    return {
        ordersCount,
        productsCount,
        usersCount,
        totalSales,
        latestSales,
        salesData,
    };
}
