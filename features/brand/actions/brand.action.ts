'use server';

import { revalidatePath } from 'next/cache';
import { Brand, BrandPayload } from '../config/brand.type';
import { db } from '@/shared/lib/db';
import { brands } from '@/shared/lib/db/schema';
import { eq } from 'drizzle-orm';
import { slugify } from '@/shared/lib/utils/slugify';
import type { Filter } from '@/shared/lib/types/filter';
import { calculatePagination } from '@/shared/lib/utils/calculate-pagination';
import { createPagination } from '@/shared/lib/utils/create-pagination';

export async function getBrands(filter: Filter) {
  try {
    const { page, limit } = filter;
    const { offset } = calculatePagination(page, limit);

    const [data, total] = await Promise.all([
      db.select().from(brands).limit(limit).offset(offset),
      db.select({ count: sql`count(*)` }).from(brands)
    ]);

    return createPagination({
      data,
      total: Number(total[0].count),
      page,
      limit
    });
  } catch (error) {
    throw new Error('Failed to fetch brands');
  }
}

export async function getBrand(slug: string) {
  try {
    const [brand] = await db
      .select()
      .from(brands)
      .where(eq(brands.slug, slug))
      .limit(1);

    if (!brand) {
      throw new Error('Brand not found');
    }

    return brand;
  } catch (error) {
    throw new Error('Failed to fetch brand');
  }
}

export async function createBrand(payload: BrandPayload) {
  try {
    const slug = slugify(payload.name);
    const [brand] = await db
      .insert(brands)
      .values({ ...payload, slug })
      .returning();

    revalidatePath('/admin/brands');
    return brand;
  } catch (error) {
    throw new Error('Failed to create brand');
  }
}

export async function updateBrand(slug: string, payload: BrandPayload) {
  try {
    await db
      .update(brands)
      .set(payload)
      .where(eq(brands.slug, slug));

    revalidatePath('/admin/brands');
    revalidatePath(`/admin/brands/${slug}`);
    return { message: 'Brand updated successfully' };
  } catch (error) {
    throw new Error('Failed to update brand');
  }
}

export async function deleteBrand(slug: string) {
  try {
    await db
      .delete(brands)
      .where(eq(brands.slug, slug));

    revalidatePath('/admin/brands');
    return { message: 'Brand deleted successfully' };
  } catch (error) {
    throw new Error('Failed to delete brand');
  }
}
