import { Filter } from '@/shared/lib/types/filter';
import { BrandService } from './brand.service';
import type {  BrandPayload } from './brand.type';

const brandService = new BrandService();

// Action pour lister les marques
export async function getBrands(filter: Filter = {}) {
  try {
    const result = await brandService.list(filter);
    return { success: true, data: result };
  } catch (error) {
    if (error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: 'Une erreur est survenue lors de la récupération des marques' };
  }
}

// Action pour récupérer une marque
export async function getBrand(slug: string) {
  try {
    const brand = await brandService.detail(slug);
    return { success: true, data: brand };
  } catch (error) {
    if (error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: 'Une erreur est survenue lors de la récupération de la marque' };
  }
}

// Action pour créer une marque
export async function createBrand(data: unknown) {
  try {
    const brand = await brandService.create(data);
    return { success: true, data: brand };
  } catch (error) {
    if (error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: 'Une erreur est survenue lors de la création de la marque' };
  }
}

// Action pour mettre à jour une marque
export async function updateBrand(slug: string, data: Partial<BrandPayload>) {
  try {
    const brand = await brandService.update(slug, data);
    return { success: true, data: brand };
  } catch (error) {
    if (error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: 'Une erreur est survenue lors de la mise à jour de la marque' };
  }
}

// Action pour supprimer une marque
export async function deleteBrand(slug: string) {
  try {
    const result = await brandService.delete(slug);
    return { success: true, data: result };
  } catch (error) {
    if (error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: 'Une erreur est survenue lors de la suppression de la marque' };
  }
}

// Action pour vérifier si un slug existe déjà
export async function checkSlugExists(slug: string) {
  try {
    const brand = await brandService.detail(slug);
    return { success: true, exists: !!brand };
  } catch (error) {
    if (error && error.code === 'NOT_FOUND') {
      return { success: true, exists: false };
    }
    return { success: false, error: 'Une erreur est survenue lors de la vérification du slug' };
  }
}

// Action pour générer un slug unique
export async function generateUniqueSlug(name: string) {
  try {
    const baseSlug = name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    let slug = baseSlug;
    let counter = 1;

    while ((await checkSlugExists(slug)).exists) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    return { success: true, data: slug };
  } catch (error) {
    return { success: false, error: 'Une erreur est survenue lors de la génération du slug' };
  }
}
