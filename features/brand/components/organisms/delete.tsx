'use client';

import { brandKeys } from '@/core/domain/keys/brand.key';
import { Brand } from '@/core/domain/types/brand.type';
import { BrandServiceImpl } from '@/core/application/services/brand/brand.service';
import { GenericDeleteDialog } from '@/shared/components/organisms/generic-delete-dialog';

interface DeleteProps {
  slug: string;
}

export function Delete({ slug }: DeleteProps) {
  return (
    <GenericDeleteDialog<Brand>
      service={new BrandServiceImpl()}
      title="Delete Brand"
      description="This action cannot be undone. This will permanently delete this brand and remove the data from our servers."
      invalidateQueryKey={[...brandKeys.all]}
      slug={slug}
    />
  );
}
