import { pgTable, uuid,varchar } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
export const categories = pgTable(
    'categories',
    {
        id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
        name: varchar('name', { length: 50 }).notNull().unique(),
    }
);

