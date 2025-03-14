import 'server-only';
import { sql, and, like, inArray } from 'drizzle-orm';
import { db } from '@/drizzle/db';
import { products } from '@/drizzle/schema/products';
import { categories } from '@/drizzle/schema/categories';
import type { Filter } from '@/shared/lib/types/filter';
import { calculatePagination } from '@/shared/lib/utils/calculate-pagination';
import { createPagination } from '@/shared/lib/utils/create-pagination';

async function getAllSubcategoryIds(categoryId?: string): Promise<string[]> {
  if (!categoryId) return [];

  const subcategories = await db
    .select({ id: categories.id })
    .from(categories)
    .where(sql`${categories.parent_id} = ${categoryId}`);

  const directSubcategoryIds = subcategories.map(cat => cat.id);
  
  const nestedSubcategoryIds = await Promise.all(
    directSubcategoryIds.map(getAllSubcategoryIds)
  );

  return [
    categoryId, 
    ...directSubcategoryIds, 
    ...nestedSubcategoryIds.flat()
  ];
}

async function getCategoryWithParents(categoryId: string) {
  const result = [];
  let currentId = categoryId;

  while (currentId) {
    const category = await db
      .select({
        id: categories.id,
        name: categories.name,
        slug: categories.slug,
        parentId: categories.parent_id
      })
      .from(categories)
      .where(sql`${categories.id} = ${currentId}`)
      .limit(1);

    if (category.length === 0) break;
    
    result.unshift(category[0]);
    currentId = category[0].parentId;
  }

  return result;
}

export async function getProducts(filter: Filter) {
  const conditions = [];

  // Vérifier si les filtres sont non vides
  const hasSearch = filter.search && filter.search.trim() !== '';
  const hasCategory = filter.category && Array.isArray(filter.category) && filter.category.length > 0;
  const hasSubCategory = filter.subCategory && Array.isArray(filter.subCategory) && filter.subCategory.length > 0;
  const hasMinPrice = filter.minPrice !== undefined && filter.minPrice !== null;
  const hasMaxPrice = filter.maxPrice !== undefined && filter.maxPrice !== null;

  if (hasSearch) {
    conditions.push(
      sql`LOWER(${products.name}) LIKE LOWER(${`%${filter.search}%`})`
    );
  }

  if (hasCategory) {
    if (hasSubCategory) {
      conditions.push(inArray(products.category_id, filter.subCategory));
    } else {
      const allCategoryPromises = filter.category.map(getAllSubcategoryIds);
      const nestedCategoryIds = await Promise.all(allCategoryPromises);
      const uniqueCategoryIds = [...new Set(nestedCategoryIds.flat())];
      
      conditions.push(
        inArray(products.category_id, uniqueCategoryIds)
      );
    }
  }

  if (hasMinPrice) {
    conditions.push(
      sql`${products.price} >= ${filter.minPrice}`
    );
  }
  if (hasMaxPrice) {
    conditions.push(
      sql`${products.price} <= ${filter.maxPrice}`
    );
  }

  const orderBy = filter.sortBy 
    ? filter.sortBy === 'price' 
      ? filter.sortDir === 'desc' 
        ? sql`${products.price} DESC` 
        : sql`${products.price} ASC`
    : sql`${products.name} ${filter.sortDir === 'desc' ? sql`DESC` : sql`ASC`}`
    : sql`${products.name} ASC`;

  const [{ count }] = await db
    .select({
      count: sql<number>`count(*)`,
    })
    .from(products)
    .where(conditions.length > 0 ? and(...conditions) : undefined);

  const { currentPage, itemsPerPage, offset } = calculatePagination(
    filter.page || 1,
    filter.pageSize || 10
  );
  
  const pagination = createPagination(count, currentPage, itemsPerPage, offset);

  const basicData = await db
    .select({
      id: products.id,
      name: products.name,
      slug: products.slug,
      price: products.price,
      images: products.images,
      sizes: products.sizes,
      description: products.description,
      categoryId: products.category_id,
      bestseller: products.bestseller,
      category: sql<{
        id: string;
        name: string;
        slug: string;
        parentId?: string;
      }>`json_build_object(
        'id', ${categories}.id,
        'name', ${categories}.name,
        'slug', ${categories}.slug,
        'parentId', ${categories}.parent_id
      )`,
    })
    .from(products)
    .leftJoin(categories, sql`${categories}.id = ${products.category_id}`)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(orderBy)
    .limit(itemsPerPage)
    .offset(offset);

  // Enrichir les données avec les catégories parentes
  const data = await Promise.all(
    basicData.map(async (product) => {
      if (!product.categoryId) return product;

      const categoryHierarchy = await getCategoryWithParents(product.categoryId);
      return {
        ...product,
        subcategory: categoryHierarchy
      };
    })
  );

  return {
    data,
    meta: {
      pagination,
    },
  };
}