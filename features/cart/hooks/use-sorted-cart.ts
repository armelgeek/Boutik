'use client';
import { CartItem } from "@/features/products/config/cart.type";
import { useState, useEffect, useMemo } from "react";
import { StaticImageData } from "next/image";

export type DisplayCartItem = {
  id: string;
  size: string;
  quantity: number;
  name: string;
  price: number;
  image: StaticImageData;
};

const useSortedCart = (cartItems: Record<string, CartItem>): DisplayCartItem[] => {
  const [cartData, setCartData] = useState<DisplayCartItem[]>([]);

  useEffect(() => {
    const tempData: DisplayCartItem[] = Object.entries(cartItems).flatMap(([itemId, item]) =>
      Object.entries(item.sizes)
        .filter(([, quantity]) => quantity > 0)
        .map(([size, quantity]) => ({
          id: itemId,
          size,
          quantity,
          name: item.name,
          price: item.price,
          image: item.image
        }))
    );
    setCartData(tempData);
  }, [cartItems]);

  const sortedCartData = useMemo(() => 
    [...cartData].sort((a, b) => {
      // D'abord trier par nom de produit
      const nameCompare = a.name.localeCompare(b.name);
      if (nameCompare !== 0) return nameCompare;
      // Puis par taille
      return a.size.localeCompare(b.size);
    })
  , [cartData]);

  return sortedCartData;
};

export default useSortedCart;
