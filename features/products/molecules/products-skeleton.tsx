import ProductItemSkeleton from '../atoms/product-item-skeleton';

const ProductsSkeleton = ({ count }: { count: number }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-5">
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} className="p-2">
          <ProductItemSkeleton />
        </div>
      ))}
    </div>
  );
};
export default ProductsSkeleton;
