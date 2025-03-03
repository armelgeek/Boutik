"use client";
import { useEffect, useState } from "react";
import { Product } from "@/features/products/config/product.type";
import { productService } from "../domain/product.service";

const useLatest = () => {
  const [latestProducts, setLatestProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLatestProducts = async () => {
      setIsLoading(true);
       const products =  await productService.getLatestProducts();
      setLatestProducts(products.data);
      setIsLoading(false);
    };

    fetchLatestProducts();
  }, []);

  return {
    data: latestProducts,
    isLoading
  };
};

export default useLatest;