"use client";
import { useQueryState } from 'nuqs';
import { parseAsArrayOf, parseAsString } from 'nuqs/server';
import { useEffect, useState } from 'react';
import { useShop } from './use-shop';
import { Product } from '@/features/products/config/product.type';

export const useProductFilter = () => {
  const { products, showSearch } = useShop();
  
  const [search, setSearch] = useQueryState('q', { defaultValue: '' });
  const [category, toggleCategory] = useQueryState('category', parseAsArrayOf(parseAsString));
  const [subCategory, toggleSubCategory] = useQueryState('subCategory', parseAsArrayOf(parseAsString));
  const [sortType, setSortType] = useQueryState('sort', { defaultValue: 'relevent' });
  const [filterProducts, setFilterProducts] = useState<Product[]>([]);
  const [isFiltering, setIsFiltering] = useState(false);

  const applyFilter = async () => {
    if (!products || products.length === 0) return;
    
    setIsFiltering(true);
    
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulating async operation

    let productsCopy: Product[] = products.slice();

    if (showSearch && search) {
      productsCopy = productsCopy.filter((item: Product) =>
        item.name?.toLowerCase().includes(search.toLowerCase().trim())
      );
    }

    if (category && category.length > 0) {
      productsCopy = productsCopy.filter((item) =>
        category.includes(item.category)
      );
    }

    if (subCategory && subCategory.length > 0) {
      productsCopy = productsCopy.filter((item) =>
        subCategory.includes(item.subCategory)
      );
    }

    setFilterProducts(productsCopy);
    setIsFiltering(false);
  };

  const sortProducts = async () => {
    if (filterProducts.length === 0) return;
    
    setIsFiltering(true);
    
    await new Promise(resolve => setTimeout(resolve, 500));

    const filteredProdCopy = [...filterProducts];
    
    switch (sortType) {
      case 'low-high':
        filteredProdCopy.sort((a, b) => a.price - b.price);
        break;
      case 'high-low':
        filteredProdCopy.sort((a, b) => b.price - a.price);
        break;
      default:
        await applyFilter();
        return;
    }
    
    setFilterProducts(filteredProdCopy);
    setIsFiltering(false);
  };

  useEffect(() => {
    applyFilter();
  }, [category, subCategory, search, showSearch, products]);

  useEffect(() => {
    sortProducts();
  }, [sortType]);

  return {
    filterProducts,
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