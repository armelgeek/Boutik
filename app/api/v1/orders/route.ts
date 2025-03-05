import { NextRequest, NextResponse } from "next/server";
import { createOrder } from "@/features/orders/domain/use-cases/create-order.use-case";
import { handleApiError } from "@/shared/lib/utils/handle-api-error";
import { z } from "zod";

const createOrderSchema = z.object({
  items: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      price: z.number(),
      image: z.string().optional(),
      size: z.string().optional(),
      quantity: z.number().min(1),
    })
  ),
  total: z.number(),
  shippingAddress: z
    .object({
      fullName: z.string(),
      address: z.string(),
      city: z.string(),
      postalCode: z.string(),
      country: z.string(),
      phone: z.string(),
    })
    .optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = createOrderSchema.parse(body);

    const order = await createOrder({
      items: validatedData.items,
      total: validatedData.total,
      shippingAddress: validatedData.shippingAddress,
    });

    return NextResponse.json(order);
  } catch (error) {
    return handleApiError(error);
  }
}
