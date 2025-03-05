import { serializeSearchParams } from '../config/product.param';
import { API_ENDPOINTS, API_URL } from '@/shared/lib/config/api';
import type { Filter } from '@/shared/lib/types/filter';
import { PaginatedProduct, Product, ProductPayload } from '../config/product.type';

export interface ProductService {
  list(filter: Filter): Promise<PaginatedProduct>;
  detail(slug: string): Promise<Product>;
  create(payload: ProductPayload): Promise<Product>;
  update(slug: string, payload: ProductPayload): Promise<{ message: string }>;
  remove(slug: string): Promise<{ message: string }>;
}

export class ProductServiceImpl implements ProductService {
  private async fetchData<T>(url: string, options: RequestInit): Promise<T> {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.statusText}`);
    }
    return response.json();
  }

  async list(filter: Filter): Promise<PaginatedProduct> {
    // Remove null values from filter
    const cleanFilter = Object.fromEntries(
      Object.entries(filter).filter(([_, value]) => value !== null && value !== undefined)
    );
    
    const serialize = serializeSearchParams(cleanFilter);
    const endpoint = API_ENDPOINTS.products.list(serialize);
    return this.fetchData<PaginatedProduct>(`${API_URL}${endpoint}`, {
      headers: { 'Content-Type': 'application/json' },
      method: 'GET',
    });
  }

  async detail(slug: string): Promise<Product> {
    return this.fetchData<Product>(`${API_URL}${API_ENDPOINTS.products.detail(slug)}`, {
      headers: { 'Content-Type': 'application/json' },
      method: 'GET',
    });
  }

  async create(payload: ProductPayload): Promise<Product> {
    return this.fetchData<Product>(`${API_URL}${API_ENDPOINTS.products.create}`, {
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  async update(slug: string, payload: ProductPayload): Promise<{ message: string }> {
    return this.fetchData<{ message: string }>(`${API_URL}${API_ENDPOINTS.products.update(slug)}`, {
      headers: { 'Content-Type': 'application/json' },
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  }

  async remove(slug: string): Promise<{ message: string }> {
    return this.fetchData<{ message: string }>(`${API_URL}${API_ENDPOINTS.products.delete(slug)}`, {
      headers: { 'Content-Type': 'application/json' },
      method: 'DELETE',
    });
  }
  async getBestSellerProducts() {
    return this.fetchData<{data: Product[]}>(`${API_URL}${API_ENDPOINTS.products.bestseller()}`, {
      headers: { 'Content-Type': 'application/json' },
      method: 'GET',
    });
  }
  async getLatestProducts() {
    return this.fetchData<{data: Product[]}>(`${API_URL}${API_ENDPOINTS.products.latest()}`, {
      headers: { 'Content-Type': 'application/json' },
      method: 'GET',
    });
  }

}
export const productService = new ProductServiceImpl();