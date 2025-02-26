'use client';

import { useCategories } from "@/features/category/hooks/use-categories";
import { Add } from "@/features/products/components/organisms/crud/add";
import { ProductsClientPage } from "./page.client";

export default function ProductPage() {
  const { categories } = useCategories();
  return (
    <div className="flex flex-col space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="scroll-m-20 text-3xl font-bold tracking-tight">Products</h1>
        <Add categories={categories} />
      </div>
      <ProductsClientPage/>
    </div>
  );
}
