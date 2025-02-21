'use client';

import { Row } from '@tanstack/react-table';
import { BrandSelectSchema } from '@/core/domain/schema/brand.schema';
import { GenericDataTableRowActions } from '@/shared/components/organisms/generic-data-table-row-actions';
import { Delete } from './delete';
import { Edit } from './edit';

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({ row }: DataTableRowActionsProps<TData>) {
  const brand = BrandSelectSchema.parse(row.original);

  return (
    <GenericDataTableRowActions
      row={row}
      editComponent={<Edit slug={brand.slug} />}
      deleteComponent={<Delete slug={brand.slug} />}
    />
  );
}
