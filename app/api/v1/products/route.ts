import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

import { auth } from '@/auth';
import { createProduct } from '@/features/products/domain/use-cases/create-product.use-case';
import { getProducts } from '@/features/products/domain/use-cases/get-products.use-case';
import { loadSearchParams } from '@/features/products/config/product.param';

export async function GET(request: NextRequest) {
  const filter = loadSearchParams(request);
  const data = await getProducts(filter);

  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const data = await createProduct(body);

  return NextResponse.json(data);
}
