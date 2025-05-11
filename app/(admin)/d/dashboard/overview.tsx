import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from '@/components/ui/table';
  import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getFakeOrderSummary } from '@/features/orders/domain/use-cases/get-order-overview';
import React from 'react'
import { BadgeDollarSign, Barcode, CreditCard, Users } from 'lucide-react';
import { formatCurrency, formatDateTime, formatNumber } from '@/shared/lib/utils';
import Charts from '@/components/charts';
import Link from 'next/link';

export default async function Overview() {
    const summary = await getFakeOrderSummary();

    return (
        <div className='space-y-2'>
        <h1 className="font-bold text-3xl tracking-tight scroll-m-20">Dashboard</h1>
      <div className='gap-4 grid md:grid-cols-2 lg:grid-cols-4'>
        <Card>
          <CardHeader className='flex flex-row justify-between items-center space-y-0 pb-2'>
            <CardTitle className='font-medium text-sm'>Total Revenue</CardTitle>
            <BadgeDollarSign />
          </CardHeader>
          <CardContent>
            <div className='font-bold text-2xl'>
              {formatCurrency(
                summary.totalSales._sum.totalPrice || 0
              )}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row justify-between items-center space-y-0 pb-2'>
            <CardTitle className='font-medium text-sm'>Sales</CardTitle>
            <CreditCard />
          </CardHeader>
          <CardContent>
            <div className='font-bold text-2xl'>
              {formatNumber(summary.ordersCount)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row justify-between items-center space-y-0 pb-2'>
            <CardTitle className='font-medium text-sm'>Customers</CardTitle>
            <Users />
          </CardHeader>
          <CardContent>
            <div className='font-bold text-2xl'>
              {formatNumber(summary.usersCount)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row justify-between items-center space-y-0 pb-2'>
            <CardTitle className='font-medium text-sm'>Products</CardTitle>
            <Barcode />
          </CardHeader>
          <CardContent>
            <div className='font-bold text-2xl'>
              {formatNumber(summary.productsCount)}
            </div>
          </CardContent>
        </Card>
      </div>
      <div className='gap-4 grid md:grid-cols-2 lg:grid-cols-7'>
        <Card className='col-span-4'>
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <Charts
              data={{
                salesData: summary.salesData,
              }}
            />
          </CardContent>
        </Card>
        <Card className='col-span-3'>
          <CardHeader>
            <CardTitle>Recent Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>BUYER</TableHead>
                  <TableHead>DATE</TableHead>
                  <TableHead>TOTAL</TableHead>
                  <TableHead>ACTIONS</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {summary.latestSales.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>
                      {order?.user?.name ? order.user.name : 'Deleted User'}
                    </TableCell>
                    <TableCell>
                      {formatDateTime(order.createdAt).dateOnly}
                    </TableCell>
                    <TableCell>{formatCurrency(order.totalPrice)}</TableCell>
                    <TableCell>
                      <Link href={`/order/${order.id}`}>
                        <span className='px-2'>Details</span>
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
    )
}
