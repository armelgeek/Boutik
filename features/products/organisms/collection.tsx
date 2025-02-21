"use client";
import React, { useState } from 'react';
import { useProductFilter } from '../hooks/use-filter';
import FilterOption from '../atoms/filter-option';
import CategoryFilter from '../molecules/category-filter';
import ProductListContainer from '../molecules/product-list-container';
import SubCategoryFilter from '../molecules/sub-category-filter';
import Products from '../molecules/products';

const Collection = () => {
    const {
        filterProducts,
        sortType,
        toggleCategory,
        toggleSubCategory,
        setSortType: setQuerySortType
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

    const handleSortChange = (value: string) => {
        setQuerySortType(value);
    };

    return (
        <div className="flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t">
            <FilterOption showFilter={showFilter} setShowFilter={setShowFilter}>
                <CategoryFilter
                    showFilter={showFilter}
                    toggleCategory={handleToggleCategory}
                />
                <SubCategoryFilter
                    showFilter={showFilter}
                    toggleSubCategory={handleToggleSubCategoryChange}
                />
            </FilterOption>
            
            <ProductListContainer sortType={sortType} setSortType={handleSortChange}>
               <Products products={filterProducts} />
            </ProductListContainer>
        </div>
    )
}
export default Collection;