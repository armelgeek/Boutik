import { eq, sql } from 'drizzle-orm';

import { db } from '@/drizzle/db';
import { products } from '@/drizzle/schema/products';
import { categories } from '@/drizzle/schema/categories';

async function getCategoryWithParents(categoryId: string, database: typeof db) {
  const result = [];
  let currentId: string | null = categoryId;

  while (currentId) {
    const category = await database
      .select({
        id: categories.id,
        name: categories.name,
        slug: categories.slug,
        image: categories.image,
        parentId: categories.parent_id
      })
      .from(categories)
      .where(sql`${categories.id} = ${currentId}`)
      .limit(1);

    if (category.length === 0) break;
    
    result.unshift(category[0]);
    currentId = category[0].parentId || null;
  }

  return result;
}

export async function getProduct(slug: string) {
  const basicData = await db
    .select({
      id: products.id,
      name: products.name,
      slug: products.slug,
      price: products.price,
      images: products.images,
      sizes: products.sizes,
      description: products.description,
      category_id: products.category_id,
      sub_category_id: products.sub_category_id,
      date: products.date,
      bestseller: products.bestseller,
      stripeProductId: products.stripeProductId,
      category: sql<{
        id: string;
        name: string;
        slug: string;
        image?: string | null;
        parentId?: string | null;
      }>`json_build_object(
        'id', ${categories}.id,
        'name', ${categories}.name,
        'slug', ${categories}.slug,
        'image', ${categories}.image,
        'parentId', ${categories}.parent_id
      )`,
    })
    .from(products)
    .leftJoin(categories, sql`${categories.id} = ${products.category_id}`)
    .where(eq(products.slug, slug))
    .limit(1);

  if (!basicData || basicData.length === 0) {
    throw new Error('Product not found');
  }

  const product = basicData[0];

  // Enrichir avec la hiérarchie des catégories
  if (product.category_id) {
    const categoryHierarchy = await getCategoryWithParents(product.category_id, db);
    return {
      ...product,
      subcategory: categoryHierarchy
    };
  }

  return product;
}
