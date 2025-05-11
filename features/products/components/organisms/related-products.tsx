"use client";
import Heading from "@/shared/components/atoms/heading";
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
        <Heading text1={"Related Products"}  className="mb-5 text-left"/>
        <ProductItemSkeleton/>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return null;
  }

  return (
    <div className="mt-16">
      <Heading text1={"Related Products"} className="mb-5 text-left"/>
      <div className="gap-4 grid grid-cols-2 md:grid-cols-4">
        {products.map((product) => (
          <ProductItem
            key={product.id}
            id={product.id}
            images={product.images}
            slug={product.slug}
            name={product.name}
            price={product.price}
            description={product.description}
          />
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;
