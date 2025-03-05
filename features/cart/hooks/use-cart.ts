'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toast } from 'sonner';
import { Product } from '@/features/products/config/product.type';

export type CartItem = {
  sizes: Record<string, number>;
  name: string;
  price: number;
  image: string;
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
          toast.error('Please select a size');
          return;
        }

        set((state) => {
          const newItems = { ...state.items };
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
          return { items: newItems };
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
