-- CreateTable
CREATE TABLE "public"."User" (
    "id" SERIAL NOT NULL,
    "clerkId" TEXT,
    "email" TEXT NOT NULL,
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
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "restaurants_pkey" PRIMARY KEY ("id")
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
CREATE INDEX "_RestaurantOwners_B_index" ON "public"."_RestaurantOwners"("B");

-- AddForeignKey
ALTER TABLE "public"."_RestaurantOwners" ADD CONSTRAINT "_RestaurantOwners_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."restaurants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_RestaurantOwners" ADD CONSTRAINT "_RestaurantOwners_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
