export const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
  throw new Error('NEXT_PUBLIC_API_URL environment variable is not set');
}

export const API_ENDPOINTS = {
  brands: {
    base: '/brands',
    list: (qs: string) => `/brands${qs}`,
    create: '/brands',
    detail: (slug: string) => `/brands/${slug}`,
    update: (slug: string) => `/brands/${slug}`,
    delete: (slug: string) => `/brands/${slug}`,
  },
  categories: {
    base: '/categories',
    list: (qs: string) => `/categories${qs}`,
    create: '/categories',
    detail: (slug: string) => `/categories/${slug}`,
    update: (slug: string) => `/categories/${slug}`,
    delete: (slug: string) => `/categories/${slug}`,
    sub: (categoryId: string) => `/subcategories/${categoryId}`,
    selectCategory: () => `/selectCategories`,
    hasParentCategories: () => `/hasParentCategories`,
  },
  products: {
    base: '/products',
    list: (qs: string) => `/products${qs}`,
    create: '/products',
    detail: (slug: string) => `/products/${slug}`,
    update: (slug: string) => `/products/${slug}`,
    delete: (slug: string) => `/products/${slug}`,
    bestseller: () => `/bestsellers`,
    latest: () => `/latests`,
    related: (categoryId: string, subCategoryId?: string) => `/products/related?category=${categoryId}&subcategory=${subCategoryId}`,

  },
} as const;
