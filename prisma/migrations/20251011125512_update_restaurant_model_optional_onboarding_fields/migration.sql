-- AlterTable
ALTER TABLE "public"."restaurants" ALTER COLUMN "email_contact" DROP NOT NULL,
ALTER COLUMN "opening_hours" DROP NOT NULL,
ALTER COLUMN "slot_interval" SET DEFAULT 60,
ALTER COLUMN "min_guests_per_reservation" SET DEFAULT 1,
ALTER COLUMN "max_guests_per_reservation" SET DEFAULT 6,
ALTER COLUMN "max_reservations_per_slot" SET DEFAULT 1,
ALTER COLUMN "reservation_lead_time_min_hours" SET DEFAULT 1,
ALTER COLUMN "reservation_lead_time_max_hours" SET DEFAULT 129600,
ALTER COLUMN "subscription_status" SET DEFAULT 'active';
