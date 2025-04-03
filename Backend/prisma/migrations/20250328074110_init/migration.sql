/*
  Warnings:

  - Added the required column `ownerId` to the `Station` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ownerType` to the `Station` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "OwnerType" AS ENUM ('COMPANY', 'INDIVIDUAL');

-- AlterTable
ALTER TABLE "Station" ADD COLUMN     "ownerId" TEXT NOT NULL,
ADD COLUMN     "ownerType" "OwnerType" NOT NULL,
ALTER COLUMN "companyName" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "resetPasswordExpires" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "_EVToStation" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_EVToStation_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_EVToStation_B_index" ON "_EVToStation"("B");

-- AddForeignKey
ALTER TABLE "Station" ADD CONSTRAINT "Station_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EVToStation" ADD CONSTRAINT "_EVToStation_A_fkey" FOREIGN KEY ("A") REFERENCES "EV"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EVToStation" ADD CONSTRAINT "_EVToStation_B_fkey" FOREIGN KEY ("B") REFERENCES "Station"("id") ON DELETE CASCADE ON UPDATE CASCADE;
