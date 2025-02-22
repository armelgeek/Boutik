'use client';

import { useState } from 'react';



import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';



import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';


import { CategoryServiceImpl } from '../../domain/category.service';
import { Category, CategoryPayload } from '../../config/category.type';
import { CategoryForm } from '../molecules/category-form';
import { SelectOption } from '@/shared/components/molecules/form/ControlledSelect';
import { categoryKeys } from '../../config/category.key';

interface EditProps {
  slug: string;
  isOpenDropdown: boolean;
  setIsOpenDropdown: (open: boolean) => void;
  categories: SelectOption[]
}

export function Edit({ slug, categories, setIsOpenDropdown }: EditProps) {
  const queryClient = useQueryClient();

  const [isOpen, setIsOpen] = useState(false);

  const { data, isPending } = useQuery({
    queryKey: categoryKeys.detail(slug),
    queryFn: () => new CategoryServiceImpl().detail(slug),
  });

  const { mutate, isPending: isPendingMutation } = useMutation({
    mutationFn: (payload: CategoryPayload) => {
      return new CategoryServiceImpl().update(slug, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
    },
  });

  const handleSubmit = async (input: CategoryPayload) => {
    mutate(input);
    setIsOpen(false);
    setIsOpenDropdown(false);
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
          <SheetTitle>Edit Category</SheetTitle>
          <SheetDescription>Click save when you&#39;re done.</SheetDescription>
        </SheetHeader>

        <div className="grid gap-4 py-4">
          {isPending ? (
            'Loading...'
          ) : (
            <CategoryForm
              initialData={data as Category}
              onSubmit={handleSubmit}
              categories={categories}
              //isLoading={isPendingMutation}
            />
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
