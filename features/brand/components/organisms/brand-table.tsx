'use client';

import { columns } from './columns';
import type { Brand } from '@/drizzle/schema/brands';
import { DataTable } from '@/components/ui/data-table';

interface BrandTableProps {
  data: {
    items: Brand[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export function BrandTable({ data }: BrandTableProps) {
  return (
    <DataTable
      columns={columns}
      data={data.items}
      pageCount={data.totalPages}
      defaultPageSize={data.limit}
    />
  );
}
