'use client';

import { useState } from 'react';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus } from 'lucide-react';

import { BrandForm } from '@/features/brand/components/molecules/brand-form';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { brandKeys } from '@/core/domain/brand/brand.key';
import { BrandPayload } from '@/core/domain/brand/brand.type';

import { BrandServiceImpl } from '../../../../core/application/services/brand/brand.service';

export function Add() {
  const queryClient = useQueryClient();

  const [isOpen, setIsOpen] = useState(false);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (payload: BrandPayload) => {
      return new BrandServiceImpl().create(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: brandKeys.all });
    },
  });

  const handleSubmit = async (input: BrandPayload) => {
    await mutateAsync(input);
    setIsOpen(false);
  };

  return (
    <Sheet
      open={isOpen}
      onOpenChange={(open) => setIsOpen(open)}
    >
      <SheetTrigger asChild>
        <Button>
          <Plus
            className="-ms-1 me-2"
            size={16}
            strokeWidth={2}
            aria-hidden="true"
          />
          Add Brand
        </Button>
      </SheetTrigger>
      <SheetContent className="max-w w-full md:max-w-[500px]">
        <SheetHeader>
          <SheetTitle>Add Brand</SheetTitle>
          <SheetDescription>Click save when you&#39;re done.</SheetDescription>
        </SheetHeader>

        <div className="grid gap-4 py-4">
          <BrandForm
            initialData={null}
            onSubmit={handleSubmit}
            isLoading={isPending}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
