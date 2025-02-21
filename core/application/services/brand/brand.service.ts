import { BrandRepositoryImpl, type BrandRepository } from '@/core/application/repository/brand.repository';
import type { Brand, BrandPayload, PaginatedBrand } from '@/core/domain/types/brand.type';
import type { Filter } from '@/shared/lib/types/filter';
import { BaseService } from '@/core/application/services/base.service';

export interface BrandService {
  list(filter: Filter): Promise<PaginatedBrand>;
  detail(slug: string): Promise<Brand>;
  create(payload: BrandPayload): Promise<Brand>;
  update(slug: string, payload: BrandPayload): Promise<Brand>;
  delete(slug: string): Promise<void>;
}

export class BrandServiceImpl extends BaseService<Brand> implements BrandService {
  private readonly brandRepository: BrandRepository;

  constructor(
    brandRepository: BrandRepository = new BrandRepositoryImpl()
  ) {
    super();
    this.brandRepository = brandRepository;
  }

  async list(filter: Filter): Promise<PaginatedBrand> {
    return this.brandRepository.list(filter);
  }

  async detail(slug: string): Promise<Brand> {
    return this.brandRepository.detail(slug);
  }

  async create(payload: BrandPayload): Promise<Brand> {
    return this.brandRepository.create(payload);
  }

  async update(slug: string, payload: BrandPayload): Promise<Brand> {
    await this.brandRepository.update(slug, payload);
    return this.detail(slug);
  }

  async delete(slug: string): Promise<void> {
    await this.brandRepository.delete(slug);
  }
}
