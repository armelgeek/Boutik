'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Order } from '@/features/products/config/order.type';
import { useCart } from '@/features/cart/hooks/use-cart';
import { orderService } from '../domain/order.service';

interface OrderStore {
  orders: Order[];
  addOrder: () => Promise<void>;
  setOrders: (orders: Order[]) => void;
}

export const useOrders = create<OrderStore>()(
  persist(
    (set) => ({
      orders: [],
      setOrders: (orders) => set({ orders }),
      addOrder: async () => {
        const { items, getCartAmount, clearCart } = useCart.getState();
        
        try {
          const newOrders = Object.entries(items).flatMap(([itemId, item]) =>
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
            }))
          );

          // Sauvegarder la commande dans la base de données
          await orderService.create({
            items: Object.values(items).flatMap(item => 
              Object.entries(item.sizes).map(([size, quantity]) => ({
                id: item.id,
                name: item.name,
                price: item.price,
                image: item.image,
                size,
                quantity
              }))
            ),
            total: getCartAmount()
          });

          set((state) => ({
            orders: [...state.orders, ...newOrders]
          }));

          // Vider le panier après une commande réussie
          clearCart();
        } catch (error) {
          console.error('Failed to create order:', error);
          throw error;
        }
      },
    }),
    {
      name: 'orders-storage',
    }
  )
);
