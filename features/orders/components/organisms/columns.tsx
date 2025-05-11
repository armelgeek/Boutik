'use client';

import { ColumnDef } from '@tanstack/react-table';

import { DataTableColumnHeader } from '@/shared/components/molecules/datatable/data-table-column-header';

import { OrderStatus, StatusButton } from './status-button';
import { formatDate } from '../../../../shared/lib/utils/index';

export const columns: ColumnDef<any>[] = [
  {
    id: 'id',
    meta: 'id',
    size: 100,
    accessorFn: (row) => row.id,
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="ID Commande"
      />
    ),
    cell: ({ row }) => <div className="w-full truncate">{row.getValue('id')}</div>,
  },
  {
    id: 'user',
    meta: 'user',
    size: 250,
    accessorFn: (row) => row.user,
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Utilisateur"
      />
    ),
    cell: ({ row }) => {
      const user = row.getValue('user') as any;
      const imageUrl = user?.image ?? '/globe.svg';

      return user ? (
        <div className="flex items-center gap-3">
          <img
            src={imageUrl}
            alt={user.name}
            className="rounded-full w-10 h-10 object-cover"
          />
          <div className="flex flex-col">
            <span className="font-medium text-sm">{user.name}</span>
            <span className="text-muted-foreground text-xs">{user.email}</span>
          </div>
        </div>
      ) : (
        <span className="text-muted-foreground">Utilisateur non trouvé</span>
      );
    },
  },
  {
    id: 'total',
    meta: 'total',
    size: 100,
    accessorFn: (row) => row.total,
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Total"
      />
    ),
    cell: ({ row }) => <div className="w-full">{row.getValue('total')}€</div>,
  },
  {
    id: 'items',
    meta: 'items',
    size: 350,
    accessorFn: (row) => row.items,
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Articles"
      />
    ),
    cell: ({ row }) => {
      const items = row.original.items || [];
      return (
        <div className="gap-3 grid">
          {items.map((item: any, index: number) => {
            const imageUrl = item.product.images?.[0] ?? '/placeholder.png';
            return (
              <div
                key={index}
                className="flex items-center gap-3 bg-muted/50 shadow-sm p-3 border rounded-xl"
              >
                <img
                  src={imageUrl}
                  alt={item.product.name}
                  className="border rounded-md w-12 h-12 object-cover"
                />
                <div className="flex flex-col gap-0.5">
                  <p className="font-semibold text-sm">{item.product.name}</p>
                  <div className="text-muted-foreground text-xs">
                    Quantité: {item.quantity} • Prix: ${item.price}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      );
    },
  },
  {
    id: 'createdAt',
    meta: 'createdAt',
    size: 30,
    accessorFn: (row) => row.createdAt,
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Date de commande"
      />
    ),
    cell: ({ row }) => <div className="w-full">{formatDate(row.getValue('createdAt'))}</div>,
  },
  {
    id: 'actions',
    meta: 'actions',
    size: 220,
    cell: ({ row }) => {
      const orderId = row.getValue('id') as string;
      return (
        <StatusButton
          updatedAt={row.original.updatedAt}
          orderId={orderId}
          currentStatus={row.original.status as OrderStatus}
        />
      );
    },
  },
];
