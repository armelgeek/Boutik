'use client';

import { brandKeys } from '@/core/domain/keys/brand.key';
import { columns } from '@/features/brand/components/organisms/columns';
import { BrandServiceImpl } from '@/core/application/services/brand/brand.service';
import { GenericDataTablePage } from '@/shared/components/organisms/generic-data-table-page';
import { useQueryStateParams } from '@/shared/hooks/use-query-state-params';
import { Brand } from '@/core/domain/types/brand.type';

export function BrandClientPage() {
  const queryParams = useQueryStateParams();
  
  return (
    <GenericDataTablePage<Brand>
      queryKey={brandKeys.list(queryParams)}
      service={new BrandServiceImpl()}
      columns={columns}
    />
  );
}
