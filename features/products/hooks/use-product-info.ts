"use client";
import { useEffect, useState } from "react";
import { useShop } from "./use-shop";
import { Product } from "@/features/products/config/product.type";
import { productService } from "../domain/product.service";

const useProductInfo = ({ productId }: { productId: string | undefined }) => {
  const { currency, addToCart } = useShop();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [productsData, setProductsData] = useState<Product>({
    id: '',
    name: '',
    slug: '',
    price: 0,
    images: [],
    description: '',
    category_id: '',
    sub_category_id: '',
    sizes: [],
    bestseller: false,
    date: new Date()
  });
  const [image, setImage] = useState('');
  const [size, setSize] = useState('');

  const fetchProductsData = async () => {
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
  };

  useEffect(() => {
    fetchProductsData();
  }, [productId]); 

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