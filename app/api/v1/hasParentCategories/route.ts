import { NextResponse } from 'next/server';
import { getHasParentCategories } from '@/features/category/domain/use-cases/get-has-parent-categories.use-case';

export async function GET() {
  const data = await getHasParentCategories();

  return NextResponse.json(data);
}