-- CreateEnum
CREATE TYPE "OpportunityKind" AS ENUM ('TREND', 'PROBLEM', 'EVENT');

-- CreateEnum
CREATE TYPE "OpportunityStatus" AS ENUM ('NEW', 'SCORED', 'VALIDATED', 'REJECTED', 'PURSUED');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "Source" ADD VALUE 'TRENDYOL';
ALTER TYPE "Source" ADD VALUE 'HEPSIBURADA';
ALTER TYPE "Source" ADD VALUE 'SIKAYETVAR';
ALTER TYPE "Source" ADD VALUE 'INSTAGRAM';
ALTER TYPE "Source" ADD VALUE 'GOOGLE_TRENDS';

-- CreateTable
CREATE TABLE "Opportunity" (
    "id" TEXT NOT NULL,
    "brandId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "niche" TEXT NOT NULL,
    "kind" "OpportunityKind" NOT NULL DEFAULT 'TREND',
    "sourceSignals" JSONB,
    "opportunityScore" JSONB,
    "validationScore" INTEGER,
    "validationSignals" JSONB,
    "seasonalityScore" INTEGER,
    "priorityScore" INTEGER,
    "aiRationale" TEXT,
    "status" "OpportunityStatus" NOT NULL DEFAULT 'NEW',
    "eventDate" TIMESTAMP(3),
    "week" TEXT NOT NULL,
    "designId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Opportunity_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Opportunity_brandId_status_idx" ON "Opportunity"("brandId", "status");

-- CreateIndex
CREATE INDEX "Opportunity_brandId_priorityScore_idx" ON "Opportunity"("brandId", "priorityScore");

-- AddForeignKey
ALTER TABLE "Opportunity" ADD CONSTRAINT "Opportunity_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand"("id") ON DELETE CASCADE ON UPDATE CASCADE;
