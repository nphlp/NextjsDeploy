/*
  Warnings:

  - Added the required column `updatedAt` to the `Passkey` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Passkey" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "TwoFactor" ADD COLUMN     "verified" BOOLEAN NOT NULL DEFAULT true;
