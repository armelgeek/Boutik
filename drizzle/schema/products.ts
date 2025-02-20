import { sql } from "drizzle-orm";
import { integer, pgTable, text, uuid } from "drizzle-orm/pg-core";

export const products = pgTable(
    'products',
    {
        id: uuid('id')
            .primaryKey()
            .default(sql`gen_random_uuid()`),
        name: text('name'),
        price: integer('price'),
    }
)
export const product_images = pgTable(
    'product_images',
    {
        id: uuid('id')
            .primaryKey()
            .default(sql`gen_random_uuid()`),
        image: text('image'),
        product_id: uuid('product_id')
            .notNull()
            .references(() => products.id),
    }
)