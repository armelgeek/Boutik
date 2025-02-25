DROP TABLE "product_images" CASCADE;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "sizes" text[];--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "images" text[];