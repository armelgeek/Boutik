'use client';

import { categoryKeys } from '@/features/category/config/category.key';
import { columns } from '@/features/category/components/organisms/columns';
import { DataTable } from '@/features/category/components/organisms/data-table';
import { useAdvancedTable } from '@/shared/hooks/use-advanced-table';
import { SortDirection } from '@tanstack/react-table';
import { useQueryStateParams } from '@/shared/hooks/use-query-state-params';
import { categoryService } from '@/features/category/domain/category.service';

export function CategoryClientPage() {
  const queryParams = useQueryStateParams();

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
    queryKey: categoryKeys.list(queryParams),
    queryFn: (params) => categoryService.list(params),
  });
  return (
    <DataTable
      columns={columns}
      data={data?.data ?? []}
      meta={{
        totalPages: data?.meta.pagination?.totalPages ?? 0,
        total: data?.meta.pagination?.total ?? 0,
      }}
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
