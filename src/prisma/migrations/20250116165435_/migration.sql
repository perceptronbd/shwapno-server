/*
  Warnings:

  - You are about to drop the column `name` on the `Permission` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[action,resource]` on the table `Permission` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `action` to the `Permission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `resource` to the `Permission` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Action" AS ENUM ('ALL', 'READ', 'WRITE');

-- CreateEnum
CREATE TYPE "Resource" AS ENUM ('USER', 'COMPANY', 'BRANCH', 'PRODUCT', 'ORDER', 'STOCK', 'INVOICE', 'SALES', 'CUSTOMER');

-- DropIndex
DROP INDEX "Permission_name_key";

-- AlterTable
ALTER TABLE "Permission" DROP COLUMN "name",
ADD COLUMN     "action" "Action" NOT NULL,
ADD COLUMN     "resource" "Resource" NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Permission_action_resource_key" ON "Permission"("action", "resource");
