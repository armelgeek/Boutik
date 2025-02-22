import { Brand, BrandPayload } from '@/core/domain/brand/brand.type';
import { GenericForm } from '@/shared/components/molecules/generic-form';
import { brandFormConfig } from '../../config/form.config';

interface BrandFormProps {
  initialData: Brand | null;
  onSubmit: (input: BrandPayload) => Promise<void>;
  onSuccess?: () => void;
}

export const BrandForm = ({ initialData, onSubmit, onSuccess }: BrandFormProps) => {
  return (
    <GenericForm
      config={brandFormConfig}
      initialData={initialData}
      onSubmit={onSubmit}
      onSuccess={onSuccess}
    />
  );
};
