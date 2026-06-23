-- CreateEnum
CREATE TYPE "DecisionAction" AS ENUM ('CONVERT_OPPORTUNITY', 'GENERATE_INTELLIGENCE', 'PREP_EVENT_DESIGN', 'ADJUST_AD_BUDGET', 'PAUSE_CAMPAIGN', 'CONTACT_SUPPLIER', 'GENERIC');

-- CreateEnum
CREATE TYPE "DecisionStatus" AS ENUM ('PENDING', 'APPLIED', 'DISMISSED');

-- CreateTable
CREATE TABLE "AIDecision" (
    "id" TEXT NOT NULL,
    "brandId" TEXT NOT NULL,
    "reportId" TEXT,
    "title" TEXT NOT NULL,
    "rationale" TEXT NOT NULL,
    "action" "DecisionAction" NOT NULL,
    "params" JSONB,
    "status" "DecisionStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AIDecision_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AIDecision_brandId_status_idx" ON "AIDecision"("brandId", "status");

-- AddForeignKey
ALTER TABLE "AIDecision" ADD CONSTRAINT "AIDecision_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand"("id") ON DELETE CASCADE ON UPDATE CASCADE;
