import { BrandRepositoryImpl, type BrandRepository } from '@/core/application/repository/brand.repository';
import type { Brand, BrandPayload } from '@/core/domain/types/brand.type';
import type { Filter } from '@/shared/lib/types/filter';
import { BaseService, PaginatedResponse } from '@/core/application/services/base.service';

export interface BrandService {
  list(filter: Filter): Promise<PaginatedResponse<Brand>>;
  detail(slug: string): Promise<Brand>;
  create(payload: BrandPayload): Promise<Brand>;
  update(slug: string, payload: Partial<Brand>): Promise<Brand>;
  delete(slug: string): Promise<{ message: string }>;
  findById(id: string): Promise<Brand>;
}

export class BrandServiceImpl extends BaseService<Brand, { message: string }> implements BrandService {
  private readonly brandRepository: BrandRepository;

  constructor(
    brandRepository: BrandRepository = new BrandRepositoryImpl()
  ) {
    super();
    this.brandRepository = brandRepository;
  }

  async list(filter: Filter): Promise<PaginatedResponse<Brand>> {
    return this.brandRepository.list(filter);
  }

  async detail(slug: string): Promise<Brand> {
    return this.brandRepository.detail(slug);
  }

  async create(payload: BrandPayload): Promise<Brand> {
    return this.brandRepository.create(payload);
  }

  async update(slug: string, payload: Partial<Brand>): Promise<Brand> {
    return this.brandRepository.update(slug, payload);
  }

  async delete(slug: string): Promise<{ message: string }> {
    return this.brandRepository.delete(slug);
  }

  async findById(id: string): Promise<Brand> {
    return this.brandRepository.findById(id);
  }
}
