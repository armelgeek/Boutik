'use client';

import { ColumnDef } from '@tanstack/react-table';

import { DataTableColumnHeader } from '@/shared/components/molecules/datatable/data-table-column-header';
import { Badge } from '@/components/ui/badge';
import { statuses } from '@/features/brand/config/brand.constant';
import type { Brand } from '@/features/brand/config/brand.type';
import { cn } from '@/shared/lib/utils';

import { DataTableRowActions } from './data-table-row-actions';

export const columns: ColumnDef<Brand>[] = [
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
    id: 'status',
    meta: 'Status',
    maxSize: 150,
    accessorFn: (row) => row.status,
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Status"
      />
    ),
    cell: ({ row }) => {
      const status = statuses.find((status) => status.value === row.getValue('status'));

      if (!status) {
        return null;
      }

      return (
        <Badge
          className={cn(
            row.getValue('status') === 'inactive' &&
              'bg-muted-foreground/60 text-primary-foreground',
          )}
        >
          {row.getValue('status')}
        </Badge>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    id: 'actions',
    maxSize: 75,
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
