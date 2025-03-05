"use client";
import { useEffect, useState } from "react";
import { Product } from "@/features/products/config/product.type";
import { productService } from "../domain/product.service";

const useRelatedProducts = ({ category, subCategory }: {
  category: string,
  subCategory: string
}) => {
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await productService.related(category, subCategory);
        setRelatedProducts(response);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch related products');
        setRelatedProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (category) {
      fetchRelatedProducts();
    } else {
      setRelatedProducts([]);
      setIsLoading(false);
    }
  }, [category, subCategory]);

  return {
    data: relatedProducts,
    isLoading,
    error
  };
};

export default useRelatedProducts;