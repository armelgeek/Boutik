import { columns } from "@/features/products/components/organisms/crud/columns";
import { productKeys } from "@/features/products/config/product.key";
import { productService } from "@/features/products/domain/product.service";
import { DataTable } from "@/shared/components/molecules/datatable/data-table";
import { useAdvancedTable } from "@/shared/hooks/use-advanced-table";
import { useQueryStateParams } from "@/shared/hooks/use-query-state-params";
import { SortDirection } from "@tanstack/react-table";

export function ProductsClientPage() {
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
    queryKey: productKeys.list(queryParams),
    queryFn: (params) => productService.list(params),
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
    )
}