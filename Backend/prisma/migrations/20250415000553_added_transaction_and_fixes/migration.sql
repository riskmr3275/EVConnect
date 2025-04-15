/*
  Warnings:

  - The values [AC,DC,FAST] on the enum `SlotType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `batteryPercentage` on the `EV` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "SlotType_new" AS ENUM ('BHARAT_AC_001', 'BHARAT_DC_001', 'TYPE_1_AC', 'TYPE_2_AC', 'GB_T_AC', 'CCS1_DC', 'CCS2_DC', 'GB_T_DC', 'CHADEMO', 'TESLA_SUPERCHARGER');
ALTER TABLE "EV" ALTER COLUMN "preferredAcPort" TYPE "SlotType_new" USING ("preferredAcPort"::text::"SlotType_new");
ALTER TABLE "EV" ALTER COLUMN "preferredDcPort" TYPE "SlotType_new" USING ("preferredDcPort"::text::"SlotType_new");
ALTER TABLE "ChargingSlot" ALTER COLUMN "type" TYPE "SlotType_new" USING ("type"::text::"SlotType_new");
ALTER TYPE "SlotType" RENAME TO "SlotType_old";
ALTER TYPE "SlotType_new" RENAME TO "SlotType";
DROP TYPE "SlotType_old";
COMMIT;

-- AlterTable
ALTER TABLE "EV" DROP COLUMN "batteryPercentage",
ADD COLUMN     "preferredAcPort" "SlotType",
ADD COLUMN     "preferredDcPort" "SlotType",
ALTER COLUMN "isDefault" SET DEFAULT true;
