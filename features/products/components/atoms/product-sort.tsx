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
      className="bg-white px-2 py-1 border border-gray-300 rounded-md text-sm"
    >
      <option value="name_asc">Nom (A-Z)</option>
      <option value="name_desc">Nom (Z-A)</option>
      <option value="price_asc">Prix (croissant)</option>
      <option value="price_desc">Prix (décroissant)</option>
    </select>
  );
};

export default ProductSort;