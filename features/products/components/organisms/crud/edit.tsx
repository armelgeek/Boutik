'use client';

import { useState } from 'react';



import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';



import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

import { ProductForm } from '../../molecules/form/product-form';import { productKeys } from '@/features/products/config/product.key';
import { ProductServiceImpl } from '@/features/products/domain/product.service';
import { Product, ProductPayload } from '@/features/products/config/product.type';
import { SelectOption } from '@/shared/components/molecules/form/ControlledSelect';

interface EditProps {
  slug: string;
  isOpenDropdown: boolean;
  setIsOpenDropdown: (open: boolean) => void;
  categories: SelectOption[];
}

export function Edit({ slug, categories,  setIsOpenDropdown }: EditProps) {
  const queryClient = useQueryClient();

  const [isOpen, setIsOpen] = useState(false);

  const { data, isPending } = useQuery({
    queryKey: productKeys.detail(slug),
    queryFn: () => new ProductServiceImpl().detail(slug),
  });

  const { mutate, isPending: isPendingMutation } = useMutation({
    mutationFn: (payload: ProductPayload) => {
      return new ProductServiceImpl().update(slug, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.all });
    },
  });

  const handleSubmit = async (input: ProductPayload) => {
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
          <SheetTitle>Edit Product</SheetTitle>
          <SheetDescription>Click save when you&#39;re done.</SheetDescription>
        </SheetHeader>

        <div className="grid gap-4 py-4">
          {isPending ? (
            'Loading...'
          ) : (
            <ProductForm
              initialData={data as Product}
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
