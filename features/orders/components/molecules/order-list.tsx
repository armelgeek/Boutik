"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/shared/lib/utils/index";
import dayjs from "dayjs";
import { useOrders } from "@/features/orders/hooks/use-orders";
import Link from "next/link";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { CancelOrderDialog } from "./cancel-order-dialog";

function OrdersList() {
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
  });

  const { data: orders, isLoading, meta } = useOrders(pagination);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > meta.totalPages) return;
    setPagination(prev => ({
      ...prev,
      page: newPage
    }));
  };

  if (isLoading) return <div className="flex justify-center py-8">Loading orders...</div>;
  if (!orders || orders.length === 0) return <div>There is no order.</div>;

  return (
    <>
      <div className="gap-y-5 grid">
        {orders.map((order) => (
          <Card key={order.id}>
            <CardHeader className="flex flex-row justify-between items-center bg-zinc-100 px-6 py-3">
              <div>
                <p className="font-medium text-xs">Order Placed</p>
                <p className="text-sm">
                  {dayjs(order.created_at).format("MMMM DD, YYYY")}
                </p>
              </div>

              <div>
                <p className="font-medium text-xs">Total</p>
                <p className="text-sm">{formatPrice(order.total)}</p>
              </div>

              <div>
                <p className="font-medium text-xs">Order</p>
                <p className="text-sm">#{order.id}</p>
              </div>
              {order.status.toLowerCase() !== 'delivered' &&
                order.status.toLowerCase() !== 'cancelled' && (
                  <CancelOrderDialog
                    orderId={order.id}
                    onCancelled={() => {
                     
                    }}
                  />
                )}
              
            </CardHeader>

            <CardContent className="py-3">
              <div className="gap-8 grid grid-cols-12 py-3">
                <div className="flex flex-col gap-5 col-span-12 md:col-span-8">
                  {order.items.map((item) => (
                    <div className="flex items-center gap-5" key={item.id}>
                      <div className="relative">
                        <img
                          width={80}
                          height={80}
                          src={item.product.images[0] ?? null}
                          alt={item.product.name}
                          className="w-[80px] h-[80px] object-cover"
                        />
                      </div>

                      <div className="flex flex-col gap-2">
                        <Link
                          href={`/product/${item.product.id}`}
                          className="text-blue-600"
                        >
                          {item.product.name} ( x {item.quantity})
                        </Link>
                        <p className="line-clamp-2 leading-tight tracking-tighter">
                          {item.product.description}
                        </p>
                        <p>{formatPrice(item.product.price)}</p>
                      </div>
                    </div>
                  )
                  )}
                </div>

                <section className="flex flex-col gap-3 col-span-12 md:col-span-4 w-full">
                  Order Status: {order.status}
                </section>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-between items-center bg-white mt-5 px-4 sm:px-6 py-3 border-gray-200 border-t">
        <div className="sm:hidden flex flex-1 justify-between">
          <Button
            variant="outline"
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={pagination.page <= 1}
            className="inline-flex relative items-center px-4 py-2 font-medium text-sm"
          >
            Previous
          </Button>
          <Button
            variant="outline"
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={pagination.page >= meta.totalPages}
            className="inline-flex relative items-center ml-3 px-4 py-2 font-medium text-sm"
          >
            Next
          </Button>
        </div>
        {meta.totalPages > 1 && (
          <div className="hidden sm:flex sm:flex-1 sm:justify-between sm:items-center">
            <div>
              <p className="text-gray-700 text-sm">
                Showing page <span className="font-medium">{pagination.page}</span> of{" "}
                <span className="font-medium">{meta.totalPages}</span>
              </p>
            </div>
            <div>
              <nav className="inline-flex isolate -space-x-px shadow-sm rounded-md" aria-label="Pagination">
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page <= 1}
                  className="inline-flex relative items-center px-2 py-2 rounded-l-md"
                >
                  <span className="sr-only">Previous</span>
                  <ChevronLeft className="w-5 h-5" aria-hidden="true" />
                </Button>

                {[...Array(meta.totalPages)].map((_, i) => {
                  const pageNumber = i + 1;
                  const showPageNumber =
                    pageNumber === 1 ||
                    pageNumber === meta.totalPages ||
                    (pageNumber >= pagination.page - 1 && pageNumber <= pagination.page + 1);

                  const showEllipsis =
                    (pageNumber === 2 && pagination.page > 3) ||
                    (pageNumber === meta.totalPages - 1 && pagination.page < meta.totalPages - 2);

                  if (showEllipsis) {
                    return (
                      <span
                        key={`ellipsis-${pageNumber}`}
                        className="inline-flex relative items-center px-4 py-2 focus:outline-offset-0 ring-1 ring-gray-300 ring-inset font-medium text-gray-700 text-sm"
                      >
                        ...
                      </span>
                    );
                  }

                  return showPageNumber ? (
                    <Button
                      key={pageNumber}
                      variant={pagination.page === pageNumber ? "default" : "outline"}
                      onClick={() => handlePageChange(pageNumber)}
                      className={`relative inline-flex items-center px-4 py-2 text-sm font-medium ${pagination.page === pageNumber
                        ? "bg-blue-600 text-white"
                        : "text-gray-900"
                        }`}
                    >
                      {pageNumber}
                    </Button>
                  ) : null;
                })}

                <Button
                  variant="outline"
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page >= meta.totalPages}
                  className="inline-flex relative items-center px-2 py-2 rounded-r-md"
                >
                  <span className="sr-only">Next</span>
                  <ChevronRight className="w-5 h-5" aria-hidden="true" />
                </Button>
              </nav>
            </div>
          </div>
        )}

      </div>
    </>
  );
}

export default OrdersList;