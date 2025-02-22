import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

import { auth } from '@/auth';
import { createCategory } from '@/features/category/domain/use-cases/create-category.use-case';
import { getCategories } from '@/features/category/domain/use-cases/get-categories.use-case';
import { loadSearchParams } from '@/features/category/config/category.param';

export async function GET(request: NextRequest) {
  const filter = loadSearchParams(request);
  const data = await getCategories(filter);

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
  const data = await createCategory(body);

  return NextResponse.json(data);
}
