import { BrandFormSchema } from '@/core/domain/brand/brand.schema';
import { BrandPayload } from '@/core/domain/brand/brand.type';
import { GenericFormConfig } from '@/shared/types/form.type';

export const brandFormConfig: GenericFormConfig<BrandPayload> = {
  fields: [
    {
      name: 'name',
      label: 'Name',
      type: 'text',
      placeholder: 'Name'
    },
    {
      name: 'description',
      label: 'Description',
      type: 'textarea',
      placeholder: 'Description'
    },
    {
      name: 'image',
      label: 'Image',
      type: 'upload',
      description: 'Select an image to upload (max 5MB)'
    },
    {
      name: 'status',
      label: 'Status',
      type: 'switch',
      activeValue: 'active',
      inactiveValue: 'inactive'
    }
  ],
  schema: BrandFormSchema,
  initialValues: {
    name: '',
    description: '',
    status: 'active',
    image: null
  },
  entityName: 'Brand'
};
