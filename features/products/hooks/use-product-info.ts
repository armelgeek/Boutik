"use client";
import { useEffect, useState } from "react";
import { useShop } from "./use-shop";
import { Product } from "@/features/products/config/product.type";

const useProductInfo = ({productId}: { productId: string }) => {
  const { products, currency, addToCart } = useShop();
  const [productsData, setProductsData] = useState<Product>({
    id: '',
    name: '',
    price: 0,
    images: [],
    description: '',
    sizes: [],
    bestseller: false
  });
  const [image, setImage] = useState('');
  const [size, setSize] = useState('');

  const fetchProductsData = async () => {
    products.map((product) => {
      if (product.id === productId) {
        setProductsData(product);
        setImage(product.images[0]);
        return null;
      }
    });
  };

  useEffect(() => {
    fetchProductsData();
  }, []);

  return {
    currency,
    addToCart,
    productsData,
    image,
    setImage,
    size, 
    setSize
  }
}
export default useProductInfo;