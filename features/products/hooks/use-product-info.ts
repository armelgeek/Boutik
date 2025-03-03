"use client";
import { useEffect, useState } from "react";
import { useShop } from "./use-shop";
import { Product } from "@/features/products/config/product.type";

const useProductInfo = ({productId}: { productId: string }) => {
  const { products, currency, addToCart } = useShop();
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
    products.map((product) => {
      if (product.id === productId) {
        setProductsData(product);
        if(product && product?.images && product?.images.length > 0){
          setImage(product?.images[0]);
        }
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