'use client';

import { BrandForm } from '@/features/brand/components/molecules/brand-form';
import { brandKeys } from '@/core/domain/keys/brand.key';
import { Brand, BrandPayload } from '@/core/domain/types/brand.type';
import { BrandServiceImpl } from '@/core/application/services/brand/brand.service';
import { GenericEditSheet } from '@/shared/components/organisms/generic-edit-sheet';

interface EditProps {
  slug: string;
}

export function Edit({ slug }: EditProps) {
  return (
    <GenericEditSheet<Brand, BrandPayload>
      service={new BrandServiceImpl()}
      title="Edit Brand"
      Form={BrandForm}
      invalidateQueryKey={[...brandKeys.all]}
      detailQueryKey={[...brandKeys.detail(slug)]}
      slug={slug}
    />
  );
}
