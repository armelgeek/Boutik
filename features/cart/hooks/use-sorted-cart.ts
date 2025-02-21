'use client';
import { CartItem } from "@/core/domain/types/cart.type";
import { useState, useEffect, useMemo } from "react";
import { StaticImageData } from "next/image";

interface ExtendedCartItem {
  sizes: Record<string, number>;
  name: string;
  price: number;
  image: StaticImageData;
}

const useSortedCart = (cartItems: Record<string, ExtendedCartItem>): CartItem[] => {
  const [cartData, setCartData] = useState<CartItem[]>([]);

  useEffect(() => {
    const tempData: CartItem[] = Object.entries(cartItems).flatMap(([itemId, item]) =>
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
    [...cartData].sort((a, b) => a.size.localeCompare(b.size))
  , [cartData]);

  return sortedCartData;
};

export default useSortedCart;
