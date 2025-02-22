'use client';

import { useState } from 'react';
import { Row } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface GenericDataTableRowActionsProps<TData> {
  row: Row<TData>;
  editComponent: React.ReactNode;
  deleteComponent: React.ReactNode;
}

export function GenericDataTableRowActions<TData>({
  row,
  editComponent,
  deleteComponent,
}: GenericDataTableRowActionsProps<TData>) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <DropdownMenu
      open={isOpen}
      onOpenChange={(open) => setIsOpen(open)}
    >
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <MoreHorizontal
            size={16}
            strokeWidth={2}
            aria-hidden="true"
          />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-[160px]"
      >
        {editComponent}
        {deleteComponent}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
