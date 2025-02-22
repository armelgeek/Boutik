import { pgTable, uuid,varchar } from "drizzle-orm/pg-core";
import { categories } from "./categories";
import { sql } from "drizzle-orm";

export const subCategories = pgTable(
    'sub_categories',
    {
        id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
        name: varchar('name', { length: 50 }).notNull(),
        category_id: uuid('category_id').notNull().references(() => categories.id),
    }
);