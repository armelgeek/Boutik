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
        <>
            <div className="flex sm:flex-row flex-col gap-1 sm:gap-10 pt-10">
                <FilterOption showFilter={showFilter} setShowFilter={setShowFilter}>
                    <CategoryFilter
                        showFilter={showFilter}
                        toggleCategory={handleToggleCategory}
                    />
                    <SubCategoryFilter
                        showFilter={showFilter}
                        toggleSubCategory={handleToggleSubCategoryChange}
                    />
                    <PriceFilter
                        showFilter={showFilter}
                        onPriceChange={onPriceChange}
                    />
                </FilterOption>
                
                <ProductListContainer 
                    sortBy={sortBy} 
                    sortDir={sortDir} 
                    onSort={onSort}
                >
                    {isFiltering ? <ProductsSkeleton count={8} withSidebar /> : <Products products={products} withSidebar />}
                </ProductListContainer>
            </div>
        </>
    )
}

export default Collection;