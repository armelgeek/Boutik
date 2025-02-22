"use client";
import { useEffect, useState } from "react";
import { Product } from "@/features/products/config/product.type";
import { useProducts } from "./use-products";

const useBestSeller = () => {
  const { products }: { products: Product[] } = useProducts();
  const [bestSellerProducts, setBestSellerProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBestSellerProducts = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 3000));
      setBestSellerProducts(products.slice(0, 4));
      setIsLoading(false);
    };

    fetchBestSellerProducts();
  }, [products]);

  return {
    data: bestSellerProducts,
    isLoading
  };
};

export default useBestSeller;