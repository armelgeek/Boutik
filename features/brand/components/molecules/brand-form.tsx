"use client";

import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { ControlledTextInput } from '@/shared/components/molecules/form/ControlledTextInput';
import { ControlledTextareaInput } from '@/shared/components/molecules/form/ControlledTextareaInput';
import { ControlledSwitch } from '@/shared/components/molecules/form/ControlledSwitch';
import { ControlledUpload } from '@/shared/components/molecules/form/ControlledUpload';
import { useFormHandler } from '@/shared/hooks/use-form-handler';
import { Brand, BrandPayload } from '../../config/brand.type';
import { BrandFormSchema } from '../../config/brand.schema';
import { createBrand, updateBrand } from '../../actions/brand.action';

interface BrandFormProps {
  initialData: Brand | null;
  onSuccess?: () => void;
}

export const BrandForm = ({ initialData = null, onSuccess }: BrandFormProps) => {
  const { form, handleSubmit, isSubmitting } = useFormHandler<BrandPayload>({
    schema: BrandFormSchema,
    initialValues: initialData || { 
      name: '', 
      description: '', 
      status: 'active', 
      image: null 
    },
    onSubmit: async (data) => {
      if (initialData) {
        await updateBrand(initialData.slug, data);
      } else {
        await createBrand(data);
      }
    },
    onSuccess,
    resetAfterSubmit: !initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit}>
        <div className="grid space-y-4">
          <ControlledTextInput
            name="name"
            label="Name"
            placeholder="Name"
            control={form.control}
          />

          <ControlledTextareaInput
            name="description"
            label="Description"
            placeholder="Description"
            control={form.control}
          />

          <ControlledUpload
            control={form.control}
            name="image"
            label="Image"
            description="Select an image to upload (max 5MB)"
          />

          <ControlledSwitch
            control={form.control}
            name="status"
            label="Status"
            activeValue="active"
            inactiveValue="inactive"
          />

          <Button type="submit" className="mt-2" disabled={isSubmitting}>
            {isSubmitting ? (
              <Loader2 className="mr-2 size-4 animate-spin" />
            ) : initialData ? (
              'Edit Brand'
            ) : (
              'Add Brand'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};