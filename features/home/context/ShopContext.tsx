"use client";
import { createContext, useState } from 'react';
import { useCart } from "@/features/cart/hooks/use-cart";
import { ShopContextType } from '@/features/products/hooks/use-shop';
import { Order } from '@/features/products/config/order.type';
import { Product } from '@/features/products/config/product.type';

export const ShopContext = createContext<ShopContextType | null>(null);

const ShopContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const currency = '$';
  const delivery_fee = 10;
  const [search, setSearch] = useState<string>('');
  const [showSearch, setShowSearch] = useState<boolean>(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([])
  const { items: cartItems, addItem, removeItem, updateQuantity, getCartCount, getCartAmount } = useCart();

  const addOrder = (): void => {
    const newOrder = Object.entries(cartItems).flatMap(([itemId, item]) =>
      Object.entries(item.sizes).map(([size, quantity]) => ({
        id: Math.floor(Math.random() * 10000), 
        amount: item.price * quantity,
        status: 'pending', 
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        items: [{
          id: itemId,
          quantity,
          size,
          product: {
            name: item.name,
            price: item.price,
            image: item.image
          },
        }],
      }
    )));
    
    setOrders(prevOrders => [...prevOrders, ...newOrder]);
    console.log('New order created:', newOrder);
  };

  const addToCart = (itemId: string, size: string): void => {
    const product: Partial<Product> = products?.find(p => p.id === itemId) || {};
    if (product) {
      addItem(itemId, size, product);
    }
  };

  const value: ShopContextType = {
    products: products || [],
    setProducts,
    currency,
    delivery_fee,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    cartItems,
    orders,
    addToCart,
    removeFromCart: removeItem,
    addOrder,
    getCartCount,
    updateQuantity,
    getCartAmount,
  };

  return (
    <ShopContext.Provider value={value}>
      {children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;
