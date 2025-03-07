"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { formatPrice } from "@/shared/lib/utils/index";
import dayjs from "dayjs";
import Image from "next/image";
import { useOrders } from "@/features/orders/hooks/use-orders";
import Link from "next/link";

function OrdersList() {
  const { orders } = useOrders();
  if (orders.length === 0) return <div>There is no order.</div>;
  return (
    <div className="grid  gap-y-5">
      {orders.map((order) => (
        <Card key={order.id}>
          <CardHeader className="px-6 py-3 flex flex-row justify-between items-center bg-zinc-100">
            <div>
              <p className="font-medium text-xs">Order Placed</p>
              <p className="text-sm">
                {dayjs(order.created_at).format("MMMM DD, YYYY")}
              </p>
            </div>

            <div>
              <p className="font-medium text-xs">Total</p>
              <p className="text-sm">{formatPrice(order.amount)}</p>
            </div>

            <div>
              <p className="font-medium text-xs">Order</p>
              <p className="text-sm">#{order.id}</p>
            </div>
          </CardHeader>

          <CardContent className="py-3 ">
            <h2 className="text-xl font-semibold col-span-12">
              Arrive at Tomorrow 22:00{" "}
            </h2>
            <div className="py-3 grid grid-cols-12 gap-8">
              <div className="flex flex-col gap-5 col-span-12 md:col-span-8">
               {order.items.map((order) =>(
                    <div className="flex items-center gap-5" key={order.id}>
                      <div className="relative">
                        <Image
                          width={80}
                          height={80}
                          src={order.product.images[0] ?? null}
                          alt={order.product.name}
                          className="object-cover w-[80px] h-[80px]"
                        />
                      </div>

                      <div className="flex flex-col gap-2">
                        <Link
                          href={`/product/${order.product.id}`}
                          className="text-blue-600"
                        >
                          {order.product.name} ( x {order.quantity})
                        </Link>
                        <p className="line-clamp-2 tracking-tighter leading-tight">
                          {order.product.description}
                        </p>
                        <p>{formatPrice(order.product.price)}</p>
                      </div>
                    </div>
                    )
                )
            }
              </div>

              <section className="md:col-span-4 w-full col-span-12 flex flex-col gap-3">
               Order Status:{order.status}
              </section>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
export default OrdersList;