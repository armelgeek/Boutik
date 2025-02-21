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
import { BaseService } from '@/core/application/services/base.service';

interface GenericAddSheetProps<T, P> {
  service: BaseService<T>;
  title: string;
  description?: string;
  Form: React.ComponentType<{
    initialData: T | null;
    onSubmit: (data: P) => Promise<void>;
    isLoading: boolean;
  }>;
  invalidateQueryKey: unknown[];
  buttonClassName?: string;
}

export function GenericAddSheet<T, P>({
  service,
  title,
  description = "Click save when you're done.",
  Form,
  invalidateQueryKey,
  buttonClassName = "max-w w-full md:max-w-[500px]"
}: GenericAddSheetProps<T, P>) {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (payload: P) => {
      return service.create(payload) as Promise<T>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: invalidateQueryKey });
    },
  });

  const handleSubmit = async (input: P) => {
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
          {title}
        </Button>
      </SheetTrigger>
      <SheetContent className={buttonClassName}>
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription>{description}</SheetDescription>
        </SheetHeader>

        <div className="grid gap-4 py-4">
          <Form
            initialData={null}
            onSubmit={handleSubmit}
            isLoading={isPending}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
