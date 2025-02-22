'use client';

import type { Row } from '@tanstack/react-table';
import { Edit } from './edit';
import { Delete } from './delete';
import type { Category } from '@/core/domain/types/category.type';

interface DataTableRowActionsProps {
  row: Row<Category>;
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
  return (
    <div className="flex items-center space-x-2">
      <Edit slug={row.original.slug} />
      <Delete slug={row.original.slug} />
    </div>
  );
}
