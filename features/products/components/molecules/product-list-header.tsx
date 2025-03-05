import Heading from "@/shared/components/atoms/heading";
import ProductSort from "../atoms/product-sort";

interface ProductListHeaderProps {
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
  onSort: (sortBy: string, sortDir: 'asc' | 'desc') => void;
  title?: string;
}

const ProductListHeader: React.FC<ProductListHeaderProps> = ({ 
  sortBy, 
  sortDir, 
  onSort,
  title = 'COLLECTIONS' 
}) => {
  return (
    <div className="flex justify-between items-center text-sm sm:text-xl lg:text-2xl mb-4">
      <Heading text1={'ALL'} text2={title} />
      <ProductSort sortBy={sortBy} sortDir={sortDir} onSort={onSort} />
    </div>
  );
};

export default ProductListHeader;