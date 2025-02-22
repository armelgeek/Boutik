import { NextResponse } from 'next/server';
import { CategoryService } from '@/core/services/category.service';
import { CategoryFormSchema } from '@/core/domain/schema/category.schema';

const categoryService = new CategoryService();

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const category = await categoryService.findBySlug(params.slug);
    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }
    return NextResponse.json(category);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const body = await request.json();
    const validatedData = CategoryFormSchema.parse(body);
    const category = await categoryService.update(params.slug, validatedData);
    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }
    return NextResponse.json(category);
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request data' }, { status: 400 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const category = await categoryService.delete(params.slug);
    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }
    return NextResponse.json(category);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
