-- AlterEnum
ALTER TYPE "Resource" ADD VALUE 'ALL';

-- AlterTable
ALTER TABLE "Order" ALTER COLUMN "status" SET DEFAULT 'PENDING';
