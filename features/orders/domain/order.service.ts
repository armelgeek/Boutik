import { API_ENDPOINTS, API_URL } from '@/shared/lib/config/api';
import { CartItem } from '@/features/cart/hooks/use-cart';

export interface CreateOrderPayload {
  items: CartItem[];
  total: number;
  shippingAddress?: {
    fullName: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
    phone: string;
  };
}

export interface OrderService {
  create(payload: CreateOrderPayload): Promise<any>;
}

export class OrderServiceImpl implements OrderService {
  private async fetchData<T>(url: string, options: RequestInit): Promise<T> {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.statusText}`);
    }
    return response.json();
  }

  async create(payload: CreateOrderPayload): Promise<any> {
    return this.fetchData(`${API_URL}${API_ENDPOINTS.orders.create}`, {
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }
}

export const orderService = new OrderServiceImpl();
