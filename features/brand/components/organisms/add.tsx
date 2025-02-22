'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { BrandForm } from '../molecules/brand-form';
import { createBrand } from '../../actions';
import { toast } from 'sonner';

import { BrandServiceImpl } from '../../../../core/application/services/brand/brand.service';

export function Add() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);

  const onSubmit = async (data: BrandFormData) => {
    startTransition(async () => {
      try {
        await createBrand(data);
        toast.success('Brand created successfully');
        setOpen(false);
      } catch (error) {
        toast.error('Failed to create brand');
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 size-4" />
          Add Brand
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Brand</DialogTitle>
          <DialogDescription>
            Add a new brand to your store.
          </DialogDescription>
        </DialogHeader>
        <BrandForm 
          initialData={null} 
          onSubmit={onSubmit}
          isSubmitting={isPending}
        />
      </DialogContent>
    </Dialog>
  );
}
