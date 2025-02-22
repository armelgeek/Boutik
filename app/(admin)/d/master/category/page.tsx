'use client';

import { Add } from '@/features/category/components/organisms/add';
import { useCategories } from '@/features/category/hooks/use-categories';
import { CategoryClientPage } from './page.client';

export default function CategoryPage() {
  const { categories } = useCategories();

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="scroll-m-20 text-3xl font-bold tracking-tight">Category</h1>
        <Add categories={categories} />
      </div>
      <CategoryClientPage/>
    </div>
  );
}
