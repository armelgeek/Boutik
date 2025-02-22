'use client';

import { categoryKeys } from '@/core/domain/keys/category.key';
import { CategoryService } from '@/core/services/category.service';
import { GenericEditDialog } from '@/shared/components/organisms/generic-edit-dialog';
import { CategoryForm } from '../molecules/category-form';
import type { Category } from '@/core/domain/types/category.type';

interface EditProps {
  slug: string;
}

export function Edit({ slug }: EditProps) {
  return (
    <GenericEditDialog<Category>
      service={new CategoryService()}
      title="Edit Category"
      description="Make changes to your category here."
      invalidateQueryKey={categoryKeys.all}
      slug={slug}
    >
      <CategoryForm />
    </GenericEditDialog>
  );
}
