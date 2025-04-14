/*
  Warnings:

  - Added the required column `ownerId` to the `StationMasterDetails` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "StationMasterDetails" ADD COLUMN     "ownerId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "StationMasterDetails" ADD CONSTRAINT "StationMasterDetails_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
