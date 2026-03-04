-- AlterTable
ALTER TABLE "Goal" ADD COLUMN "refundEligibleAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "ShopItem" ADD COLUMN "itemType" TEXT NOT NULL DEFAULT 'cosmetic';
ALTER TABLE "ShopItem" ADD COLUMN "effectValue" INTEGER NOT NULL DEFAULT 0;
