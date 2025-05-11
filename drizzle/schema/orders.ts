import { pgTable, text, timestamp, integer, jsonb, varchar } from 'drizzle-orm/pg-core';
import { products } from './products';
import { sql } from 'drizzle-orm';

export const orders = pgTable('orders', {
  id: text('id').default(sql`gen_random_uuid()`).primaryKey(),
  userId: text('user_id'),
  status: text('status').notNull().default('pending'),
  total: integer('total').notNull(),
  shippingAddress: jsonb('shipping_address'),
  stripePaymentIntentId: text('stripe_payment_intent_id'),
  cancellationReason: text('cancellation_reason'),
  refundStatus: text('refund_status'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const orderItems = pgTable('order_items', {
  id: text('id').default(sql`gen_random_uuid()`).primaryKey(),
  orderId: text('order_id').references(() => orders.id).notNull(),
  productId: varchar('product_id').references(() => products.id).notNull(),
  quantity: integer('quantity').notNull(),
  price: integer('price').notNull(),
  size: text('size'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
