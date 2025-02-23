import { getSelectCategories } from "@/features/category/domain/use-cases/get-select-category.use-case";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {

  const data = await getSelectCategories();

  return NextResponse.json(data);
}