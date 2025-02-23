import { getSubCategories } from "@/features/category/domain/use-cases/get-sub-categorie.use-case";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: Promise<{ categoryId: string }> }) {
  const categoryId = (await params).categoryId;
  const data = await getSubCategories(categoryId);

  return NextResponse.json(data);
}