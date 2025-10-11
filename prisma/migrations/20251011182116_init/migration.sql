-- CreateEnum
CREATE TYPE "public"."ReservationStatus" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED');

-- CreateTable
CREATE TABLE "public"."User" (
    "id" SERIAL NOT NULL,
    "clerkId" TEXT,
    "email" TEXT NOT NULL,
    "is_admin" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."restaurants" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "vat_number" TEXT NOT NULL,
    "logo_url" TEXT,
    "email_contact" TEXT,
    "phone_contact" TEXT,
    "opening_hours" JSONB,
    "slot_interval" INTEGER NOT NULL DEFAULT 60,
    "min_guests_per_reservation" INTEGER NOT NULL DEFAULT 1,
    "max_guests_per_reservation" INTEGER NOT NULL DEFAULT 6,
    "max_reservations_per_slot" INTEGER NOT NULL DEFAULT 1,
    "reservation_lead_time_min_hours" INTEGER NOT NULL DEFAULT 1,
    "reservation_lead_time_max_hours" INTEGER NOT NULL DEFAULT 129600,
    "subscription_status" TEXT NOT NULL DEFAULT 'active',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "restaurants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."reservations" (
    "id" SERIAL NOT NULL,
    "restaurant_id" INTEGER NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "guests" INTEGER NOT NULL,
    "notes" TEXT,
    "deposit_amount" DECIMAL(10,2),
    "status" "public"."ReservationStatus" NOT NULL DEFAULT 'PENDING',
    "cancel_token" TEXT,
    "cancelled_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reservations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."_RestaurantOwners" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_RestaurantOwners_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_clerkId_key" ON "public"."User"("clerkId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "restaurants_slug_key" ON "public"."restaurants"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "restaurants_vat_number_key" ON "public"."restaurants"("vat_number");

-- CreateIndex
CREATE UNIQUE INDEX "reservations_cancel_token_key" ON "public"."reservations"("cancel_token");

-- CreateIndex
CREATE INDEX "_RestaurantOwners_B_index" ON "public"."_RestaurantOwners"("B");

-- AddForeignKey
ALTER TABLE "public"."reservations" ADD CONSTRAINT "reservations_restaurant_id_fkey" FOREIGN KEY ("restaurant_id") REFERENCES "public"."restaurants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_RestaurantOwners" ADD CONSTRAINT "_RestaurantOwners_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."restaurants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_RestaurantOwners" ADD CONSTRAINT "_RestaurantOwners_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
