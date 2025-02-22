"use client";
import { useEffect, useState } from "react";
import { Product } from "@/features/products/config/product.type";
import { useProducts } from "./use-products";

const useLatest = () => {
  const { products }: { products: Product[] } = useProducts();
  const [latestProducts, setLatestProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLatestProducts = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 3000));
      setLatestProducts(products.slice(0, 8));
      setIsLoading(false);
    };

    fetchLatestProducts();
  }, [products]);

  return {
    data: latestProducts,
    isLoading
  };
};

export default useLatest;