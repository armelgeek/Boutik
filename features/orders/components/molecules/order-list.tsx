"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/shared/lib/utils/index";
import dayjs from "dayjs";
import { useOrders } from "@/features/orders/hooks/use-orders";
import Link from "next/link";
import { useState } from "react";
import { ChevronLeft, ChevronRight, Package, Calendar, CreditCard, Hash, ExternalLink } from "lucide-react";
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

  if (isLoading) return (
    <div className="flex justify-center items-center py-12">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
    </div>
  );
  
  if (!orders || orders.length === 0) return (
    <div className="text-center py-12">
      <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
      <p className="text-gray-500">When you place orders, they&apos;ll appear here.</p>
    </div>
  );

  return (
    <>
      <div className="space-y-6">
        {orders.map((order) => (
          <Card key={order.id} className="overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="bg-gray-50/50 border-b border-gray-100 px-6 py-4">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <div className="flex flex-wrap gap-6">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">Order Placed</p>
                      <p className="text-sm font-medium text-gray-900">
                        {dayjs(order.created_at).format("MMMM DD, YYYY")}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">Total</p>
                      <p className="text-sm font-semibold text-gray-900">{formatPrice(order.total)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Hash className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">Order ID</p>
                      <p className="text-sm font-medium text-gray-900">#{String(order.id).slice(-8)}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Badge 
                    variant={
                      order.status.toLowerCase() === 'delivered' ? 'default' :
                      order.status.toLowerCase() === 'cancelled' ? 'destructive' :
                      order.status.toLowerCase() === 'processing' ? 'secondary' : 'outline'
                    }
                    className="capitalize"
                  >
                    {order.status}
                  </Badge>
                  
                  {order.status.toLowerCase() !== 'delivered' &&
                    order.status.toLowerCase() !== 'cancelled' && (
                      <CancelOrderDialog
                        orderId={order.id}
                        onCancelled={() => {
                         
                        }}
                      />
                    )}
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-6">
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div className="flex items-start gap-4 p-4 bg-gray-50/50 rounded-lg border border-gray-100" key={item.id}>
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden">
                        {item.product.images && item.product.images.length > 0 ? (
                          <img
                            width={64}
                            height={64}
                            src={Array.isArray(item.product.images) 
                              ? item.product.images[0]
                              : String(item.product.images).split(',')[0]?.trim()
                            }
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="h-6 w-6 text-gray-400" />
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 pr-4">
                          <Link
                            href={`/product/${item.product.id}`}
                            className="inline-flex items-center gap-1 text-sm font-medium text-orange-600 hover:text-orange-700 transition-colors"
                          >
                            {item.product.name}
                            <ExternalLink className="h-3 w-3" />
                          </Link>
                          
                          <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                            {item.product.description}
                          </p>
                          
                          <div className="mt-2 flex items-center gap-4 text-xs text-gray-500">
                            <span>Qty: {item.quantity}</span>
                            <span>•</span>
                            <span className="font-medium text-gray-900">{formatPrice(item.product.price)}</span>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <p className="text-sm font-semibold text-gray-900">
                            {formatPrice(item.product.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {meta.totalPages > 1 && (
        <div className="flex justify-between items-center bg-white mt-8 px-6 py-4 border border-gray-200 rounded-lg shadow-sm">
          <div className="sm:hidden flex flex-1 justify-between">
            <Button
              variant="outline"
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page <= 1}
              className="inline-flex relative items-center px-4 py-2 font-medium text-sm hover:bg-gray-50"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Previous
            </Button>
            <Button
              variant="outline"
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page >= meta.totalPages}
              className="inline-flex relative items-center px-4 py-2 font-medium text-sm hover:bg-gray-50"
            >
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
          
          <div className="hidden sm:flex sm:flex-1 sm:justify-between sm:items-center">
            <div>
              <p className="text-gray-600 text-sm">
                Showing page <span className="font-semibold text-gray-900">{pagination.page}</span> of{" "}
                <span className="font-semibold text-gray-900">{meta.totalPages}</span>
              </p>
            </div>
            <div>
              <nav className="inline-flex isolate -space-x-px shadow-sm rounded-lg border border-gray-200" aria-label="Pagination">
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page <= 1}
                  className="inline-flex relative items-center px-3 py-2 rounded-l-lg border-r-0 hover:bg-gray-50 disabled:bg-gray-50 disabled:text-gray-400"
                >
                  <span className="sr-only">Previous</span>
                  <ChevronLeft className="w-4 h-4" aria-hidden="true" />
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
                        className="inline-flex relative items-center px-4 py-2 border border-gray-300 bg-white font-medium text-gray-500 text-sm"
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
                      className={`relative inline-flex items-center px-4 py-2 text-sm font-medium border-r-0 ${pagination.page === pageNumber
                        ? "bg-orange-500 text-white border-orange-500 hover:bg-orange-600"
                        : "bg-white text-gray-900 border-gray-300 hover:bg-gray-50"
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
                  className="inline-flex relative items-center px-3 py-2 rounded-r-lg hover:bg-gray-50 disabled:bg-gray-50 disabled:text-gray-400"
                >
                  <span className="sr-only">Next</span>
                  <ChevronRight className="w-4 h-4" aria-hidden="true" />
                </Button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default OrdersList;