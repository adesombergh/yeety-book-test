/*
  Warnings:

  - Made the column `phone` on table `reservations` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."reservations" ALTER COLUMN "phone" SET NOT NULL;
