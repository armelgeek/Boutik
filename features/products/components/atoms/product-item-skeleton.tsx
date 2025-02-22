import React from 'react';
const ProductItemSkeleton = () => {
  return (
    <div className="overflow-hidden border p-4 shadow-sm h-[350px] animate-pulse">
      <div className="w-full h-48 bg-gray-200 mb-2"></div>
      <div className="h-4 bg-gray-200 w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-200 w-1/2"></div>
    </div>
  );
};

export default ProductItemSkeleton;