/*
  Warnings:

  - You are about to drop the column `qrImageURL` on the `Branch` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Branch" DROP COLUMN "qrImageURL",
ADD COLUMN     "qrURL" TEXT;
