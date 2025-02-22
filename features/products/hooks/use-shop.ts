import { useContext } from 'react';
import { Product } from '@/core/domain/product/product.type';
import { ShopContext } from '@/features/home/context/ShopContext';

type ShopContextType = {
  products: Product[];
  currency: string;
  delivery_fee: number;
  search: string;
  setSearch: (search: string) => void;
  showSearch: boolean;
  setShowSearch: (show: boolean) => void;
  cartItems: Record<string, Record<string, number>>;
  addToCart: (itemId: string, size: string) => void;
  getCartCount: () => number;
  updateQuantity: (itemId: string, size: string, quantity: number) => void;
  getCartAmount: () => number;
  addOrder: () => void;
  orders: Array<{ _id: string; size: string; quantity: number }>;
  removeFromCart: (itemId: string, size: string) => void;
};

export const useShop = () => {
  const context = useContext(ShopContext) as ShopContextType;
  
  if (!context) {
    throw new Error('useShop must be used within a ShopContextProvider');
  }
  
  return context;
};