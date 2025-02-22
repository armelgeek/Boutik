import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

import { auth } from '@/auth';
import { deleteBrand } from '@/features/brand/domain/use-cases/brand/delete-brand.use-case';
import { getBrand } from '@/features/brand/domain/use-cases/brand/get-brand.use-case';
import { updateBrand } from '@/features/brand/domain/use-cases/brand/update-brand.use-case';

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const slug = (await params).slug;
  const data = await getBrand(slug);

  return NextResponse.json(data);
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const slug = (await params).slug;
  const body = await request.json();
  await updateBrand(slug, body);

  return NextResponse.json({ message: 'Brand updated successfully' });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const slug = (await params).slug;
  await deleteBrand(slug);

  return NextResponse.json({ message: 'Brand deleted successfully' });
}
