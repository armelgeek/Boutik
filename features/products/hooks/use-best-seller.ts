"use client";
import { useEffect, useState } from "react";
import { Product } from "@/features/products/config/product.type";
import { productService } from "../domain/product.service";

const useBestSeller = () => {
  const [bestSellerProducts, setBestSellerProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBestSellerProducts = async () => {
      setIsLoading(true);
      const bestseller =  await productService.getBestSellerProducts();
      setBestSellerProducts(bestseller.data);
      setIsLoading(false);
    };

    fetchBestSellerProducts();
  }, []);

  return {
    data: bestSellerProducts,
    isLoading
  };
};

export default useBestSeller;