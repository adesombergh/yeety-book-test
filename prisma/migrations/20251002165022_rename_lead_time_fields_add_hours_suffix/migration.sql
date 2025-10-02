-- Rename lead time columns to include 'hours' suffix for clarity
ALTER TABLE "restaurants" 
  RENAME COLUMN "reservation_lead_time_min" TO "reservation_lead_time_min_hours";

ALTER TABLE "restaurants" 
  RENAME COLUMN "reservation_lead_time_max" TO "reservation_lead_time_max_hours";
