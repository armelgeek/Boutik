import { useCallback, useEffect, useState } from 'react';
import { Order } from '@/core/domain/product/order.type';
import { assets } from '@/assets/assets';
import { Product } from '@/core/domain/product/product.type';
export const useOrdersList = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchOrders = useCallback(async () => {
    const response = await new Promise<Order[]>((resolve) =>
      setTimeout(() => resolve([{ 
        id: 1, 
        amount: 39.98, 
        status: 'Ordered',
        created_at: '2023-06-01T10:00:00Z', 
        updated_at: '2023-06-01T10:00:00Z', 
        items: [{ 
          id: 1,
          size: 'M',
          quantity: 1,
          product: { 
            id: '1',
            name: 'Product A',
            price: 19.99, 
            images:[
                `/${assets.hero_img}`
            ], 
          } as Product, 
        }], 
        }, 
        { 
        id: 2, 
        amount: 39.98, 
        status: 'Ordered',
        created_at: '2023-06-01T10:00:00Z', 
        updated_at: '2023-06-01T10:00:00Z', 
        items: [{ 
          id: 1,
          size: 'M',
          quantity: 1,
          product: { 
            id: '1',
            name: 'Product A',
            price: 19.99, 
            images:[
                `/${assets.hero_img}`
            ], 
          } as Product, 
        }],  
      }]), 2000)
    );

    setOrders(response);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return { orders, isLoading };
};
