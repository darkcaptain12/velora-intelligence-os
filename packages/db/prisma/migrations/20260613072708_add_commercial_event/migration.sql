-- CreateEnum
CREATE TYPE "EventCategory" AS ENUM ('SPOR', 'ALISVERIS', 'KUTLAMA', 'MEVSIM');

-- CreateTable
CREATE TABLE "CommercialEvent" (
    "id" TEXT NOT NULL,
    "brandId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" "EventCategory" NOT NULL,
    "eventDate" TIMESTAMP(3) NOT NULL,
    "prepLeadDays" INTEGER NOT NULL,
    "trendPotential" INTEGER NOT NULL,
    "salesPotential" INTEGER NOT NULL,
    "eventScore" JSONB,
    "linkedOpportunityId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CommercialEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CommercialEvent_brandId_eventDate_idx" ON "CommercialEvent"("brandId", "eventDate");

-- CreateIndex
CREATE UNIQUE INDEX "CommercialEvent_brandId_name_eventDate_key" ON "CommercialEvent"("brandId", "name", "eventDate");

-- AddForeignKey
ALTER TABLE "CommercialEvent" ADD CONSTRAINT "CommercialEvent_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand"("id") ON DELETE CASCADE ON UPDATE CASCADE;
