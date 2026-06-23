-- AlterTable
ALTER TABLE "AIDecision" ADD COLUMN     "confidence" INTEGER,
ADD COLUMN     "expectedImpact" TEXT,
ADD COLUMN     "riskLevel" TEXT;
