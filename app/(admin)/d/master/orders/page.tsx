'use client';

import { OrdersClientPage } from "./page.client";

export default function OrderPage() {
  return (
    <div className="flex flex-col space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="font-bold text-3xl tracking-tight scroll-m-20">Orders</h1>
      </div>
      <OrdersClientPage />
    </div>
  );
}
