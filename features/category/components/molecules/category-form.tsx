import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { ControlledTextInput } from '@/shared/components/molecules/form/ControlledTextInput';
import { useFormHandler } from '@/shared/hooks/use-form-handler';

import { Category, CategoryPayload } from '../../config/category.type';
import { CategoryFormSchema } from '../../config/category.schema';
import { ControlledSelect, SelectOption } from '@/shared/components/molecules/form/ControlledSelect';

interface CategoryFormProps {
  initialData: Category | null;
  onSubmit: (input: CategoryPayload) => Promise<void>;
  onSuccess?: () => void;
  categories: SelectOption[];
}

export const CategoryForm = ({ initialData = null, onSubmit, categories, onSuccess }: CategoryFormProps) => {
  const { form, handleSubmit, isSubmitting } = useFormHandler<CategoryPayload>({
    schema: CategoryFormSchema,
    initialValues: initialData || {
      name: '',
      parent_id: null
    },
    onSubmit,
    onSuccess
  });

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-4">
          <ControlledTextInput
            name="name"
            label="Name"
            placeholder="Category Name"
            control={form.control}
          />

          <ControlledSelect
            name="parent_id"
            label="Parent Category"
            placeholder="Parent Category"
            control={form.control}
            options={categories}
          />

          <Button type="submit" className="mt-2" disabled={isSubmitting}>
            {isSubmitting ? (
              <Loader2 className="mr-2 size-4 animate-spin" />
            ) : initialData ? (
              'Edit Category'
            ) : (
              'Add Category'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}