import 'server-only';
import { desc, sql } from 'drizzle-orm';
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

export async function getLatestProducts() {
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
        parentId?: string | null;
      }>`json_build_object(
        'id', ${categories}.id,
        'name', ${categories}.name,
        'slug', ${categories}.slug,
        'parentId', ${categories}.parent_id
      )`,
    })
    .from(products)
    .leftJoin(categories, sql`${categories}.id = ${products.category_id}`)
    .limit(8)
    .orderBy(desc(products.date))
    .offset(0);

  // Enrichir les données avec les catégories parentes
  const data = await Promise.all(
    basicData.map(async (product) => {
      if (!product.category_id) return product;

      const categoryHierarchy = await getCategoryWithParents(product.category_id, db);
      return {
        ...product,
        subcategory: categoryHierarchy
      };
    })
  );

  return {
    data
  };
}