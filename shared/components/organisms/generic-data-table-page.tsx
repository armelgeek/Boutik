'use client';

import { SortDirection, ColumnDef } from '@tanstack/react-table';
import { useAdvancedTable } from '@/shared/hooks/use-advanced-table';
import { DataTable } from '@/shared/components/organisms/data-table';
import { BaseService } from '@/core/application/services/base.service';
import { DataTableToolbar } from '@/features/brand/components/organisms/data-table-toolbar';

interface PaginationMeta {
  pagination: {
    total: number;
    totalPages: number;
  };
}


interface GenericDataTablePageProps<T> {
  queryKey: unknown[];
  service: BaseService<T>;
  columns: ColumnDef<T, any>[];
}

export function GenericDataTablePage<T>({
  queryKey,
  service,
  columns,
}: GenericDataTablePageProps<T>) {
 
  const {
    data,
    search,
    page,
    pageSize,
    sortBy,
    sortDir,
    filter,
    isPending,
    isError,
    setSearch,
    setPage,
    setPageSize,
    setSortBy,
    setSortDir,
    handleFilterChange,
  } = useAdvancedTable({
    queryKey,
    queryFn: (params) => service.list(params),
  });

  return (
    <DataTable
      columns={columns}
      data={data?.data ?? []}
      meta={{
        totalPages: data?.meta.pagination?.totalPages ?? 0,
        total: data?.meta.pagination?.total ?? 0,
      }}
      renderToolbar={(table) => <DataTableToolbar table={table} />}
      search={search}
      sortBy={sortBy}
      sortDir={sortDir as SortDirection}
      page={page}
      pageSize={pageSize}
      filter={filter}
      onSearchChange={setSearch}
      onSortByChange={setSortBy}
      onSortDirChange={setSortDir}
      onPageChange={setPage}
      onPageSizeChange={setPageSize}
      onFilterChange={handleFilterChange}
      isLoading={isPending}
      isError={isError}
    />
  );
}
