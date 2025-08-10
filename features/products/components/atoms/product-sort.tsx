import React from "react";

interface ProductSortProps {
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
  onSort: (sortBy: string, sortDir: 'asc' | 'desc') => void;
}

const ProductSort: React.FC<ProductSortProps> = ({ sortBy, sortDir, onSort }) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    switch(value) {
      case 'name_asc':
        onSort('name', 'asc');
        break;
      case 'name_desc':
        onSort('name', 'desc');
        break;
      case 'price_asc':
        onSort('price', 'asc');
        break;
      case 'price_desc':
        onSort('price', 'desc');
        break;
      default:
        onSort('name', 'asc');
    }
  };

  const getValue = () => {
    if (!sortBy) return 'name_asc';
    return `${sortBy}_${sortDir}`;
  };

  return (
    <select
      onChange={handleChange}
      value={getValue()}
      className="bg-white px-3 py-2 border border-gray-200 rounded-lg text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400/70 transition-all hover:border-orange-400"
      aria-label="Sort products"
    >
      <option value="name_asc">Name (A-Z)</option>
      <option value="name_desc">Name (Z-A)</option>
      <option value="price_asc">Price (Low to High)</option>
      <option value="price_desc">Price (High to Low)</option>
    </select>
  );
};

export default ProductSort;