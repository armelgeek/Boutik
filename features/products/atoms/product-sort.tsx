import React from "react";

const ProductSort: React.FC<{
  sortType: string;
  setSortType: (value: string) => void;
}> = ({ sortType, setSortType }) => {
  return (
    <select
      onChange={(e) => setSortType(e.target.value)}
      value={sortType}
      className="border border-gray-300 text-sm px-2"
    >
      <option value="relevant">Sort by: Relevant</option>
      <option value="low-high">Sort by: Low to High</option>
      <option value="high-low">Sort by: High to Low</option>
    </select>
  );
};
export default ProductSort;