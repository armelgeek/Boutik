import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { ControlledTextInput } from '@/shared/components/molecules/form/ControlledTextInput';
import { useFormHandler } from '@/shared/hooks/use-form-handler';
import { ProductFormSchema } from '@/features/products/config/product.schema';
import { Product, ProductPayload } from '@/features/products/config/product.type';
import { ControlledSelect, SelectOption } from '@/shared/components/molecules/form/ControlledSelect';
import { useEffect, useState } from 'react';
import { CategoryServiceImpl } from '@/features/category/domain/category.service';
import { ControlledMultipleUpload } from '@/shared/components/molecules/form/ControllerMultipleUpload';
import { ControllerCustomSelect } from '@/shared/components/molecules/form/ControllerCustomSelect';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ControlledTextareaInput } from '@/shared/components/molecules/form/ControlledTextareaInput';

interface ProductFormProps {
  initialData: Product | null | undefined;
  onSubmit: (input: ProductPayload) => Promise<void>;
  onSuccess?: () => void;
  categories: SelectOption[];
}

export const ProductForm = ({ initialData = null, onSubmit, categories, onSuccess }: ProductFormProps) => {
  const { form, handleSubmit, isSubmitting } = useFormHandler<ProductPayload>({
    schema: ProductFormSchema,
    initialValues: initialData || {
      name: '',
      price: 0,
      description: '',
      category_id: null,
      sub_category_id: null,
      images: [],
      sizes: [] as string[]
    },
    onSubmit,
    onSuccess
  });

  const [subCategories, setSubCategories] = useState<SelectOption[]>([]);
  const categoryId = form.watch('category_id');
  const [isSubCategory, setIsSubCategory] = useState(false);

  useEffect(() => {
    if (categoryId) {
        setIsSubCategory(true);
        new CategoryServiceImpl().sub(categoryId).then((response) => {
            setSubCategories(response?.data.map((category) => ({
            value: category.id,
            label: category.name,
            })) as SelectOption[]);
        });
        
       setIsSubCategory(false);
    } else {
      setSubCategories([]);
       setIsSubCategory(false);
    }
    form.setValue('sub_category_id', null);
  }, [categoryId]);

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <ScrollArea className="h-[550px] pr-4">
          <div className="space-y-4">
            <ControlledTextInput
              name="name"
              label="Name"
              placeholder="Product Name"
              control={form.control}
            />

            <ControlledTextInput
              name="price"
              label="Prix"
              type="number"
              placeholder="Product Price"
              control={form.control}
            />

             <ControlledTextareaInput
              name="description"
              label="Description"
              placeholder="Product Description"
              control={form.control}
            />

            <ControlledSelect
              name="category_id"
              label="Category"
              placeholder="Select Category"
              control={form.control}
              options={categories}
            />
            
            {categoryId && subCategories.length > 0 && (
              <>
              {isSubCategory ? (
                <p>Loading...</p>
              ): (
                  <ControlledSelect
                  name="sub_category_id"
                  label="Sub Category"
                  placeholder="Select Sub Category"
                  control={form.control}
                  options={subCategories}
                  />
              )}
              </>
            
            )}

            <ControlledMultipleUpload
              name="images"
              control={form.control}
              label="Product Images"
              description="Upload up to 5 product images"
              maxImages={5}
              onUploadComplete={(urls) => console.log('Uploaded images:', urls)}
            />

            <ControllerCustomSelect
              name="sizes"
              control={form.control}
              label="Available Sizes"
              description="Select all available sizes for this product"
              options={["XS", "S", "M", "L", "XL", "XXL"]}
            />
          </div>
        </ScrollArea>

      
        <Button type="submit" className="mt-2" disabled={isSubmitting}>
          {isSubmitting ? (
            <Loader2 className="mr-2 size-4 animate-spin" />
          ) : initialData ? (
            'Edit Product'
          ) : (
            'Add Product'
          )}
        </Button>
      </form>
    </Form>
  );
}