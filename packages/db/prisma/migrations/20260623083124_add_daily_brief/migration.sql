-- CreateTable
CREATE TABLE "DailyBrief" (
    "id" TEXT NOT NULL,
    "brandId" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "riskScore" INTEGER NOT NULL DEFAULT 0,
    "riskLevel" TEXT NOT NULL DEFAULT 'LOW',
    "riskSignals" JSONB NOT NULL DEFAULT '[]',
    "topOpportunity" TEXT,
    "topRisk" TEXT,
    "todayTasks" JSONB NOT NULL DEFAULT '[]',
    "narrative" TEXT,
    "confidence" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DailyBrief_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "DailyBrief_brandId_idx" ON "DailyBrief"("brandId");

-- CreateIndex
CREATE UNIQUE INDEX "DailyBrief_brandId_date_key" ON "DailyBrief"("brandId", "date");

-- AddForeignKey
ALTER TABLE "DailyBrief" ADD CONSTRAINT "DailyBrief_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand"("id") ON DELETE CASCADE ON UPDATE CASCADE;
