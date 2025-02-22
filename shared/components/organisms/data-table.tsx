'use client';

import {
  ColumnDef,
  ColumnFiltersState,
  SortDirection,
  useReactTable,
} from '@tanstack/react-table';

import { GenericDataTable } from '@/shared/components/organisms/generic-data-table';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  meta: {
    total: number;
    totalPages: number;
  };
  search: string | null;
  sortBy: string | null;
  sortDir: SortDirection | null;
  page: number;
  pageSize: number;
  filter?: ColumnFiltersState | null;
  onSearchChange: (search: string | null) => void;
  onSortByChange: (sort: string | null) => void;
  onSortDirChange: (sort: SortDirection | null) => void;
  onPageChange: (page: number) => void;
  onPageSizeChange: (page: number) => void;
  onFilterChange?: (filters: ColumnFiltersState) => void;
  isLoading: boolean;
  isError: boolean;
  renderToolbar: (table: ReturnType<typeof useReactTable>) => React.ReactNode;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  meta,
  search,
  sortBy,
  sortDir,
  page,
  pageSize,
  filter,
  onSearchChange,
  onSortByChange,
  onSortDirChange,
  onPageChange,
  onPageSizeChange,
  onFilterChange,
  isLoading,
  isError,
  renderToolbar,
}: DataTableProps<TData, TValue>) {
  return (
    <GenericDataTable
      columns={columns}
      data={data}
      meta={meta}
      search={search}
      sortBy={sortBy}
      sortDir={sortDir}
      page={page}
      pageSize={pageSize}
      filter={filter}
      onSearchChange={onSearchChange}
      onSortByChange={onSortByChange}
      onSortDirChange={onSortDirChange}
      onPageChange={onPageChange}
      onPageSizeChange={onPageSizeChange}
      onFilterChange={onFilterChange}
      isLoading={isLoading}
      isError={isError}
      renderToolbar={renderToolbar}
      emptyMessage="No data found."
      loadingMessage="Loading..."
    />
  );
}
