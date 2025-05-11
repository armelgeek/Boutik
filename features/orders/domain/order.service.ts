import { API_ENDPOINTS, API_URL } from '@/shared/lib/config/api';
import { DisplayCartItem } from '@/features/cart/hooks/use-sorted-cart';
import { serializeSearchParams } from '../config/order.param';
import { PaginatedOrder } from '../config/order.type';

export interface CreateOrderPayload {

  items: DisplayCartItem[];
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
  list(filter: any): Promise<PaginatedOrder>;
  cancel(id: string): Promise<any>;
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
    async list(filter: any): Promise<PaginatedOrder> {
      const cleanFilter = Object.fromEntries(
        Object.entries(filter).filter(([_, value]) => value !== null && value !== undefined)
      );
      
      const serialize = serializeSearchParams(cleanFilter);
      const endpoint = API_ENDPOINTS.orders.list(serialize);
      return this.fetchData<PaginatedOrder>(`${API_URL}${endpoint}`, {
        headers: { 'Content-Type': 'application/json' },
        method: 'GET',
      });
    }
  async cancel(id: string): Promise<any> {
    
  }
}

export const orderService = new OrderServiceImpl();
