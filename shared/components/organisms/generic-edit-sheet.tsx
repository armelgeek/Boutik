'use client';

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { BaseService } from '@/core/application/services/base.service';

interface GenericEditSheetProps<T, P extends Partial<T>> {
  service: BaseService<T>;
  title: string;
  description?: string;
  Form: React.ComponentType<{
    initialData: T | null;
    onSubmit: (data: P) => Promise<void>;
    isLoading: boolean;
  }>;
  invalidateQueryKey: string[];
  detailQueryKey: string[];
  slug: string;
}

export function GenericEditSheet<T, P extends Partial<T>>({
  service,
  title,
  description = "Click save when you're done.",
  Form,
  invalidateQueryKey,
  detailQueryKey,
  slug,
}: GenericEditSheetProps<T, P>) {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);

  const { data, isPending } = useQuery({
    queryKey: detailQueryKey,
    queryFn: () => service.detail(slug),
  });

  const { mutate, isPending: isPendingMutation } = useMutation({
    mutationFn: (payload: P) => {
      return service.update(slug, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: invalidateQueryKey });
    },
  });

  const handleSubmit = async (input: P) => {
    mutate(input);
    setIsOpen(false);
  };

  return (
    <Sheet
      open={isOpen}
      onOpenChange={(open) => setIsOpen(open)}
    >
      <SheetTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>Edit</DropdownMenuItem>
      </SheetTrigger>
      <SheetContent className="max-w w-full md:max-w-[500px]">
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription>{description}</SheetDescription>
        </SheetHeader>

        <div className="grid gap-4 py-4">
          {isPending ? (
            'Loading...'
          ) : (
            <Form
              initialData={data as T}
              onSubmit={handleSubmit}
              isLoading={isPendingMutation}
            />
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
