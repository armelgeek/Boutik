import { useQuery } from '@tanstack/react-query';

import { CategoryServiceImpl } from '../domain/category.service';
import { categoryKeys } from '../config/category.key';
import { SelectOption } from '@/shared/components/molecules/form/ControlledSelect';

export const useSubCategories = () => {
  const { data: categories, isLoading } = useQuery({
    queryKey: categoryKeys.subs,
    queryFn: async () => {
      const response = await new CategoryServiceImpl().hasParentCategories();
      return response?.data.map((category) => ({
        value: category.id,
        label: category.name,
      })) as SelectOption[];
    },
  });

  return {
    categories: categories || [],
    isLoading,
  };
};
