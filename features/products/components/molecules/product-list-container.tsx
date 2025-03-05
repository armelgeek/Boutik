import React from 'react';
import ProductListHeader from "./product-list-header";

interface ProductListContainerProps {
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
  onSort: (sortBy: string, sortDir: 'asc' | 'desc') => void;
  children: React.ReactNode;
}

const ProductListContainer: React.FC<ProductListContainerProps> = ({
  sortBy,
  sortDir,
  onSort,
  children
}) => {
  return (
    <div className="flex-1">
      <ProductListHeader 
        sortBy={sortBy} 
        sortDir={sortDir} 
        onSort={onSort}
      />
        {children}
  
    </div>
  );
};

export default ProductListContainer;