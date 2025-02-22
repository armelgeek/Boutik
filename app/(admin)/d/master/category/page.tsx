import type { Metadata } from 'next';
import { Add } from '@/features/categories/components/organisms/add';
import { CategoryClientPage } from './page.client';

export const metadata: Metadata = {
  title: 'Categories - Admin Dashboard',
  description: 'Manage your store categories',
};

export default function CategoryPage() {
  return (
    <div className="flex flex-col space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="scroll-m-20 text-3xl font-bold tracking-tight">Categories</h1>
        <Add />
      </div>

      <CategoryClientPage />
    </div>
  );
}
