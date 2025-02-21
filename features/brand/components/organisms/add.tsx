'use client';

import { BrandForm } from '@/features/brand/components/molecules/brand-form';
import { brandKeys } from '@/core/domain/keys/brand.key';
import { Brand, BrandPayload } from '@/core/domain/types/brand.type';
import { BrandServiceImpl } from '@/core/application/services/brand/brand.service';
import { GenericAddSheet } from '@/shared/components/organisms/generic-add-sheet';

export function Add() {
  return (
    <GenericAddSheet<Brand, BrandPayload>
      service={new BrandServiceImpl()}
      title="Add Brand"
      Form={BrandForm}
      invalidateQueryKey={[...brandKeys.all]}
    />
  );
}
