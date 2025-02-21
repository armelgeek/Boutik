'use client';

import { Table } from '@tanstack/react-table';
import { statuses } from '@/core/domain/constants/brand.constant';
import { GenericDataTableToolbar } from '@/shared/components/organisms/generic-data-table-toolbar';

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({ table }: DataTableToolbarProps<TData>) {
  return (
    <GenericDataTableToolbar
      table={table}
      searchPlaceholder="Search brand..."
      filterColumn="status"
      filterTitle="Status"
      filterOptions={statuses}
    />
  );
}
