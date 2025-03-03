"use client";
import { useQueryState } from 'nuqs';
import { parseAsArrayOf, parseAsString } from 'nuqs/server';
import { useEffect, useState } from 'react';
import { useShop } from './use-shop';
import { Product } from '@/features/products/config/product.type';
import { productService } from '../domain/product.service';

export const useProductFilter = () => {
  const { products, setProducts, showSearch } = useShop();
  
  const [search, setSearch] = useQueryState('q', { defaultValue: '' });
  const [category, toggleCategory] = useQueryState('category', parseAsArrayOf(parseAsString));
  const [subCategory, toggleSubCategory] = useQueryState('subCategory', parseAsArrayOf(parseAsString));
  const [sortType, setSortType] = useQueryState('sort', { defaultValue: 'relevent' });
  const [isFiltering, setIsFiltering] = useState(false);

  const applyFilter = async () => {
    if (!products || products.length === 0) return;
    
    setIsFiltering(true);
    const response = await productService.list({
          category,
          subCategory,
          search
        });
    setProducts(response.data);
    setIsFiltering(false);
  };

  const sortProducts = async () => {
    if (products.length === 0) return;
    
    setIsFiltering(true);
    
    await new Promise(resolve => setTimeout(resolve, 500));

    /**switch (sortType) {
      case 'low-high':
        filteredProdCopy.sort((a, b) => a.price - b.price);
        break;
      case 'high-low':
        filteredProdCopy.sort((a, b) => b.price - a.price);
        break;
      default:
        await applyFilter();
        return;
    }**/
    
   // setFilterProducts(filteredProdCopy);
    setIsFiltering(false);
  };

  useEffect(() => {
    applyFilter();
  }, [category, subCategory, search, showSearch]);

  useEffect(() => {
    sortProducts();
  }, [sortType]);

  return {
    filterProducts: products,
    category,
    subCategory,
    sortType,
    search,
    setSearch,
    toggleCategory,
    toggleSubCategory,
    setSortType,
    isFiltering
  };
};