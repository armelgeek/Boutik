# L'Histoire de la Création d'un CRUD dans Boutik

## Chapitre 1 : La Fondation - Préparation de la Base de Données 🏗️

Notre voyage commence dans le dossier `/drizzle/schema/brands.ts`. C'est ici que nous définissons la structure de notre table :

```typescript
import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const brands = pgTable('brands', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});
```

Ensuite, nous créons notre migration avec la commande :
```bash
npm run db:generate
```

## Chapitre 2 : Les Types - Notre Contrat avec TypeScript 📝

Dans `/core/types/brands.ts`, nous définissons nos types :

```typescript
export interface Brand {
  id: string;
  name: string;
  slug: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateBrandInput {
  name: string;
  description?: string;
}

export interface UpdateBrandInput extends Partial<CreateBrandInput> {}
```

## Chapitre 3 : La Validation - Notre Gardien ⚔️

Dans `/core/validations/brands.ts`, nous créons nos schémas de validation :

```typescript
import { z } from 'zod';

export const createBrandSchema = z.object({
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  description: z.string().optional(),
});

export const updateBrandSchema = createBrandSchema.partial();
```

## Chapitre 4 : Les Routes API - Notre Interface avec le Monde 🌐

### 1. Création - POST (`/app/api/v1/brands/route.ts`)

```typescript
import { NextResponse } from 'next/server';
import { createBrandSchema } from '@/core/validations/brands';
import { db } from '@/lib/db';
import { brands } from '@/drizzle/schema/brands';
import { slugify } from '@/lib/utils';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedData = createBrandSchema.parse(body);
    
    const brand = await db.insert(brands).values({
      name: validatedData.name,
      slug: slugify(validatedData.name),
      description: validatedData.description,
    }).returning();

    return NextResponse.json(brand[0], { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Erreur lors de la création' }, { status: 400 });
  }
}
```

### 2. Lecture - GET (`/app/api/v1/brands/route.ts`)

```typescript
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') ?? '1');
  const limit = parseInt(searchParams.get('limit') ?? '10');
  const offset = (page - 1) * limit;

  try {
    const allBrands = await db.select().from(brands)
      .limit(limit)
      .offset(offset);

    return NextResponse.json(allBrands);
  } catch (error) {
    return NextResponse.json({ error: 'Erreur lors de la récupération' }, { status: 500 });
  }
}
```

### 3. Lecture par Slug (`/app/api/v1/brands/[slug]/route.ts`)

```typescript
export async function GET(
  req: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const brand = await db.query.brands.findFirst({
      where: eq(brands.slug, params.slug),
    });

    if (!brand) {
      return NextResponse.json({ error: 'Marque non trouvée' }, { status: 404 });
    }

    return NextResponse.json(brand);
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
```

## Chapitre 5 : L'Interface Utilisateur - Notre Vitrine 🎨

### 1. La Liste (`/app/(admin)/d/master/brand/page.client.tsx`)

```typescript
'use client';

import { useQuery } from '@tanstack/react-query';
import { DataTable } from '@/components/ui/data-table';
import { columns } from './columns';

export function BrandList() {
  const { data, isLoading } = useQuery({
    queryKey: ['brands'],
    queryFn: () => fetch('/api/v1/brands').then(res => res.json()),
  });

  if (isLoading) return <div>Chargement...</div>;

  return (
    <DataTable 
      columns={columns} 
      data={data} 
    />
  );
}
```

### 2. Le Formulaire de Création (`/app/(admin)/d/master/brand/create.tsx`)

```typescript
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createBrandSchema } from '@/core/validations/brands';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export function CreateBrandForm() {
  const form = useForm({
    resolver: zodResolver(createBrandSchema),
  });

  const onSubmit = async (data) => {
    await fetch('/api/v1/brands', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <Input {...form.register('name')} placeholder="Nom de la marque" />
      <Textarea {...form.register('description')} placeholder="Description" />
      <Button type="submit">Créer</Button>
    </form>
  );
}
```
