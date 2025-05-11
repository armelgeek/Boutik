'use client';

import { OrdersClientPage } from "./page.client";

export default function OrderPage() {
  return (
    <div className="flex flex-col space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="font-bold text-3xl tracking-tight scroll-m-20">Orders</h1>
        <p className="text-muted-foreground text-sm md:text-base">
          Manage and track all customer orders. View order details, update status, and process refunds.
        </p>
      </div>
      <OrdersClientPage />
    </div>
  );
}