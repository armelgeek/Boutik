
import { Product } from '@/core/domain/types/product.type';
import ProductItem from '../atoms/product-item';

const Products = ({ products }: { products: Product[] }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-5">
      {products.map((product, idx) => (
        <div key={idx} className="p-2">
          <ProductItem
            id={product.id}
            images={product.images}
            name={product.name}
            price={product.price}
            description={product.description}
          />
        </div>
      ))}
    </div>
  );
};
export default Products;
