// 'use client';

import { useState } from 'react';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { brandKeys } from '@/core/domain/keys/brand.key';

import { BrandServiceImpl } from '../../../../core/application/services/brand/brand.service';

interface DeleteProps {
  slug: string;
  isOpenDropdown: boolean;
  setIsOpenDropdown: (open: boolean) => void;
}

export function Delete({ slug, isOpenDropdown, setIsOpenDropdown }: DeleteProps) {
  const queryClient = useQueryClient();

  const [isOpen, setIsOpen] = useState(false);

  const { mutate, isPending } = useMutation({
    mutationFn: (slug: string) => {
      return new BrandServiceImpl().delete(slug);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: brandKeys.all });
    },
  });

  const handleDelete = async (slug: string) => {
    mutate(slug);
    setIsOpen(false);
    setIsOpenDropdown(false);
  };

  return (
    <AlertDialog
      open={isOpen}
      onOpenChange={(open) => setIsOpen(open)}
    >
      <AlertDialogTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>Delete</DropdownMenuItem>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your account and remove your
            data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => handleDelete(slug)}
            disabled={isPending}
          >
            {isPending ? <Loader2 className="mr-2 size-4 animate-spin" /> : null}
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
