/*
  Warnings:

  - You are about to drop the `_EVToStation` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `evId` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `evId` to the `ChargingHistory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `batteryCapacity` to the `EV` table without a default value. This is not possible if the table is not empty.
  - Added the required column `batteryPercentage` to the `EV` table without a default value. This is not possible if the table is not empty.
  - Added the required column `brand` to the `EV` table without a default value. This is not possible if the table is not empty.
  - Added the required column `companyName` to the `OwnerDetails` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_EVToStation" DROP CONSTRAINT "_EVToStation_A_fkey";

-- DropForeignKey
ALTER TABLE "_EVToStation" DROP CONSTRAINT "_EVToStation_B_fkey";

-- AlterTable
ALTER TABLE "AdminDetails" ADD COLUMN     "accessLevel" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "assignedZone" TEXT;

-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "evId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ChargingHistory" ADD COLUMN     "evId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "EV" ADD COLUMN     "batteryCapacity" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "batteryPercentage" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "brand" TEXT NOT NULL,
ADD COLUMN     "isDefault" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "OwnerDetails" ADD COLUMN     "address" TEXT,
ADD COLUMN     "companyName" TEXT NOT NULL,
ADD COLUMN     "contactEmail" TEXT;

-- AlterTable
ALTER TABLE "StationMasterDetails" ADD COLUMN     "certification" TEXT,
ADD COLUMN     "experience" INTEGER;

-- AlterTable
ALTER TABLE "UserDetails" ADD COLUMN     "city" TEXT,
ADD COLUMN     "state" TEXT,
ADD COLUMN     "zipCode" TEXT;

-- DropTable
DROP TABLE "_EVToStation";
