import { pgTable, text, timestamp, uuid, integer, jsonb } from 'drizzle-orm/pg-core';
import { products } from './products';

export const orders = pgTable('orders', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id'), // Pour une future authentification
  status: text('status').notNull().default('pending'),
  total: integer('total').notNull(),
  items: jsonb('items').notNull(),
  shippingAddress: jsonb('shipping_address'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const orderItems = pgTable('order_items', {
  id: uuid('id').defaultRandom().primaryKey(),
  orderId: uuid('order_id').references(() => orders.id).notNull(),
  productId: uuid('product_id').references(() => products.id).notNull(),
  quantity: integer('quantity').notNull(),
  price: integer('price').notNull(),
  size: text('size'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
