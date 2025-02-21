import { pgTable, text, uuid, varchar } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const categories = pgTable(
    'categories',
    {
        id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
        name: varchar('name', { length: 50 }).notNull().unique(),
        description: text('description'),
        parent_id: uuid('parent_id'),
    }
);

export type Category = typeof categories.$inferSelect;