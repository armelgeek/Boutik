import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

import { auth } from '@/auth';
import { createBrand } from '@/core/application/use-cases/brand/create-brand.use-case';
import { getBrands } from '@/core/application/use-cases/brand/get-brands.use-case';
import { loadSearchParams } from '@/core/domain/brand/brand.param';

export async function GET(request: NextRequest) {
  const filter = loadSearchParams(request);
  const data = await getBrands(filter);

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
  const data = await createBrand(body);

  return NextResponse.json(data);
}
