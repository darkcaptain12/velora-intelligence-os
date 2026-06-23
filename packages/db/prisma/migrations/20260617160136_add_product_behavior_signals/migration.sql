-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "cartAdds" INTEGER DEFAULT 0,
ADD COLUMN     "pageViews" INTEGER DEFAULT 0,
ADD COLUMN     "wishlistAdds" INTEGER DEFAULT 0;
