import { pgTable,timestamp, uuid,varchar } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
export const categories = pgTable(
    'categories',
    {
        id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
        name: varchar('name', { length: 50 }).notNull().unique(),
        slug: varchar('slug', { length: 50 }).notNull().unique(),
        parent_id: uuid('parent_id'),
        createdAt: timestamp('created_at', { mode: 'string' }).notNull().defaultNow(),
        updatedAt: timestamp('updated_at', { mode: 'string' }).notNull().defaultNow(),
    }
);

