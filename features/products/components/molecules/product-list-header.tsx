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
    <div className="flex flex-col gap-2">
      <div className="flex flex-col sm:flex-row  justify-between items-start gap-2">
        <Heading text1={'ALL'} text2={title} className="mb-0 text-left" />
        <div className="w-full sm:w-auto flex justify-end">
          <ProductSort sortBy={sortBy} sortDir={sortDir} onSort={onSort} />
        </div>
      </div>
   </div>
  );
};

export default ProductListHeader;