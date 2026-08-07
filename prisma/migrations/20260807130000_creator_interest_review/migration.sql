-- 若上一版 20260807120000_add_creator_interest 已经跑过 (无 review 列)
-- 这一版补上审核字段 · 幂等 · IF NOT EXISTS
ALTER TABLE "CreatorInterest" ADD COLUMN IF NOT EXISTS "reviewStatus" TEXT NOT NULL DEFAULT 'submitted';
ALTER TABLE "CreatorInterest" ADD COLUMN IF NOT EXISTS "reviewNotes"  TEXT;
ALTER TABLE "CreatorInterest" ADD COLUMN IF NOT EXISTS "reviewedAt"   TIMESTAMP(3);
ALTER TABLE "CreatorInterest" ADD COLUMN IF NOT EXISTS "reviewedBy"   TEXT;

-- 替换旧索引
DROP INDEX IF EXISTS "CreatorInterest_status_createdAt_idx";
CREATE INDEX IF NOT EXISTS "CreatorInterest_reviewStatus_createdAt_idx" ON "CreatorInterest"("reviewStatus", "createdAt");
