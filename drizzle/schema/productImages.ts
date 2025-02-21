import { pgTable, uuid,text } from "drizzle-orm/pg-core";
import { products } from "./products";
import { sql } from "drizzle-orm";

export const product_images = pgTable(
    'product_images',
    {
        id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
        image: text('image').notNull(),
        product_id: uuid('product_id').notNull().references(() => products.id),
    }
);

