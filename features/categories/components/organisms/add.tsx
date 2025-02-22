'use client';

import { categoryKeys } from '@/core/domain/keys/category.key';
import { CategoryService } from '@/core/services/category.service';
import { GenericAddDialog } from '@/shared/components/organisms/generic-add-dialog';
import { CategoryForm } from '../molecules/category-form';
import type { Category } from '@/core/domain/types/category.type';

export function Add() {
  return (
    <GenericAddDialog<Category>
      service={new CategoryService()}
      title="Add Category"
      description="Add a new category to your store."
      invalidateQueryKey={categoryKeys.all}
    >
      <CategoryForm />
    </GenericAddDialog>
  );
}
