import { boolean, integer, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { categories } from "./categories";
import { subCategories } from "./subCategories";
export const products = pgTable(
    'products',
    {
        id: varchar('id', { length: 255 }).notNull().unique().primaryKey(),
        name: varchar('name', { length: 255 }).notNull(),
        slug: varchar('slug', { length: 255 }).notNull().unique(),
        description: text('description').notNull(),
        price: integer('price').notNull(),
        sizes: text('sizes').array(),
        category_id: text('category_id').notNull().references(() => categories.id),
        sub_category_id: text('sub_category_id').references(() => subCategories.id),
        date: timestamp('date').notNull().defaultNow(),
        bestseller: boolean('bestseller').notNull().default(false),
        images: text('images').array(),
        stripeProductId: varchar('stripe_product_id', { length: 255 }).notNull(),
    }
);
export const ProductSelectSchema = typeof products.$inferSelect;
