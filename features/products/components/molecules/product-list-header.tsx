import Heading from "@/shared/components/atoms/heading";
import ProductSort from "../atoms/product-sort";

const ProductListHeader: React.FC<{
  sortType: string;
  setSortType: (sortType: string) => void;
}> = ({ sortType, setSortType }) => {
  return (
    <div className="flex justify-between text-sm sm:text-xl lg:text-2xl mb-4">
      <Heading text1={'ALL'} text2={'COLLECTIONS'} />
      <ProductSort sortType={sortType} setSortType={setSortType} />
    </div>
  );
};
export default ProductListHeader;