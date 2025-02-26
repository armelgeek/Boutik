'use client';

import { ColumnDef } from '@tanstack/react-table';

import { DataTableColumnHeader } from '@/shared/components/molecules/datatable/data-table-column-header';

import { DataTableRowActions } from './data-table-row-actions';
import { Product } from '@/features/products/config/product.type';
import { Category } from '@/features/category/config/category.type';

export const columns: ColumnDef<Product & {category?: Category} & {subcategory?: Category}>[] = [
  {
    id: 'name',
    meta: 'Name',
    accessorFn: (row) => row.name,
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Name"
      />
    ),
    cell: ({ row }) => {
      return <div className="flex w-full">{row.getValue('name')}</div>;
    },
  },
  {
    id: 'price',
    meta: 'Price',
    accessorFn: (row) => row.price,
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Price"
      />
    ),
    cell: ({ row }) => {
      return <div className="flex w-full">{row.getValue('price')} $</div>;
    },
  },
  {
    id: 'category',
    meta: 'Category',
    accessorFn: (row) => row.category,
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Category"
      />
    ),
    cell: ({ row }) => {
      return <div className="flex w-full">{row.getValue('category').name}</div>;
    },
  },
  {
    id: 'subcategory',
    meta: 'Sub Category',
    accessorFn: (row) => row.subcategory,
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Sub Category"
      />
    ),
    cell: ({ row }) => {
      return <div className="flex w-full">{row.getValue('subcategory') ? row.getValue('subcategory').name: ''}</div>;
    },
  },
  {
    id: 'description',
    meta: 'Description',
    accessorFn: (row) => row.description,
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Description"
      />
    ),
    cell: ({ row }) => {
      return <div className="flex w-full">{row.getValue('description')}</div>;
    },
  },
  {
    id: 'actions',
    maxSize: 75,
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
