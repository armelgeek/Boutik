'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toast } from 'sonner';
import { Product } from '@/features/products/config/product.type';

export type CartItem = {
  id: string;
  sizes: Record<string, number>;
  name: string;
  price: number;
  image: string[];
}

interface CartStore {
  items: Record<string, CartItem>;
  addItem: (itemId: string, size: string, product: Partial<Product>) => void;
  removeItem: (itemId: string, size: string) => void;
  updateQuantity: (itemId: string, size: string, quantity: number) => void;
  clearCart: () => void;
  getCartCount: () => number;
  getCartAmount: () => number;
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: {},
      
      addItem: (itemId, size, product) => {
        if (!size) {
          return toast.error('Please select a size');
        }

        set((state) => {
          const currentItems = { ...state.items };
          
          if (itemId in currentItems) {
            const sizes = { ...currentItems[itemId].sizes };
            sizes[size] = (sizes[size] || 0) + 1;
            currentItems[itemId] = {
              ...currentItems[itemId],
              sizes,
              id: itemId
            };
          } else {
            currentItems[itemId] = {
              id: itemId,
              sizes: { [size]: 1 },
              name: product.name || '',
              price: product.price || 0,
              image: product.images || ''
            };
          }
          
          toast.success('Item added to cart');
          return { items: currentItems };
        });
      },

      removeItem: (itemId, size) => {
        set((state) => {
          const newItems = { ...state.items };
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
          return { items: newItems };
        });
      },

      updateQuantity: (itemId, size, quantity) => {
        set((state) => ({
          items: {
            ...state.items,
            [itemId]: {
              ...state.items[itemId],
              sizes: { ...state.items[itemId].sizes, [size]: quantity }
            }
          }
        }));
      },

      clearCart: () => set({ items: {} }),

      getCartCount: () => {
        const state = get();
        return Object.values(state.items).reduce(
          (total, item) => total + Object.values(item.sizes).reduce((sum, quantity) => sum + quantity, 0),
          0
        );
      },

      getCartAmount: () => {
        const state = get();
        return Object.values(state.items).reduce((total, item) => {
          return total + Object.values(item.sizes).reduce((itemTotal, quantity) => {
            return itemTotal + item.price * quantity;
          }, 0);
        }, 0);
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);
