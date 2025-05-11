import { columns } from "@/features/orders/components/organisms/columns";
import { orderKeys } from "@/features/orders/config/order.key";
import { orderService } from "@/features/orders/domain/order.service";
import { DataTable } from "@/shared/components/molecules/datatable/data-table";
import { useAdvancedTable } from "@/shared/hooks/use-advanced-table";
import { useQueryStateParams } from "@/shared/hooks/use-query-state-params";
import { SortDirection } from "@tanstack/react-table";

export function OrdersClientPage() {
    const queryParams = useQueryStateParams();

     const {
    data,
    page,
    pageSize,
    sortBy,
    sortDir,
    filter,
    isPending,
    isError,
    setPage,
    setPageSize,
    setSortBy,
    setSortDir,
    handleFilterChange,
    handleDateRangeChange
  } = useAdvancedTable({
    queryKey: orderKeys.list(queryParams),
    queryFn: (params) => orderService.list(params),
  });
    return (
    <DataTable
        columns={columns}
        data={data?.data ?? []}
        meta={{
            totalPages: data?.meta.pagination?.totalPages ?? 0,
            total: data?.meta.pagination?.total ?? 0,
        }}
        search={null}
        sortBy={sortBy}
        sortDir={sortDir as SortDirection}
        page={page}
        pageSize={pageSize}
        filter={filter}
        onSortByChange={setSortBy}
        onSortDirChange={setSortDir}
        onDateRangeChange={handleDateRangeChange}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
        onFilterChange={handleFilterChange}
        isLoading={isPending}
        isError={isError}
    />
    )
}