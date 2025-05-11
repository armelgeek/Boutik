import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { getOrderSummary } from '@/features/orders/domain/use-cases/get-order-overview';
import React from 'react';
import { BadgeDollarSign, Barcode, CreditCard, Users, ArrowRight } from 'lucide-react';
import { formatCurrency, formatDateTime, formatNumber } from '@/shared/lib/utils';
import Charts from '@/components/charts';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default async function Overview() {
    const summary = await getOrderSummary();

    return (
        <div className='space-y-4'>
            <div className='flex flex-col space-y-2'>
                <h1 className="font-bold text-3xl tracking-tight scroll-m-20">Dashboard</h1>
                <p className="mb-2 text-muted-foreground text-sm md:text-base">
                    Overview of your store's performance metrics and recent activities.
                </p>
            </div>

            <div className='gap-4 grid md:grid-cols-2 lg:grid-cols-4'>
                <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
                    <CardHeader className='flex flex-row justify-between items-center space-y-0 pb-2'>
                        <CardTitle className='font-medium text-sm'>Total Revenue</CardTitle>
                        <BadgeDollarSign className="w-4 h-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className='font-bold text-primary text-2xl'>
                            {formatCurrency(summary.totalSales._sum.totalPrice)}
                        </div>
                        <p className="mt-1 text-muted-foreground text-xs">All time store revenue</p>
                    </CardContent>
                </Card>

                <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
                    <CardHeader className='flex flex-row justify-between items-center space-y-0 pb-2'>
                        <CardTitle className='font-medium text-sm'>Orders</CardTitle>
                        <CreditCard className="w-4 h-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className='font-bold text-primary text-2xl'>
                            {formatNumber(summary.ordersCount)}
                        </div>
                        <p className="mt-1 text-muted-foreground text-xs">Total processed orders</p>
                    </CardContent>
                </Card>

                <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
                    <CardHeader className='flex flex-row justify-between items-center space-y-0 pb-2'>
                        <CardTitle className='font-medium text-sm'>Customers</CardTitle>
                        <Users className="w-4 h-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className='font-bold text-primary text-2xl'>
                            {formatNumber(summary.usersCount)}
                        </div>
                        <p className="mt-1 text-muted-foreground text-xs">Unique buyers to date</p>
                    </CardContent>
                </Card>

                <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
                    <CardHeader className='flex flex-row justify-between items-center space-y-0 pb-2'>
                        <CardTitle className='font-medium text-sm'>Products</CardTitle>
                        <Barcode className="w-4 h-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className='font-bold text-primary text-2xl'>
                            {formatNumber(summary.productsCount)}
                        </div>
                        <p className="mt-1 text-muted-foreground text-xs">Items in your catalog</p>
                    </CardContent>
                </Card>
            </div>

            <div className='gap-4 grid md:grid-cols-2 lg:grid-cols-7'>
                <Card className='col-span-4 shadow-sm hover:shadow-md transition-shadow duration-200'>
                    <CardHeader>
                        <CardTitle>Revenue Trends</CardTitle>
                        <CardDescription>Monthly revenue over the last 6 months</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Charts
                            data={{
                                salesData: summary.salesData,
                            }}
                        />
                    </CardContent>
                </Card>

                <Card className='col-span-3 shadow-sm hover:shadow-md transition-shadow duration-200'>
                    <CardHeader className="flex flex-row justify-between items-center pb-2">
                        <div>
                            <CardTitle>Recent Sales</CardTitle>
                            <CardDescription>Latest customer transactions</CardDescription>
                        </div>
                        <Link href="/orders" className="flex items-center text-primary text-sm">
                            View all <ArrowRight className="ml-1 w-4 h-4" />
                        </Link>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="font-medium">BUYER</TableHead>
                                    <TableHead className="font-medium">DATE</TableHead>
                                    <TableHead className="font-medium">TOTAL</TableHead>
                                    <TableHead className="w-[80px]"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {summary.latestSales.map((order) => (
                                    <TableRow key={order.id} className="hover:bg-muted/50">
                                        <TableCell className="font-medium">
                                            {order?.user?.name ? order.user.name : 'Deleted User'}
                                        </TableCell>
                                        <TableCell>
                                            {formatDateTime(order.createdAt).dateOnly}
                                        </TableCell>
                                        <TableCell className="font-medium">{formatCurrency(order.totalPrice)}</TableCell>
                                        <TableCell>
                                            <Link href={`/d/master/orders/${order.id}`}>
                                                <Button variant="ghost" size="sm" className="p-0 w-8 h-8">
                                                    <ArrowRight className="w-4 h-4" />
                                                    <span className="sr-only">View details</span>
                                                </Button>
                                            </Link>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}