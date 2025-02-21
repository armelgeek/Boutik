"use client";
import { createContext, useState } from 'react';
import { products } from '../../../assets/assets';
import { toast } from 'sonner';
import type { StaticImageData } from 'next/image';

export const ShopContext = createContext<unknown>(null);

interface CartItem {
  sizes: Record<string, number>;
  name: string;
  price: number;
  image: StaticImageData;
}

const ShopContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const currency = '$';
  const delivery_fee = 10;

  const [search, setSearch] = useState<string>('');
  const [showSearch, setShowSearch] = useState<boolean>(false);
  const [cartItems, setCartItems] = useState<Record<string, CartItem>>({});
  const [orders, setOrders] = useState<Array<{ _id: string; size: string; quantity: number }>>([]);

  const addToCart = (itemId: string, size: string): void => {
    if (!size) {
      toast.error('Please select a size');
      return;
    }

    const product = products.find(p => p.id === itemId);
    if (!product) {
      toast.error('Product not found');
      return;
    }

    setCartItems(prevItems => {
      const newItems = { ...prevItems };
      if (!newItems[itemId]) {
        newItems[itemId] = {
          sizes: { [size]: 1 },
          name: product.name,
          price: product.price,
          image: product.images[0]
        };
      } else {
        if (!newItems[itemId].sizes[size]) {
          newItems[itemId].sizes[size] = 1;
        } else {
          newItems[itemId].sizes[size] += 1;
        }
      }
      return newItems;
    });
    console.log('cartItems', cartItems);
    toast.success(`${product.name} added to cart`);
  };

  const addOrder = (): void => {
    const newOrder = Object.entries(cartItems).flatMap(([itemId, item]) =>
      Object.entries(item.sizes).map(([size, quantity]) => ({
        _id: itemId,
        size,
        quantity,
      }))
    );
    setOrders(prevOrders => [...prevOrders, ...newOrder]);
    //setCartItems({});
  };

  const getCartCount = (): number => {
    return Object.values(cartItems).reduce(
      (total, item) => total + Object.values(item.sizes).reduce((sum, quantity) => sum + quantity, 0),
      0
    );
  };

  const updateQuantity = (itemId: string, size: string, quantity: number): void => {
    setCartItems(prevItems => ({
      ...prevItems,
      [itemId]: { ...prevItems[itemId], sizes: { ...prevItems[itemId].sizes, [size]: quantity } },
    }));
  };

  const getCartAmount = (): number => {
    return Object.values(cartItems).reduce((total, item) => {
      return total + Object.values(item.sizes).reduce((itemTotal, quantity) => {
        return itemTotal + item.price * quantity;
      }, 0);
    }, 0);
  };

  const value = {
    products,
    currency,
    delivery_fee,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    cartItems,
    addToCart,
    getCartCount,
    updateQuantity,
    getCartAmount,
    addOrder,
    orders
  };

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
};

export default ShopContextProvider;
