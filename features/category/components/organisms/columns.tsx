'use client';

import { ColumnDef } from '@tanstack/react-table';

import { DataTableColumnHeader } from '@/shared/components/molecules/datatable/data-table-column-header';
import type { Category } from '@/features/category/config/category.type';

import { DataTableRowActions } from './data-table-row-actions';

export const columns: ColumnDef<Category & { parent: Category | null }>[] = [
  {
    id: 'name',
    meta: 'Name',
    accessorFn: (row) => row.name,
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Name"
      />
    ),
    cell: ({ row }) => {
      return <div className="flex w-full">{row.getValue('name')}</div>;
    },
  },
  {
    id: 'parent',
    meta: 'Parent',
    accessorFn: (row) => row.parent,
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Parent"
      />
    ),
    cell: ({ row }) => {
      return <div className="flex w-full">{row.getValue('parent').name}</div>;
    },
  },
  {
    id: 'actions',
    maxSize: 75,
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
