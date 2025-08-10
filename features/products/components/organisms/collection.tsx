"use client";
import React, { useState } from 'react';
import { useProductFilter } from '../../hooks/use-filter';
import FilterOption from '../atoms/filter-option';
import CategoryFilter from '../molecules/category-filter';
import ProductListContainer from '../molecules/product-list-container';
import SubCategoryFilter from '../molecules/sub-category-filter';
import Products from '../molecules/products';
import ProductsSkeleton from '../molecules/products-skeleton';
import PriceFilter from '../molecules/price-filter';

const Collection = () => {
  const {
    isFiltering,
    products,
    sortBy,
    sortDir,
    onSort,
    toggleCategory,
    toggleSubCategory,
    onPriceChange
  } = useProductFilter();
  const [showFilter, setShowFilter] = useState(false);

  const handleToggleCategory = (category: string) => {
    toggleCategory((prev) => {
      if (!prev) return [category];
      return prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category];
    });
  };

  const handleToggleSubCategoryChange = (subCategory: string) => {
    toggleSubCategory((prev) => {
      if (!prev) return [subCategory];
      return prev.includes(subCategory)
        ? prev.filter(c => c !== subCategory)
        : [...prev, subCategory];
    });
  };

  return (
    <section className="pt-12 pb-16 px-2 md:px-0">
      <div className="flex sm:flex-row flex-col gap-4 sm:gap-10">
        <aside className="w-full sm:w-72 mb-6 sm:mb-0">
          <FilterOption showFilter={showFilter} setShowFilter={setShowFilter} className="w-full sm:w-72 rounded-xl shadow-sm border border-gray-100 bg-white p-4 sticky top-24">
            <CategoryFilter showFilter={showFilter} toggleCategory={handleToggleCategory} />
            <SubCategoryFilter showFilter={showFilter} toggleSubCategory={handleToggleSubCategoryChange} />
            <PriceFilter showFilter={showFilter} onPriceChange={onPriceChange} />
          </FilterOption>
        </aside>
        <main className="flex-1">
          <ProductListContainer sortBy={sortBy} sortDir={sortDir} onSort={onSort}>
            {isFiltering ? (
              <ProductsSkeleton count={8} withSidebar />
            ) : (
              <div className="animate-fade-in">
                <Products products={products} withSidebar />
              </div>
            )}
          </ProductListContainer>
        </main>
      </div>
    </section>
  );
};

export default Collection;