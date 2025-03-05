import 'server-only';
import { sql } from 'drizzle-orm';
import { db } from '@/drizzle/db';
import { products } from '@/drizzle/schema/products';

export async function getRelatedProducts(categoryId: string, subCategoryId?: string, limit: number = 5) {
  const conditions = [];

  // Condition de base : même catégorie
  conditions.push(sql`${products.category_id} = ${categoryId}`);

  // Si une sous-catégorie est fournie, l'ajouter comme condition
  if (subCategoryId) {
    conditions.push(sql`${products.sub_category_id} = ${subCategoryId}`);
  }

  const data = await db
    .select({
      id: products.id,
      name: products.name,
      slug: products.slug,
      price: products.price,
      images: products.images,
      bestseller: products.bestseller
    })
    .from(products)
    .where(sql`${sql.join(conditions, sql` AND `)}`)
    .limit(limit);

  return data;
}
