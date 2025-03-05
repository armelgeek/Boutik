"use client";
import useRelatedProducts from "../../hooks/use-related-products";
import ProductItem from "../atoms/product-item";
import ProductItemSkeleton from "../atoms/product-item-skeleton";
interface RelatedProductsProps {
  category: string;
  subCategory: string;
}

const RelatedProducts = ({ category, subCategory }: RelatedProductsProps) => {
  const { data: products, isLoading, error } = useRelatedProducts({
    category,
    subCategory,
  });

  if (error) {
    return null; // On cache la section si erreur
  }

  if (isLoading) {
    return (
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-6">Related Products</h2>
        <ProductItemSkeleton/>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return null;
  }

  return (
    <div className="mt-16">
      <h2 className="text-2xl font-bold mb-6">Related Products</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {products.map((product) => (
          <ProductItem
            key={product.id}
            images={product.images}
            slug={product.slug}
            name={product.name}
            price={product.price}
          />
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;
