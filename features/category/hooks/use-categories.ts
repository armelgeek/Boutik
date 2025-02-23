import { useQuery } from '@tanstack/react-query';

import { CategoryServiceImpl } from '../domain/category.service';
import { categoryKeys } from '../config/category.key';
import { SelectOption } from '@/shared/components/molecules/form/ControlledSelect';

export const useCategories = () => {
  const { data: categories, isLoading } = useQuery({
    queryKey: categoryKeys.all,
    queryFn: async () => {
      const response = await new CategoryServiceImpl().selectCategory();
      return response?.data.map((category) => ({
        value: category.id,
        label: category.name,
      })) as SelectOption[];
    },
  });
  console.log('res', categories);

  return {
    categories: categories || [],
    isLoading,
  };
};
