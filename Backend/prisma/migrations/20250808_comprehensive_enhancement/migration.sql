-- Comprehensive EV Station System Enhancement Migration
-- This migration adds all the enhanced fields and constraints

-- Add new fields to Booking table
ALTER TABLE "Booking" ADD COLUMN "estimatedCost" DOUBLE PRECISION;
ALTER TABLE "Booking" ADD COLUMN "actualCost" DOUBLE PRECISION;
ALTER TABLE "Booking" ADD COLUMN "batteryLevel" INTEGER;
ALTER TABLE "Booking" ADD COLUMN "portType" TEXT;
ALTER TABLE "Booking" ADD COLUMN "energyConsumed" DOUBLE PRECISION;
ALTER TABLE "Booking" ADD COLUMN "chargingDuration" INTEGER;
ALTER TABLE "Booking" ADD COLUMN "confirmedAt" TIMESTAMP(3);
ALTER TABLE "Booking" ADD COLUMN "completedAt" TIMESTAMP(3);

-- Add index on booking status
CREATE INDEX "Booking_status_idx" ON "Booking"("status");

-- Add new fields to ChargingSlot table
ALTER TABLE "ChargingSlot" ADD COLUMN "slotNumber" TEXT;
ALTER TABLE "ChargingSlot" ADD COLUMN "isActive" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "ChargingSlot" ADD COLUMN "pricePerKwh" DOUBLE PRECISION NOT NULL DEFAULT 8.0;
ALTER TABLE "ChargingSlot" ADD COLUMN "status" TEXT NOT NULL DEFAULT 'AVAILABLE';
ALTER TABLE "ChargingSlot" ADD COLUMN "lastMaintenance" TIMESTAMP(3);

-- Add unique constraint for stationId and slotNumber combination
ALTER TABLE "ChargingSlot" ADD CONSTRAINT "ChargingSlot_stationId_slotNumber_key" UNIQUE ("stationId", "slotNumber");

-- Add index on stationId and status
CREATE INDEX "ChargingSlot_stationId_status_idx" ON "ChargingSlot"("stationId", "status");

-- Add new fields to StationMasterDetails table
ALTER TABLE "StationMasterDetails" ADD COLUMN "employeeId" TEXT;
ALTER TABLE "StationMasterDetails" ADD COLUMN "designation" TEXT NOT NULL DEFAULT 'Station Master';
ALTER TABLE "StationMasterDetails" ADD COLUMN "salary" DOUBLE PRECISION;
ALTER TABLE "StationMasterDetails" ADD COLUMN "joiningDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "StationMasterDetails" ADD COLUMN "isActive" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "StationMasterDetails" ADD COLUMN "permissions" TEXT;
ALTER TABLE "StationMasterDetails" ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- Add unique constraint for employeeId
ALTER TABLE "StationMasterDetails" ADD CONSTRAINT "StationMasterDetails_employeeId_key" UNIQUE ("employeeId");

-- Add indexes for StationMasterDetails
CREATE INDEX "StationMasterDetails_stationId_idx" ON "StationMasterDetails"("stationId");
CREATE INDEX "StationMasterDetails_ownerId_idx" ON "StationMasterDetails"("ownerId");

-- Add new fields to Station table
ALTER TABLE "Station" ADD COLUMN "city" TEXT;
ALTER TABLE "Station" ADD COLUMN "state" TEXT;
ALTER TABLE "Station" ADD COLUMN "zipCode" TEXT;
ALTER TABLE "Station" ADD COLUMN "email" TEXT;
ALTER TABLE "Station" ADD COLUMN "operatingHours" TEXT DEFAULT '24/7';
ALTER TABLE "Station" ADD COLUMN "amenities" TEXT;
ALTER TABLE "Station" ADD COLUMN "images" TEXT;
ALTER TABLE "Station" ADD COLUMN "isActive" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "Station" ADD COLUMN "isVerified" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Station" ADD COLUMN "rating" DOUBLE PRECISION DEFAULT 0.0;
ALTER TABLE "Station" ADD COLUMN "totalReviews" INTEGER NOT NULL DEFAULT 0;

-- Add indexes for Station
CREATE INDEX "Station_city_state_idx" ON "Station"("city", "state");
CREATE INDEX "Station_isActive_isVerified_idx" ON "Station"("isActive", "isVerified");

-- Update existing ChargingSlot records with default slotNumber
UPDATE "ChargingSlot" 
SET "slotNumber" = 'A' || LPAD((ROW_NUMBER() OVER (PARTITION BY "stationId" ORDER BY "createdAt"))::text, 2, '0')
WHERE "slotNumber" IS NULL;

-- Make slotNumber NOT NULL after setting default values
ALTER TABLE "ChargingSlot" ALTER COLUMN "slotNumber" SET NOT NULL;

-- Update existing StationMasterDetails with default employeeId
UPDATE "StationMasterDetails" 
SET "employeeId" = 'EMP' || EXTRACT(EPOCH FROM "createdAt")::bigint::text
WHERE "employeeId" IS NULL;

-- Make employeeId NOT NULL after setting default values
ALTER TABLE "StationMasterDetails" ALTER COLUMN "employeeId" SET NOT NULL;