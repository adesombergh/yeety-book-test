-- CreateTable
CREATE TABLE "public"."restaurants" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email_contact" TEXT NOT NULL,
    "phone_contact" TEXT,
    "opening_hours" JSONB NOT NULL,
    "slot_interval" INTEGER NOT NULL,
    "min_guests_per_reservation" INTEGER NOT NULL,
    "max_guests_per_reservation" INTEGER NOT NULL,
    "max_reservations_per_slot" INTEGER NOT NULL,
    "reservation_lead_time_min" INTEGER NOT NULL,
    "reservation_lead_time_max" INTEGER NOT NULL,
    "subscription_status" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "restaurants_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "restaurants_slug_key" ON "public"."restaurants"("slug");
