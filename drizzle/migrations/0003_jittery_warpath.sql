ALTER TABLE "product_sizes" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "product_sizes" CASCADE;--> statement-breakpoint
ALTER TABLE "products" RENAME COLUMN "image" TO "slug";--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "sub_category_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_slug_unique" UNIQUE("slug");