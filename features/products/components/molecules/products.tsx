import { Product } from '@/features/products/config/product.type';
import ProductItem from '../atoms/product-item';

const Products = ({ products }: { products: Partial<Product>[] }) => {
  if (products.length === 0) {
    return (
      <div className="flex items-center justify-center h-[400px] text-gray-500">
        <div className="text-center">
          <p className="text-lg font-medium mb-2">Aucun produit trouvé</p>
          <p className="text-sm">Essayez de modifier vos filtres de recherche</p>
        </div>
      </div>
    );
  }

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
