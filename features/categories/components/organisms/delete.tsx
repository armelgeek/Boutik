'use client';

import { categoryKeys } from '@/core/domain/keys/category.key';
import { CategoryService } from '@/core/services/category.service';
import { GenericDeleteDialog } from '@/shared/components/organisms/generic-delete-dialog';
import type { Category } from '@/core/domain/types/category.type';

interface DeleteProps {
  slug: string;
}

export function Delete({ slug }: DeleteProps) {
  return (
    <GenericDeleteDialog<Category>
      service={new CategoryService()}
      title="Delete Category"
      description="This action cannot be undone. This will permanently delete this category and remove the data from our servers."
      invalidateQueryKey={categoryKeys.all}
      slug={slug}
    />
  );
}
