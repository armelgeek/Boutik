"use client";
import { createContext, useState, useEffect } from 'react';
import { toast } from 'sonner';
import type { StaticImageData } from 'next/image';
import { Order } from '@/features/products/config/order.type';
import { Product } from '@/features/products/config/product.type';
import { productService } from '@/features/products/domain/product.service';

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
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);


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
          image: (product && product.images) ? product.images[0] : 'https://placehold.co/400'
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
  };

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
    //TODO: typage
    setOrders(prevOrders => [...prevOrders, ...newOrder]);
    // Here you can handle the newOrder, e.g., save it to a database or API
    console.log('New order created:', newOrder);
   // setCartItems({});
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

  const removeFromCart = (itemId: string, size: string): void => {
    const product = products.find(p => p.id === itemId);
    if (!product) {
      toast.error('Product not found');
      return;
    }

    setCartItems(prevItems => {
      const newItems = { ...prevItems };
      if (newItems[itemId]) {
        if (Object.keys(newItems[itemId].sizes).length === 1 && newItems[itemId].sizes[size]) {
          delete newItems[itemId];
        } else {
          const { [size]: _, ...otherSizes } = newItems[itemId].sizes;
          newItems[itemId] = {
            ...newItems[itemId],
            sizes: otherSizes
          };
        }
      }
      return newItems;
    });
  };

  const value = {
    products,
    isLoading,
    currency,
    delivery_fee,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    setProducts, 
    cartItems,
    orders,
    addToCart,
    removeFromCart,
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
