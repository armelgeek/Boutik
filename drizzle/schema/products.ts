import { sql } from "drizzle-orm";
import { boolean, integer, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { category } from "./category";

export const products = pgTable(
    'products',
    {
        id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
        name: varchar('name', { length: 255 }).notNull(),
        description: text('description').notNull(),
        price: integer('price').notNull(),
        category_id: uuid('category_id').notNull().references(() => category.categoryId),
        sub_category_id: uuid('sub_category_id').notNull().references(() => category.categoryId),
        date: timestamp('date').notNull().defaultNow(),
        bestseller: boolean('bestseller').notNull().default(false),
    }
);


export type Product = typeof products.$inferSelect;
