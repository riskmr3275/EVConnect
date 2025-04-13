/*
  Warnings:

  - You are about to drop the column `assignedStationId` on the `StationMasterDetails` table. All the data in the column will be lost.
  - Added the required column `stationId` to the `StationMasterDetails` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "StationMasterDetails" DROP COLUMN "assignedStationId",
ADD COLUMN     "stationId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "StationMasterDetails" ADD CONSTRAINT "StationMasterDetails_stationId_fkey" FOREIGN KEY ("stationId") REFERENCES "Station"("id") ON DELETE CASCADE ON UPDATE CASCADE;
