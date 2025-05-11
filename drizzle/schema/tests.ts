import { sql } from 'drizzle-orm';
import { pgTable, text, timestamp, varchar } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-zod';
import { z } from 'zod';

export const tests = pgTable(
  'tests',
  {
    id: text()
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    name: varchar('name', { length: 255 }).notNull(),

    createdAt: timestamp('created_at', { mode: 'string' }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { mode: 'string' }).notNull().defaultNow(),
  }
);

export const testSelectSchema = createSelectSchema(tests);
export const testCreateSchema = createInsertSchema(tests).pick({
  name: true,
});
export const testUpdateSchema = createUpdateSchema(tests).partial();

export type SelectTest = z.infer<typeof testSelectSchema>;
export type CreateTest = z.infer<typeof testCreateSchema>;
export type UpdateTest = z.infer<typeof testUpdateSchema>;
