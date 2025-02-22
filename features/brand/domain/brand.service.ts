import { serializeSearchParams } from '@/features/brand/config/brand.param';
import type { Brand, BrandPayload, PaginatedBrand } from '@/features/brand/config/brand.type';
import { API_ENDPOINTS, API_URL } from '@/shared/lib/config/api';
import type { Filter } from '@/shared/lib/types/filter';

export interface BrandService {
  list(filter: Filter): Promise<PaginatedBrand>;
  detail(slug: string): Promise<Brand>;
  create(payload: BrandPayload): Promise<Brand>;
  update(slug: string, payload: BrandPayload): Promise<{ message: string }>;
  remove(slug: string): Promise<{ message: string }>;
}

export class BrandServiceImpl implements BrandService {
  private async fetchData<T>(url: string, options: RequestInit): Promise<T> {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.statusText}`);
    }
    return response.json();
  }

  async list(filter: Filter): Promise<PaginatedBrand> {
    const serialize = serializeSearchParams(filter);
    const endpoint = API_ENDPOINTS.brands.list(serialize);
    return this.fetchData<PaginatedBrand>(`${API_URL}${endpoint}`, {
      headers: { 'Content-Type': 'application/json' },
      method: 'GET',
    });
  }

  async detail(slug: string): Promise<Brand> {
    return this.fetchData<Brand>(`${API_URL}${API_ENDPOINTS.brands.detail(slug)}`, {
      headers: { 'Content-Type': 'application/json' },
      method: 'GET',
    });
  }

  async create(payload: BrandPayload): Promise<Brand> {
    return this.fetchData<Brand>(`${API_URL}${API_ENDPOINTS.brands.create}`, {
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  async update(slug: string, payload: BrandPayload): Promise<{ message: string }> {
    return this.fetchData<{ message: string }>(`${API_URL}${API_ENDPOINTS.brands.update(slug)}`, {
      headers: { 'Content-Type': 'application/json' },
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  }

  async remove(slug: string): Promise<{ message: string }> {
    return this.fetchData<{ message: string }>(`${API_URL}${API_ENDPOINTS.brands.delete(slug)}`, {
      headers: { 'Content-Type': 'application/json' },
      method: 'DELETE',
    });
  }
}
export const brandService = new BrandServiceImpl();