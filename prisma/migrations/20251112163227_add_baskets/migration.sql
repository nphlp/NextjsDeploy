/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Fruit` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `Fruit` table without a default value. This is not possible if the table is not empty.
  - Made the column `description` on table `Fruit` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'VENDOR';

-- AlterTable
ALTER TABLE "Fruit" ADD COLUMN     "userId" TEXT NOT NULL,
ALTER COLUMN "description" SET NOT NULL;

-- CreateTable
CREATE TABLE "Basket" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Basket_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Quantity" (
    "id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "basketId" TEXT NOT NULL,
    "fruitId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Quantity_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Basket_userId_idx" ON "Basket"("userId");

-- CreateIndex
CREATE INDEX "Quantity_basketId_idx" ON "Quantity"("basketId");

-- CreateIndex
CREATE INDEX "Quantity_fruitId_idx" ON "Quantity"("fruitId");

-- CreateIndex
CREATE INDEX "Quantity_fruitId_basketId_idx" ON "Quantity"("fruitId", "basketId");

-- CreateIndex
CREATE UNIQUE INDEX "Quantity_basketId_fruitId_key" ON "Quantity"("basketId", "fruitId");

-- CreateIndex
CREATE UNIQUE INDEX "Fruit_name_key" ON "Fruit"("name");

-- CreateIndex
CREATE INDEX "Fruit_userId_idx" ON "Fruit"("userId");

-- AddForeignKey
ALTER TABLE "Fruit" ADD CONSTRAINT "Fruit_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Basket" ADD CONSTRAINT "Basket_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quantity" ADD CONSTRAINT "Quantity_basketId_fkey" FOREIGN KEY ("basketId") REFERENCES "Basket"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quantity" ADD CONSTRAINT "Quantity_fruitId_fkey" FOREIGN KEY ("fruitId") REFERENCES "Fruit"("id") ON DELETE CASCADE ON UPDATE CASCADE;
