-- AlterTable
ALTER TABLE "Supplier" ADD COLUMN     "costCurrency" TEXT,
ADD COLUMN     "moq" INTEGER,
ADD COLUMN     "unitCost" DECIMAL(12,2);
