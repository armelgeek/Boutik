'use client';

import { useState, useTransition } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';
import { BrandForm } from '../molecules/brand-form';
import { BrandFormData, updateBrand } from '../../actions';
import { toast } from 'sonner';
import { Brand } from '@/drizzle/schema/brands';

interface EditProps {
  brand: Brand;
}

export function Edit({ brand }: EditProps) {
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);

  const onSubmit = async (data: BrandFormData) => {
    startTransition(async () => {
      try {
        await updateBrand(brand.slug, data);
        toast.success('Brand updated successfully');
        setOpen(false);
      } catch (error) {
        toast.error('Failed to update brand');
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Pencil className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Brand</DialogTitle>
          <DialogDescription>
            Make changes to your brand here.
          </DialogDescription>
        </DialogHeader>
        <BrandForm 
          initialData={brand} 
          onSubmit={onSubmit}
          isSubmitting={isPending}
        />
      </DialogContent>
    </Dialog>
  );
}
