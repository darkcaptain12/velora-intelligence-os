-- AlterEnum
ALTER TYPE "Provider" ADD VALUE 'PRINTIFY';

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "mockups" JSONB,
ADD COLUMN     "printifyProductId" TEXT,
ADD COLUMN     "printifyShopId" TEXT;
