import type { Metadata } from 'next';

import { Add } from '../../../../../features/brand/components/organisms/add';
import { BrandClientPage } from './page.client';

export const metadata: Metadata = {
  title: 'Boutik',
  description: 'Generated by create next app',
};

export default function BrandPage() {
  return (
    <div className="flex flex-col space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="scroll-m-20 text-3xl font-bold tracking-tight">Brand</h1>

        <Add />
      </div>

      <BrandClientPage />
    </div>
  );
}
