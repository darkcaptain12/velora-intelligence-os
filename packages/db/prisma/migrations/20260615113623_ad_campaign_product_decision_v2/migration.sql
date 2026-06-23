-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "DecisionAction" ADD VALUE 'EXIT_NICHE';
ALTER TYPE "DecisionAction" ADD VALUE 'APPLY_SUPPLIER_COST';
ALTER TYPE "DecisionAction" ADD VALUE 'CREATE_AD_DRAFT';

-- AlterTable
ALTER TABLE "AdCampaign" ADD COLUMN     "productId" TEXT;

-- CreateIndex
CREATE INDEX "AdCampaign_productId_idx" ON "AdCampaign"("productId");

-- AddForeignKey
ALTER TABLE "AdCampaign" ADD CONSTRAINT "AdCampaign_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;
