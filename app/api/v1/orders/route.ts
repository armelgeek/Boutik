import { loadSearchParams } from "@/features/orders/config/order.param";
import { getOrders } from "@/features/orders/domain/use-cases/get-orders.use-case";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const filter = loadSearchParams(request);
  console.log('filter', filter);
  const data = await getOrders(filter);

  return NextResponse.json(data);
}