import { eq, sql } from 'drizzle-orm';
import { category } from '@/drizzle/schema';
import type { CategoryFormSchema } from '../domain/schema/category.schema';
import type { z } from 'zod';
import { db } from '@/drizzle/db';

export class CategoryService {
  async create(data: z.infer<typeof CategoryFormSchema>) {
    return db.insert(category).values(data).returning();
  }

  async update(slug: string, data: z.infer<typeof CategoryFormSchema>) {
    return db
      .update(category)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(category.slug, slug))
      .returning();
  }

  async delete(slug: string) {
    return db.delete(category).where(eq(category.slug, slug)).returning();
  }

  async findBySlug(slug: string) {
    return db.query.category.findFirst({
      where: eq(category.slug, slug),
    });
  }

  async findAll(query?: { page?: number; limit?: number }) {
    const { page = 1, limit = 10 } = query || {};
    const offset = (page - 1) * limit;

    const [items, total] = await Promise.all([
      db.query.category.findMany({
        limit,
        offset,
        orderBy: (categories) => [categories.createdAt],
      }),
      db.select({ count: sql`count(*)` }).from(category),
    ]);

    return {
      items,
      total: Number(total[0].count),
      page,
      limit,
      totalPages: Math.ceil(Number(total[0].count) / limit),
    };
  }
}
