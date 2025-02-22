import { NextResponse } from 'next/server';
import { CategoryService } from '@/core/services/category.service';
import { CategoryFormSchema } from '@/core/domain/schema/category.schema';

const categoryService = new CategoryService();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Number(searchParams.get('page')) || 1;
    const limit = Number(searchParams.get('limit')) || 10;

    const data = await categoryService.findAll({ page, limit });
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = CategoryFormSchema.parse(body);
    const category = await categoryService.create(validatedData);
    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request data' }, { status: 400 });
  }
}
