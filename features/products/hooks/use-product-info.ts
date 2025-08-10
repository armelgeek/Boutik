"use client";
import { useEffect, useState, useCallback } from "react";
import { useShop } from "./use-shop";
import { ProductWithCategory } from "@/features/products/config/product.type";
import { productService } from "../domain/product.service";

const useProductInfo = ({ productId }: { productId: string | undefined }) => {
  const { currency, addToCart } = useShop();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [productsData, setProductsData] = useState<ProductWithCategory | null>(null);
  const [image, setImage] = useState('');
  const [size, setSize] = useState('M'); // Default size

  const fetchProductsData = useCallback(async () => {
    if (!productId) return;
    
    try {
      setIsLoading(true);
      setError(null);
      const product = await productService.detail(productId);
      setProductsData(product);
      console.log('product',product);
      if (product?.images && product?.images.length > 0) {
        setImage(product.images[0]);
      }
      if (product?.sizes && product?.sizes.length > 0) {
        setSize(product.sizes[0]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch product details');
    } finally {
      setIsLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchProductsData();
  }, [fetchProductsData]); 

  return {
    currency,
    addToCart,
    productsData,
    image,
    setImage,
    size,
    setSize,
    isLoading,
    error,
    refetch: fetchProductsData
  };
};

export default useProductInfo;