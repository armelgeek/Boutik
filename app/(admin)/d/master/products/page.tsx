'use client';

import { useCategories } from "@/features/category/hooks/use-categories";
import { Add } from "@/features/products/components/organisms/crud/add";
import { ProductsClientPage } from "./page.client";

export default function ProductPage() {
  const { categories } = useCategories();
  return (
    <div className="flex flex-col space-y-6">
      <div className="flex flex-col space-y-2">
        <div className="flex justify-between items-center">
          <h1 className="font-bold text-3xl tracking-tight scroll-m-20">Products</h1>
          <Add categories={categories} />
        </div>
        <p className="text-muted-foreground text-sm md:text-base">
          Manage your product inventory. Add new items, update details, set pricing, and organize products by categories.
        </p>
      </div>
      <ProductsClientPage/>
    </div>
  );
}