import { serializeSearchParams } from '@/features/category/config/category.param';
import type { Category, CategoryPayload, PaginatedCategory } from '@/features/category/config/category.type';
import { API_ENDPOINTS, API_URL } from '@/shared/lib/config/api';
import type { Filter } from '@/shared/lib/types/filter';

export interface CategoryService {
  list(filter: Filter): Promise<PaginatedCategory>;
  detail(slug: string): Promise<Category>;
  create(payload: CategoryPayload): Promise<Category>;
  update(slug: string, payload: CategoryPayload): Promise<{ message: string }>;
  remove(slug: string): Promise<{ message: string }>;
  sub(categoryId: string):  Promise<PaginatedCategory>
}

export class CategoryServiceImpl implements CategoryService {
  private async fetchData<T>(url: string, options: RequestInit): Promise<T> {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.statusText}`);
    }
    return response.json();
  }

  async list(filter: Filter): Promise<PaginatedCategory> {
    const serialize = serializeSearchParams(filter);
    const endpoint = API_ENDPOINTS.categories.list(serialize);
    return this.fetchData<PaginatedCategory>(`${API_URL}${endpoint}`, {
      headers: { 'Content-Type': 'application/json' },
      method: 'GET',
    });
  }

  async detail(slug: string): Promise<Category> {
    return this.fetchData<Category>(`${API_URL}${API_ENDPOINTS.categories.detail(slug)}`, {
      headers: { 'Content-Type': 'application/json' },
      method: 'GET',
    });
  }

  async create(payload: CategoryPayload): Promise<Category> {
    return this.fetchData<Category>(`${API_URL}${API_ENDPOINTS.categories.create}`, {
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  async update(slug: string, payload: CategoryPayload): Promise<{ message: string }> {
    return this.fetchData<{ message: string }>(`${API_URL}${API_ENDPOINTS.categories.update(slug)}`, {
      headers: { 'Content-Type': 'application/json' },
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  }

  async remove(slug: string): Promise<{ message: string }> {
    return this.fetchData<{ message: string }>(`${API_URL}${API_ENDPOINTS.categories.delete(slug)}`, {
      headers: { 'Content-Type': 'application/json' },
      method: 'DELETE',
    });
  }
  async sub(categoryId: string):  Promise<PaginatedCategory> {
    return this.fetchData<PaginatedCategory>(`${API_URL}${API_ENDPOINTS.categories.sub(categoryId)}`, {
      headers: { 'Content-Type': 'application/json' },
      method: 'GET',
    });
  }
   async selectCategory():  Promise<PaginatedCategory> {
    return this.fetchData<PaginatedCategory>(`${API_URL}${API_ENDPOINTS.categories.selectCategory()}`, {
      headers: { 'Content-Type': 'application/json' },
      method: 'GET',
    });
  }
  async hasParentCategories():  Promise<PaginatedCategory> {
    return this.fetchData<PaginatedCategory>(`${API_URL}${API_ENDPOINTS.categories.hasParentCategories()}`, {
      headers: { 'Content-Type': 'application/json' },
      method: 'GET',
    });
  }
}
export const categoryService = new CategoryServiceImpl();