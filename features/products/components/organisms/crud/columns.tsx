'use client';

import { ColumnDef } from '@tanstack/react-table';
import { DataTableColumnHeader } from '@/shared/components/molecules/datatable/data-table-column-header';
import { DataTableRowActions } from './data-table-row-actions';
import { Product } from '@/features/products/config/product.type';
import { Category } from '@/features/category/config/category.type';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';import { formatCurrency } from '@/shared/lib/utils';


export const columns: ColumnDef<Product & {category?: Category} & {subcategory?: Category}>[] = [
  {
    id: 'image',
    meta: 'Image',
    accessorFn: (row) => row.images, 
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Image"
      />
    ),
    cell: ({ row }) => {
      const imageUrl = row.original.images[0] || '/placeholder-product.jpg';
      
      return (
        <div className="flex justify-center items-center rounded-md w-12 h-12 overflow-hidden">
          <Image
            src={imageUrl}
            alt={`Image of ${row.getValue('name')}`}
            width={48}
            height={48}
            className="object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/placeholder-product.jpg';
            }}
          />
        </div>
      );
    },
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
        <div className="flex flex-col">
          <span className="font-medium text-sm">{row.getValue('name')}</span>
          {row.original.name && (
            <span className="text-gray-500 text-xs">SKU: {row.original.slug}</span>
          )}
        </div>
      );
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
      const price = parseFloat(row.getValue('price'));
      return (
        <div className="flex items-center">
          <span className="font-medium">{`$${price}`}</span>
        </div>
      );
    },
  },
  {
    id: 'category',
    meta: 'Category',
    accessorFn: (row) => row,
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Category"
      />
    ),
    cell: ({ row }) => {
      const category = row.original.category as Category;
      const subcategory = row.original.subcategory as Category;
      
      if (!category) return <div className="text-gray-400">-</div>;
      
      return (
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-gray-100">
          {category.name}
        </Badge>
          {subcategory.names && (
             <Badge variant="outline" className="bg-orange-400">
             {subcategory.name}
           </Badge>
          )}
        </div>
       
      );
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
      const description = row.getValue('description') as string;
      
      if (!description) return <div className="text-gray-400">-</div>;
      
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="max-w-xs text-sm truncate">
                {description}
              </div>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="max-w-md">
              <p>{description}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
  },
  {
    id: 'bestseller',
    meta: 'Bestseller',
    accessorFn: (row) => Boolean(row.bestseller),
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Bestseller"
      />
    ),
    cell: ({ row }) => {
      const isBestseller = row.getValue('bestseller');
      
      return (
        <div className="flex w-full">
          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${isBestseller ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
            {isBestseller ? 'Yes' : 'No'}
          </span>
        </div>
      );
    },
  },
  {
    id: 'actions',
    header: () => <span className="sr-only">Actions</span>,
    maxSize: 75,
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];