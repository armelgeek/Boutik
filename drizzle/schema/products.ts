import { sql } from "drizzle-orm";
import { integer, pgTable, text, uuid } from "drizzle-orm/pg-core";

export const products = pgTable(
    'products',
    {
        id: uuid('id')
            .primaryKey()
            .default(sql`gen_random_uuid()`),
        image: text('image'),
        name: text('name'),
        price: integer('price'),
    }
)