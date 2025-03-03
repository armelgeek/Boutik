import { getLatestProducts } from '@/features/products/domain/use-cases/get-latest-product.use-case';
import { NextResponse } from 'next/server';

export async function GET() {
  const data = await getLatestProducts();

  return NextResponse.json(data);
}