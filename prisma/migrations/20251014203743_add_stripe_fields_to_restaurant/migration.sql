/*
  Warnings:

  - A unique constraint covering the columns `[stripe_customer_id]` on the table `restaurants` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."restaurants" ADD COLUMN     "stripe_customer_id" TEXT,
ADD COLUMN     "stripe_subscription_id" TEXT,
ALTER COLUMN "subscription_status" DROP NOT NULL,
ALTER COLUMN "subscription_status" DROP DEFAULT;

-- CreateIndex
CREATE UNIQUE INDEX "restaurants_stripe_customer_id_key" ON "public"."restaurants"("stripe_customer_id");
