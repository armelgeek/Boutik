import { sql } from "drizzle-orm";
import { boolean, integer, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { categories } from "./categories";
import { subCategories } from "./subCategories";
export const products = pgTable(
    'products',
    {
        id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
        name: varchar('name', { length: 255 }).notNull(),
        description: text('description').notNull(),
        price: integer('price').notNull(),
        category_id: uuid('category_id').notNull().references(() => categories.id),
        sub_category_id: uuid('sub_category_id').notNull().references(() => subCategories.id),
        date: timestamp('date').notNull().defaultNow(),
        bestseller: boolean('bestseller').notNull().default(false),
    }
);
