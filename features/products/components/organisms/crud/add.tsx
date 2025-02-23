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
import { SelectOption } from '@/shared/components/molecules/form/ControlledSelect';
import { ProductPayload } from '@/features/products/config/product.type';
import { ProductServiceImpl } from '@/features/products/domain/category.service';
import { productKeys } from '@/features/products/config/product.key';
import { ProductForm } from '../../molecules/form/product-form';
type Props = {
  categories: SelectOption[];
}
export function Add({ categories }: Props) {
  const queryClient = useQueryClient();

  const [isOpen, setIsOpen] = useState(false);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (payload: ProductPayload) => {
      return new ProductServiceImpl().create(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.all });
    },
  });

  const handleSubmit = async (input: ProductPayload) => {
   await mutateAsync(input);
   console.log('input',input);
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
          Add Product
        </Button>
      </SheetTrigger>
      <SheetContent className="max-w w-full md:max-w-[500px]">
        <SheetHeader>
          <SheetTitle>Add Product</SheetTitle>
          <SheetDescription>Click save when you&#39;re done.</SheetDescription>
        </SheetHeader>

        <div className="grid gap-4 py-4">
          <ProductForm
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
