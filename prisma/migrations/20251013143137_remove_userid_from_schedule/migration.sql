/*
  Warnings:

  - You are about to drop the column `employeeId` on the `Schedule` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Schedule" DROP CONSTRAINT "Schedule_employeeId_fkey";

-- DropIndex
DROP INDEX "public"."Schedule_employeeId_endDate_idx";

-- DropIndex
DROP INDEX "public"."Schedule_employeeId_startDate_idx";

-- AlterTable
ALTER TABLE "Schedule" DROP COLUMN "employeeId";

-- CreateIndex
CREATE INDEX "Schedule_contractId_startDate_idx" ON "Schedule"("contractId", "startDate");

-- CreateIndex
CREATE INDEX "Schedule_contractId_endDate_idx" ON "Schedule"("contractId", "endDate");
