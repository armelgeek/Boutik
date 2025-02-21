import { Filter } from '@/shared/lib/types/filter';

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    pagination?: {
      page: number;
      pageSize: number;
      total: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
  };
}

export abstract class BaseService<T, D = void> {
  abstract detail(slug: string): Promise<T>;
  abstract list(filter: Filter): Promise<PaginatedResponse<T>>;
  abstract create(data: Partial<T>): Promise<T>;
  abstract update(id: string, data: Partial<T>): Promise<T>;
  abstract delete(id: string): Promise<D>;
}
