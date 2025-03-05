"use client";
import { useQueryState } from 'nuqs';
import { parseAsArrayOf, parseAsString, parseAsInteger } from 'nuqs/server';
import { useEffect, useState } from 'react';
import { useShop } from './use-shop';
import { Product } from '@/features/products/config/product.type';
import { productService } from '../domain/product.service';

export const useProductFilter = () => {
  const { products, setProducts, showSearch } = useShop();
  
  const [search, setSearch] = useQueryState('q', { defaultValue: '' });
  const [category, toggleCategory] = useQueryState('category', parseAsArrayOf(parseAsString));
  const [subCategory, toggleSubCategory] = useQueryState('subCategory', parseAsArrayOf(parseAsString));
  const [sortBy, setSortBy] = useQueryState('sortBy', { defaultValue: 'name' });
  const [sortDir, setSortDir] = useQueryState<'asc' | 'desc'>('sortDir', { defaultValue: 'asc' });
  const [minPrice, setMinPrice] = useQueryState('minPrice', parseAsInteger.withDefault(null));
  const [maxPrice, setMaxPrice] = useQueryState('maxPrice', parseAsInteger.withDefault(null));
  const [isFiltering, setIsFiltering] = useState(false);

  const applyFilter = async () => {
    setIsFiltering(true);
    try {
      const response = await productService.list({
        category,
        subCategory,
        search,
        sortBy,
        sortDir,
        minPrice,
        maxPrice,
        page: 1,
        pageSize: 10
      });
      setProducts(response.data);
    } catch (error) {
      console.error('Error applying filters:', error);
    } finally {
      setIsFiltering(false);
    }
  };

  const handlePriceChange = (min: number | null, max: number | null) => {
    setMinPrice(min);
    setMaxPrice(max);
  };

  useEffect(() => {
    applyFilter();
  }, [search, category, subCategory, sortBy, sortDir, minPrice, maxPrice]);

  return {
    isFiltering,
    products,
    search,
    setSearch,
    category,
    subCategory,
    sortBy,
    sortDir,
    minPrice,
    maxPrice,
    onSort: (sortBy: string, sortDir: 'asc' | 'desc') => {
      setSortBy(sortBy);
      setSortDir(sortDir);
    },
    onPriceChange: handlePriceChange,
    toggleCategory,
    toggleSubCategory
  };
};