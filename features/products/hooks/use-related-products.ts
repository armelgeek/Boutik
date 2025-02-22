"use client";
import { useEffect, useState } from "react";
import { Product } from "@/core/domain/product/product.type";
import { useProducts } from "./use-products";

const useRelatedProducts = ({ category, subCategory }: {
  category: string,
  subCategory: string
}) => {
  const { products }: { products: Product[] } = useProducts();
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 3000));
       if (products.length > 0) {
      let productsCopy = [...products];
      productsCopy = productsCopy.filter(
        (product) =>
          product.category === category && product.subCategory === subCategory
      );
      setRelatedProducts(productsCopy.slice(0, 5));
    }
      setIsLoading(false);
    };

    fetchRelatedProducts();
  }, [products]);

  return {
    data: relatedProducts,
    isLoading
  };
};

export default useRelatedProducts;