'use client';

import { Table } from '@tanstack/react-table';
import { Search } from 'lucide-react';

import { DataTableFacetedFilter } from '@/shared/components/molecules/datatable/data-table-faceted-filter';
import { DataTableViewOptions } from '@/shared/components/molecules/datatable/data-table-view-options';
import { DebouncedInput } from '@/components/ui/debounced-input';

interface GenericDataTableToolbarProps<TData> {
  table: Table<TData>;
  searchPlaceholder?: string;
  filterColumn?: string;
  filterTitle?: string;
  filterOptions?: {
    label: string;
    value: string;
    icon?: React.ComponentType<{ className?: string }>;
  }[];
}

export function GenericDataTableToolbar<TData>({
  table,
  searchPlaceholder = 'Search...',
  filterColumn,
  filterTitle,
  filterOptions,
}: GenericDataTableToolbarProps<TData>) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <div className="relative">
          <DebouncedInput
            placeholder={searchPlaceholder}
            value={table.getState().globalFilter ?? ''}
            onChange={(value) => table.setGlobalFilter(value)}
            className="h-8 w-[150px] ps-9 lg:w-[250px]"
          />
        </div>

        {filterColumn && filterTitle && filterOptions && table.getColumn(filterColumn) && (
          <DataTableFacetedFilter
            column={table.getColumn(filterColumn)}
            title={filterTitle}
            options={filterOptions}
          />
        )}
      </div>

      <DataTableViewOptions table={table} />
    </div>
  );
}
