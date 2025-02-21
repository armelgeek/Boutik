import ProductListHeader from "./product-list-header";

const ProductListContainer = ({ sortType, setSortType, children }: {
  sortType: string;
  setSortType: (type: string) => void;
  children: React.ReactNode;
}) => {
  return (
    <div className="flex-1">
      <ProductListHeader sortType={sortType} setSortType={setSortType} />
      {children}
    </div>
  );
};
export default ProductListContainer; 