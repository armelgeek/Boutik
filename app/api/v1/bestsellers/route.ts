import { NextResponse } from 'next/server';
import { getBestSellerProducts } from '@/features/products/domain/use-cases/get-bestseller-product.use-case';

export async function GET() {
  const data = await getBestSellerProducts();

  return NextResponse.json(data);
}