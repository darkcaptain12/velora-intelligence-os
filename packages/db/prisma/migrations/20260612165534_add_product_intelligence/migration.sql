-- CreateTable
CREATE TABLE "ProductIntelligence" (
    "id" TEXT NOT NULL,
    "brandId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "status" "AssetStatus" NOT NULL DEFAULT 'GENERATING',
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "seoKeywords" JSONB,
    "handle" TEXT,
    "description" TEXT,
    "shortDescription" TEXT,
    "story" TEXT,
    "faq" JSONB,
    "ads" JSONB,
    "salesAngles" JSONB,
    "audience" JSONB,
    "ugc" JSONB,
    "score" JSONB,
    "scoreTotal" INTEGER,
    "aiRationale" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductIntelligence_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProductIntelligence_productId_key" ON "ProductIntelligence"("productId");

-- CreateIndex
CREATE INDEX "ProductIntelligence_brandId_scoreTotal_idx" ON "ProductIntelligence"("brandId", "scoreTotal");

-- AddForeignKey
ALTER TABLE "ProductIntelligence" ADD CONSTRAINT "ProductIntelligence_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductIntelligence" ADD CONSTRAINT "ProductIntelligence_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
