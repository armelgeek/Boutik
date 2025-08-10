import ProductItem from '../atoms/product-item';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Products = ({ products, withSidebar = false }: { products: any[], withSidebar?: boolean }) => {
  if (products.length === 0) {
    return (
      <div className="flex justify-center items-center h-[400px] text-gray-500">
        <div className="text-center">
          <p className="mb-2 font-medium text-lg">No products found</p>
          <p className="text-sm">Try modifying your search filters</p>
        </div>
      </div>
    );
  }
  console.log('Products:', products);
  return (
    <div className={`gap-4 grid grid-cols-1 ${withSidebar ? `sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3`: `sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4`}  mt-5`}>
      {products.map((product, idx) => (
        <div key={idx} className="p-2">
          <ProductItem
            id={product.id}
            slug={product.slug}
            images={product.images}
            name={product.name}
            price={product.price}
            description={product.description}
            sizes={product.sizes}
            category_id={product.category_id}
            sub_category_id={product.sub_category_id}
            category={product.category}
            subcategory={product.subcategory}
          />
        </div>
      ))}
    </div>
  );
};

export default Products;
