ALTER TABLE "products" DROP CONSTRAINT "products_sub_category_id_sub_categories_id_fk";
--> statement-breakpoint
ALTER TABLE "products" DROP COLUMN "sub_category_id";