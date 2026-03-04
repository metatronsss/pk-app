-- 手動套用 migration（若 prisma migrate 無法執行時使用）
-- 在 PostgreSQL 中執行：psql $DATABASE_URL -f scripts/apply-migration.sql

-- 若欄位已存在會報錯，可略過該行
ALTER TABLE "Goal" ADD COLUMN "refundEligibleAt" TIMESTAMP(3);
ALTER TABLE "ShopItem" ADD COLUMN "itemType" TEXT NOT NULL DEFAULT 'cosmetic';
ALTER TABLE "ShopItem" ADD COLUMN "effectValue" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "CoachProfile" ADD COLUMN "highestAffinityTierReached" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "CoachProfile" ADD COLUMN "equippedShopItemIds" TEXT NOT NULL DEFAULT '[]';
