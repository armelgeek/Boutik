import ProductItemSkeleton from '../atoms/product-item-skeleton';

const ProductsSkeleton = ({ count, withSidebar = false }: { count: number, withSidebar?: boolean }) => {
  return (
    <div className={`grid grid-cols-1 ${withSidebar ? `sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3` : `sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 `} gap-4 mt-5`}>
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} className="p-2">
          <ProductItemSkeleton />
        </div>
      ))}
    </div>
  );
};
export default ProductsSkeleton;
