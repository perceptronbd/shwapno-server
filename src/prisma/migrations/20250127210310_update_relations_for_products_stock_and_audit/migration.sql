/*
  Warnings:

  - You are about to drop the column `logId` on the `Audit` table. All the data in the column will be lost.
  - You are about to drop the `BranchProduct` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Audit" DROP CONSTRAINT "Audit_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "BranchProduct" DROP CONSTRAINT "BranchProduct_branchId_fkey";

-- DropForeignKey
ALTER TABLE "BranchProduct" DROP CONSTRAINT "BranchProduct_productId_fkey";

-- AlterTable
ALTER TABLE "Audit" DROP COLUMN "logId";

-- AlterTable
ALTER TABLE "Company" ADD COLUMN     "imgURL" TEXT;

-- DropTable
DROP TABLE "BranchProduct";
