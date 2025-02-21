import { pgTable, uuid,varchar } from "drizzle-orm/pg-core";
import { products } from "./products";
import { sql } from "drizzle-orm";

export const product_sizes = pgTable(
    'product_sizes',
    {
        id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
        size: varchar('size', { length: 10 }).notNull(),
        product_id: uuid('product_id').notNull().references(() => products.id),
    }
);