'use client';

import { useState } from 'react';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { CategoryServiceImpl } from '../../domain/category.service';
import { CategoryPayload } from '../../config/category.type';
import { SelectOption } from '@/shared/components/molecules/form/ControlledSelect';
import { CategoryForm } from '../molecules/category-form';
import { categoryKeys } from '../../config/category.key';

export function Add({ categories }: { categories: SelectOption[] }) {
  const queryClient = useQueryClient();

  const [isOpen, setIsOpen] = useState(false);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (payload: CategoryPayload) => {
      return new CategoryServiceImpl().create(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
    },
  });

  const handleSubmit = async (input: CategoryPayload) => {
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
          Add Category
        </Button>
      </SheetTrigger>
      <SheetContent className="max-w w-full md:max-w-[500px]">
        <SheetHeader>
          <SheetTitle>Add Category</SheetTitle>
          <SheetDescription>Click save when you&#39;re done.</SheetDescription>
        </SheetHeader>

        <div className="grid gap-4 py-4">
          <CategoryForm
            initialData={null}
            categories={categories}
            onSubmit={handleSubmit}
           // isLoading={isPending}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
