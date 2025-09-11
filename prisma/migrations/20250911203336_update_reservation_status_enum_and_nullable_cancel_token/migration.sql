/*
  Warnings:

  - The `status` column on the `reservations` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[cancel_token]` on the table `reservations` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "public"."ReservationStatus" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED');

-- AlterTable
ALTER TABLE "public"."reservations" ADD COLUMN     "cancel_token" TEXT,
DROP COLUMN "status",
ADD COLUMN     "status" "public"."ReservationStatus" NOT NULL DEFAULT 'PENDING';

-- CreateIndex
CREATE UNIQUE INDEX "reservations_cancel_token_key" ON "public"."reservations"("cancel_token");
