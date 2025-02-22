import { eq, sql } from 'drizzle-orm';
import { brands } from '@/drizzle/schema';
import { db } from '@/drizzle/db';
import { z } from 'zod';
import { 
  BrandSchema, 
  type BrandPayload, 
  type BrandFilter,
  ValidationError,
  NotFoundError,
  BrandError
} from './brand.type';

export class BrandService {
  private validatePagination(page: number, limit: number) {
    if (page < 1) throw new ValidationError('La page doit être supérieure à 0');
    if (limit < 1 || limit > 100) throw new ValidationError('La limite doit être entre 1 et 100');
  }

  async list({ page = 1, limit = 10, search, status, sortBy, sortDir = 'asc' }: BrandFilter = {}) {
    try {
      this.validatePagination(page, limit);
      const offset = (page - 1) * limit;
      
      let query = db.select().from(brands);
      
      // Filtres
      if (status) {
        query = query.where(eq(brands.status, status));
      }

      if (search?.trim()) {
        query = query.where(sql`LOWER(name) LIKE LOWER(${`%${search.trim()}%`})`);
      }

      // Tri
      if (sortBy) {
        query = query.orderBy(sql`${sql.identifier(sortBy)} ${sql.raw(sortDir)}`);
      }

      const [items, totalResults] = await Promise.all([
        query.limit(limit).offset(offset),
        db.select({ count: sql`count(*)` }).from(brands)
          .where(search ? sql`LOWER(name) LIKE LOWER(${`%${search.trim()}%`})` : undefined)
          .where(status ? eq(brands.status, status) : undefined)
      ]);

      const total = Number(totalResults[0].count);

      return {
        items,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasMore: page < Math.ceil(total / limit)
      };
    } catch (error) {
      if (error instanceof BrandError) throw error;
      throw new BrandError('Erreur lors de la récupération des marques', 'FETCH_ERROR');
    }
  }

  async detail(slug: string) {
    if (!slug?.trim()) {
      throw new ValidationError('Le slug est requis');
    }

    try {
      const brand = await db.query.brands.findFirst({
        where: eq(brands.slug, slug.trim()),
      });

      if (!brand) {
        throw new NotFoundError('Marque non trouvée');
      }

      return brand;
    } catch (error) {
      if (error instanceof BrandError) throw error;
      throw new BrandError('Erreur lors de la récupération de la marque', 'FETCH_ERROR');
    }
  }

  async create(data: unknown) {
    try {
      const validatedData = BrandSchema.parse(data);
      
      // Vérifier si le slug existe déjà
      const existing = await db.query.brands.findFirst({
        where: eq(brands.slug, validatedData.slug),
      });

      if (existing) {
        throw new ValidationError('Une marque avec ce slug existe déjà');
      }

      const [brand] = await db.insert(brands)
        .values({
          ...validatedData,
          createdAt: new Date(),
          updatedAt: new Date()
        })
        .returning();

      return brand;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ValidationError(error.errors[0].message);
      }
      if (error instanceof BrandError) throw error;
      throw new BrandError('Erreur lors de la création de la marque', 'CREATE_ERROR');
    }
  }

  async update(slug: string, data: Partial<BrandPayload>) {
    if (!slug?.trim()) {
      throw new ValidationError('Le slug est requis');
    }

    try {
      // Validation partielle des données
      const validatedData = BrandSchema.partial().parse(data);

      // Vérifier si la marque existe
      const existingBrand = await this.detail(slug);

      if (!existingBrand) {
        throw new NotFoundError('Marque non trouvée');
      }

      // Si le slug est modifié, vérifier qu'il n'existe pas déjà
      if (validatedData.slug && validatedData.slug !== slug) {
        const slugExists = await db.query.brands.findFirst({
          where: eq(brands.slug, validatedData.slug),
        });

        if (slugExists) {
          throw new ValidationError('Une marque avec ce slug existe déjà');
        }
      }

      const [brand] = await db.update(brands)
        .set({
          ...validatedData,
          updatedAt: new Date()
        })
        .where(eq(brands.slug, slug))
        .returning();

      return brand;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ValidationError(error.errors[0].message);
      }
      if (error instanceof BrandError) throw error;
      throw new BrandError('Erreur lors de la mise à jour de la marque', 'UPDATE_ERROR');
    }
  }

  async delete(slug: string) {
    if (!slug?.trim()) {
      throw new ValidationError('Le slug est requis');
    }

    try {
      const [brand] = await db.delete(brands)
        .where(eq(brands.slug, slug.trim()))
        .returning();

      if (!brand) {
        throw new NotFoundError('Marque non trouvée');
      }

      return { success: true, message: 'Marque supprimée avec succès' };
    } catch (error) {
      if (error instanceof BrandError) throw error;
      throw new BrandError('Erreur lors de la suppression de la marque', 'DELETE_ERROR');
    }
  }
}
