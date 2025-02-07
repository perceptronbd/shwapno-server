/*
  Warnings:

  - A unique constraint covering the columns `[sessionId]` on the table `ShoppingCart` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `sessionId` to the `ShoppingCart` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ShoppingCart" DROP CONSTRAINT "ShoppingCart_customerId_fkey";

-- AlterTable
ALTER TABLE "ShoppingCart" ADD COLUMN     "sessionId" TEXT NOT NULL,
ALTER COLUMN "customerId" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "ShoppingCart_sessionId_key" ON "ShoppingCart"("sessionId");

-- CreateIndex
CREATE INDEX "ShoppingCart_customerId_idx" ON "ShoppingCart"("customerId");

-- AddForeignKey
ALTER TABLE "ShoppingCart" ADD CONSTRAINT "ShoppingCart_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE SET NULL ON UPDATE CASCADE;
