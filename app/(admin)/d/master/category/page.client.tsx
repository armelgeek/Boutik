'use client';

import { categoryKeys } from '@/core/domain/keys/category.key';
import { columns } from '@/features/categories/components/organisms/columns';
import { CategoryService } from '@/core/services/category.service';
import { GenericDataTablePage } from '@/shared/components/organisms/generic-data-table-page';
import { useQueryStateParams } from '@/shared/hooks/use-query-state-params';
import type { Category } from '@/core/domain/types/category.type';

export function CategoryClientPage() {
  const queryParams = useQueryStateParams();
  const filter = {
    value: queryParams.search || '',
    field: 'name',
    operator: 'contains' as const,
  };

  return (
    <GenericDataTablePage<Category>
      queryKey={[categoryKeys.all[0], 'list', filter]}
      service={new CategoryService()}
      columns={columns}
      searchPlaceholder="Search categories..."
    />
  );
}
