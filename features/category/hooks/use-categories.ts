import { useQuery } from '@tanstack/react-query';

import { CategoryServiceImpl } from '../domain/category.service';
import { categoryKeys } from '../config/category.key';
import { SelectOption } from '@/shared/components/molecules/form/ControlledSelect';
import type { Category } from '../config/category.type';

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

  return {
    categories: categories || [],
    isLoading,
  };
};

// Hook pour récupérer les catégories principales avec toutes leurs données
export const useCategoriesWithImages = () => {
  const { data: categories, isLoading } = useQuery({
    queryKey: [...categoryKeys.all, 'with-images'],
    queryFn: async () => {
      const response = await new CategoryServiceImpl().selectCategory();
      return response?.data || [];
    },
  });

  return {
    categories: categories as Category[] || [],
    isLoading,
  };
};
