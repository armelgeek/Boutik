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
    return null; // Hide section on error
  }

  if (isLoading) {
    return (
      <section className="mt-20">
        <Heading text1={"Related Products"} className="mb-6 text-left" />
        <ProductItemSkeleton />
      </section>
    );
  }

  if (!products || products.length === 0) {
    return null;
  }

  return (
    <section className="mt-20">
      <Heading text1={"Related Products"} className="mb-6 text-left" />
      <div className="gap-6 grid grid-cols-2 md:grid-cols-4 animate-fade-in">
        {products.map((product) => (
          <ProductItem
            key={product.id}
            id={product.id}
            images={product.images}
            slug={product.slug}
            name={product.name}
            price={product.price}
            description={product.description}
            sizes={product.sizes}
            category_id={product.category_id}
            sub_category_id={product.sub_category_id}
          />
        ))}
      </div>
    </section>
  );
};

export default RelatedProducts;
