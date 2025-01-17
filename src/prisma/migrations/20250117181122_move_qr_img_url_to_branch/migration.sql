/*
  Warnings:

  - You are about to drop the column `qrCode` on the `Product` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[barcode]` on the table `Product` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Product_qrCode_idx";

-- DropIndex
DROP INDEX "Product_qrCode_key";

-- AlterTable
ALTER TABLE "Branch" ADD COLUMN     "qrImageURL" TEXT;

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "qrCode",
ADD COLUMN     "barcode" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Product_barcode_key" ON "Product"("barcode");

-- CreateIndex
CREATE INDEX "Product_barcode_idx" ON "Product"("barcode");
