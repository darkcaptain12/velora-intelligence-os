-- CreateTable
CREATE TABLE "ProductConversion" (
    "id" TEXT NOT NULL,
    "brandId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "week" TEXT NOT NULL,
    "pageViews" INTEGER NOT NULL DEFAULT 0,
    "cartAdds" INTEGER NOT NULL DEFAULT 0,
    "wishlistAdds" INTEGER NOT NULL DEFAULT 0,
    "behaviorScore" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductConversion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ProductConversion_brandId_week_idx" ON "ProductConversion"("brandId", "week");

-- CreateIndex
CREATE UNIQUE INDEX "ProductConversion_productId_week_key" ON "ProductConversion"("productId", "week");

-- AddForeignKey
ALTER TABLE "ProductConversion" ADD CONSTRAINT "ProductConversion_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductConversion" ADD CONSTRAINT "ProductConversion_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
