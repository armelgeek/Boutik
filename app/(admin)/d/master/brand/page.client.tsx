'use client';

import { brandKeys } from '@/features/brand/config/brand.key';

import { columns } from '@/features/brand/components/organisms/columns';
import { DataTable } from '@/features/brand/components/organisms/data-table';
import { useAdvancedTable } from '@/shared/hooks/use-advanced-table';
import { SortDirection } from '@tanstack/react-table';
import { useQueryStateParams } from '@/shared/hooks/use-query-state-params';
import { brandService } from '@/features/brand/domain/brand.service';

export function BrandClientPage() {
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
    queryKey: brandKeys.list(queryParams),
    queryFn: (params) => brandService.list(params),
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
