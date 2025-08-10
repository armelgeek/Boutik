'use client';

import { ColumnDef } from '@tanstack/react-table';
import Image from 'next/image';

import { DataTableColumnHeader } from '@/shared/components/molecules/datatable/data-table-column-header';
import type { Category } from '@/features/category/config/category.type';

import { DataTableRowActions } from './data-table-row-actions';

export const columns: ColumnDef<Category & { parent: Category | null }>[] = [
  {
    id: 'image',
    meta: 'Image',
    accessorFn: (row) => row.image,
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Image"
      />
    ),
    cell: ({ row }) => {
      const imageUrl = row.getValue('image') as string | null;
      return (
        <div className="flex justify-center w-full">
          {imageUrl ? (
            <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-gray-200">
              <Image
                src={imageUrl}
                alt={`${row.getValue('name')} category`}
                fill
                className="object-cover"
                sizes="48px"
              />
            </div>
          ) : (
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200">
              <svg 
                className="w-6 h-6 text-gray-400" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          )}
        </div>
      );
    },
    size: 80,
  },
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
      return (
        <div className="flex items-center gap-3 w-full">
          <div className="flex flex-col">
            <span className="font-medium text-gray-900">{row.getValue('name')}</span>
            <span className="text-sm text-gray-500 capitalize">{row.original.slug}</span>
          </div>
        </div>
      );
    },
  },
  {
    id: 'parent',
    meta: 'Parent',
    accessorFn: (row) => row.parent,
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Parent"
      />
    ),
    cell: ({ row }) => {
      const parent = row.getValue('parent') as Category | null;
      return (
        <div className="flex w-full">
          {parent ? (
            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-orange-100 text-orange-700">
              {parent.name}
            </span>
          ) : (
            <span className="text-gray-400 text-sm">Root category</span>
          )}
        </div>
      );
    },
  },
  {
    id: 'actions',
    maxSize: 75,
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
