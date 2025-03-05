'use client';

import { useContext } from 'react';
import { ShopContext } from '@/features/home/context/ShopContext';
import { Product } from '../config/product.type';
import { Order } from '../config/order.type';

export interface ShopContextType {
  products: Product[];
  setProducts: (products: Product[]) => void;
  currency: string;
  delivery_fee: number;
  search: string;
  setSearch: (search: string) => void;
  showSearch: boolean;
  setShowSearch: (show: boolean) => void;
  cartItems: Record<string, {
    sizes: Record<string, number>;
    name: string;
    price: number;
    image: string;
  }>;
  orders: Order[];
  addToCart: (itemId: string, size: string) => void;
  removeFromCart: (itemId: string, size: string) => void;
  addOrder: () => void;
  getCartCount: () => number;
  updateQuantity: (itemId: string, size: string, quantity: number) => void;
  getCartAmount: () => number;
}

export const useShop = () => {
  const context = useContext(ShopContext) as ShopContextType;
  
  if (!context) {
    throw new Error('useShop must be used within a ShopContextProvider');
  }

  return context;
};