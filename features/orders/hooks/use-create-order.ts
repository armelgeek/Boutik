'use client';

import { useState } from 'react';
import { useCart } from '@/features/cart/hooks/use-cart';
import { orderService } from '../domain/order.service';

export function useCreateOrder() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { items, total, clearCart } = useCart();

  const createOrder = async (shippingAddress?: {
    fullName: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
    phone: string;
  }) => {
    try {
      setIsLoading(true);
      setError(null);

      const order = await orderService.create({
        items,
        total,
        shippingAddress,
      });

      // Vider le panier après une commande réussie
      clearCart();

      return order;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create order');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createOrder,
    isLoading,
    error,
  };
}
