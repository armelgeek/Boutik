'use client';

import {
  ColumnDef,
  ColumnFiltersState,
  ColumnSort,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  SortDirection,
  useReactTable,
} from '@tanstack/react-table';

import { DataTablePagination } from '@/shared/components/molecules/datatable/data-table-pagination';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface GenericDataTableProps<TData, TValue> {
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
  emptyMessage?: string;
  loadingMessage?: string;
}

export function GenericDataTable<TData, TValue>({
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
  renderToolbar,
  emptyMessage = 'No results.',
  loadingMessage = 'Loading...',
}: GenericDataTableProps<TData, TValue>) {
  const sort: ColumnSort[] = sortBy && sortDir ? [{ id: sortBy, desc: sortDir === 'desc' }] : [];

  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter: search ?? '',
      sorting: sort ?? [],
      columnFilters: filter ?? [],
      pagination: {
        pageIndex: (page ?? 1) - 1,
        pageSize: pageSize ?? 10,
      },
    },
    getCoreRowModel: getCoreRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    manualFiltering: true,
    manualSorting: true,
    manualPagination: true,
    pageCount: meta.totalPages,
    rowCount: meta.total,
    onGlobalFilterChange: (updater) => {
      const value = typeof updater === 'function' ? updater(search || '') : updater;
      onSearchChange(value);
    },
    onSortingChange: (updater) => {
      const value = typeof updater === 'function' ? updater(sort || []) : updater;
      onSortByChange(value.length ? value[0].id : null);
      onSortDirChange(value.length ? (value[0].desc ? 'desc' : 'asc') : null);
    },
    onColumnFiltersChange: (updater) => {
      const value = typeof updater === 'function' ? updater(filter || []) : updater;
      onFilterChange?.(value);
    },
    onPaginationChange: (updater) => {
      const value =
        typeof updater === 'function' ? updater({ pageIndex: page - 1, pageSize }) : updater;
      onPageChange(value.pageIndex + 1);
      onPageSizeChange(value.pageSize);
    },
    debugAll: false,
  });

  return (
    <div className="space-y-4">
      {renderToolbar(table)}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      colSpan={header.colSpan}
                      style={{ width: header.getSize() }}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  {loadingMessage}
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  );
}
