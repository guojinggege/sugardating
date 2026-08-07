-- 全球招募计划新联系方式 + 合规确认 + UTM 归因
-- 幂等 · IF NOT EXISTS · 兼容任意起点 DB

-- 新联系方式(替换 telephone/email/mobile · 保留旧列不删)
ALTER TABLE "CreatorInterest" ADD COLUMN IF NOT EXISTS "whatsapp"       TEXT;
ALTER TABLE "CreatorInterest" ADD COLUMN IF NOT EXISTS "instagram"      TEXT;
ALTER TABLE "CreatorInterest" ADD COLUMN IF NOT EXISTS "x_handle"       TEXT;
ALTER TABLE "CreatorInterest" ADD COLUMN IF NOT EXISTS "other_contact"  TEXT;

-- 合规
ALTER TABLE "CreatorInterest" ADD COLUMN IF NOT EXISTS "ageConfirmed"   BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "CreatorInterest" ADD COLUMN IF NOT EXISTS "contactConsent" BOOLEAN NOT NULL DEFAULT false;

-- 来源与归因
ALTER TABLE "CreatorInterest" ADD COLUMN IF NOT EXISTS "page_path"      TEXT;
ALTER TABLE "CreatorInterest" ADD COLUMN IF NOT EXISTS "referrer"       TEXT;
ALTER TABLE "CreatorInterest" ADD COLUMN IF NOT EXISTS "utm_source"     TEXT;
ALTER TABLE "CreatorInterest" ADD COLUMN IF NOT EXISTS "utm_medium"     TEXT;
ALTER TABLE "CreatorInterest" ADD COLUMN IF NOT EXISTS "utm_campaign"   TEXT;
ALTER TABLE "CreatorInterest" ADD COLUMN IF NOT EXISTS "utm_content"    TEXT;

-- 更新时间
ALTER TABLE "CreatorInterest" ADD COLUMN IF NOT EXISTS "updatedAt"      TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
