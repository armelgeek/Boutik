import { sql } from 'drizzle-orm';
import {  pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';


export const category = pgTable(
    'category',
    {
        categoryId: uuid('category_id')
            .primaryKey()
            .default(sql`gen_random_uuid()`),
        slug: varchar('slug', { length: 255 }).notNull().unique(),
        name: varchar('name', { length: 255 }).notNull(),
        description: varchar('description', { length: 255 }),
        parent_id: varchar('parent_id', { length: 255 }),
        createdAt: timestamp('created_at').notNull().defaultNow(),
        updatedAt: timestamp('updated_at').notNull().defaultNow(),
    }
);