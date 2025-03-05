import { NextRequest, NextResponse } from "next/server";
import { getRelatedProducts } from "@/features/products/domain/use-cases/get-related-products.use-case";
import { handleApiError } from "@/shared/lib/utils/handle-api-error";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const categoryId = searchParams.get("category");
    const subCategoryId = searchParams.get("subcategory");

    if (!categoryId) {
      return NextResponse.json(
        { error: "Category ID is required" },
        { status: 400 }
      );
    }

    const products = await getRelatedProducts(
      categoryId,
      subCategoryId || undefined,
      5 
    );

    return NextResponse.json(products);
  } catch (error) {
    return handleApiError(error);
  }
}
