'use client';

import { Add } from '@/features/category/components/organisms/add';
import { useCategories } from '@/features/category/hooks/use-categories';
import { CategoryClientPage } from './page.client';

export default function CategoryPage() {
  const { categories } = useCategories();

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex flex-col space-y-2">
        <div className="flex justify-between items-center">
          <h1 className="font-bold text-3xl tracking-tight scroll-m-20">Categories</h1>
          <Add categories={categories} />
        </div>
        <p className="text-muted-foreground text-sm md:text-base">
          Organize your products with customizable categories. Create, edit and manage your product taxonomy structure.
        </p>
      </div>
      <CategoryClientPage />
    </div>
  );
}