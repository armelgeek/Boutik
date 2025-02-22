import type { Metadata } from 'next';
import { Add } from '@/features/brand/components/organisms/add';
import { BrandTable } from '@/features/brand/components/organisms/brand-table';
import { getBrands } from '@/features/brand/actions';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Brands - Admin Dashboard',
  description: 'Manage your store brands',
};

export default async function BrandPage({
  searchParams,
}: {
  searchParams: { page?: string; search?: string };
}) {
  const page = Number(searchParams.page) || 1;
  const brands = await getBrands(page, 10, searchParams.search);

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="scroll-m-20 text-3xl font-bold tracking-tight">Brands</h1>
        <Add />
      </div>

      <Suspense fallback={<div>Loading...</div>}>
        <BrandTable data={brands} />
      </Suspense>
    </div>
  );
}
