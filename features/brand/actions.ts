'use server';

import { revalidatePath } from 'next/cache';
import { brands } from '@/drizzle/schema';
import { eq, sql } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '@/drizzle/db';

const BrandSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  status: z.enum(['active', 'inactive']).default('active'),
  image: z.string().nullable(),
});

export type BrandFormData = z.infer<typeof BrandSchema>;

export async function getBrands(page = 1, limit = 10, search?: string) {
  try {
    const offset = (page - 1) * limit;
    let query = db.select().from(brands);
    
    if (search) {
      query = query.where(sql`name ILIKE ${`%${search}%`}`);
    }

    const [items, totalResults] = await Promise.all([
      query.limit(limit).offset(offset),
      db.select({ count: sql`count(*)` }).from(brands)
    ]);

    return {
      items,
      total: Number(totalResults[0].count),
      page,
      limit,
      totalPages: Math.ceil(Number(totalResults[0].count) / limit),
    };
  } catch (error) {
    throw new Error('Failed to fetch brands');
  }
}

export async function getBrand(slug: string) {
  try {
    const brand = await db.query.brands.findFirst({
      where: eq(brands.slug, slug),
    });

    if (!brand) {
      throw new Error('Brand not found');
    }

    return brand;
  } catch (error) {
    throw new Error('Failed to fetch brand');
  }
}

export async function createBrand(data: BrandFormData) {
  try {
    const validatedData = BrandSchema.parse(data);
    const brand = await db.insert(brands).values(validatedData).returning();
    revalidatePath('/d/master/brand');
    return brand[0];
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error('Invalid brand data');
    }
    throw new Error('Failed to create brand');
  }
}

export async function updateBrand(slug: string, data: BrandFormData) {
  try {
    const validatedData = BrandSchema.parse(data);
    const brand = await db
      .update(brands)
      .set({ ...validatedData, updatedAt: new Date() })
      .where(eq(brands.slug, slug))
      .returning();

    revalidatePath('/d/master/brand');
    return brand[0];
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error('Invalid brand data');
    }
    throw new Error('Failed to update brand');
  }
}

export async function deleteBrand(slug: string) {
  try {
    await db.delete(brands).where(eq(brands.slug, slug));
    revalidatePath('/d/master/brand');
    return { message: 'Brand deleted successfully' };
  } catch (error) {
    throw new Error('Failed to delete brand');
  }
}
