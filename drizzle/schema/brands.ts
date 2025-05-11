import { sql } from 'drizzle-orm';
import { json, pgEnum, pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';

export const brandStatusEnum = pgEnum('brand_status', [
  'active',
  'inactive',
  'archived',
  'deleted',
]);

export const brands = pgTable(
  'brands',
  {
    brandId: text('brand_id')
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    slug: varchar('slug', { length: 255 }).notNull().unique(),
    name: varchar('name', { length: 255 }).notNull(),
    country: varchar('country', { length: 255 }).notNull(),
    image: text('image'),
    status: brandStatusEnum().notNull(),
    description: text('description'),
    metadata: json().$type<any>(),

    createdAt: timestamp('created_at', { mode: 'string' }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { mode: 'string' }).notNull().defaultNow(),
  },
);
