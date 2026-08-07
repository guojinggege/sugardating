// POST /api/creator/apply-intent · Sugargirl 全球招募意向 · 无需登录
// 必填:nickname / city / status / ageConfirmed=true / contactConsent=true
// 联系方式 whatsapp / instagram / xHandle / otherContact 至少一项
// 生产环境:失败即错(不显示假成功)· 见 repository InterestPersistError
import { NextResponse } from "next/server";
import {
  createInterest, hashIp, recentSubmitCountByIpHash,
  InterestPersistError, type InterestStatus,
} from "@/lib/creator-interest/repository";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const STATUS_ALLOWED: InterestStatus[] = ["student", "employed", "freelancer"];
const SOURCE_ALLOWED = new Set([
  "inline_form", "header_apply", "hero_apply",
  "floating_primary", "floating_secondary",
  "onboarding_cta", "footer_apply", "mobile_menu_apply",
  "unknown",
]);
const LOCALE_ALLOWED = new Set(["zh", "en"]);

function trim(v: unknown, max: number): string {
  return String(v ?? "").trim().slice(0, max);
}
function nullIfEmpty(s: string): string | null {
  return s.length === 0 ? null : s;
}
function j(status: number, ok: boolean, extra: Record<string, unknown> = {}) {
  return NextResponse.json(ok ? { success: true, ...extra } : { success: false, ...extra }, { status });
}

export async function POST(req: Request) {
  let body: unknown;
  try { body = await req.json(); } catch { return j(400, false, { code: "INVALID_JSON" }); }
  const b = (body ?? {}) as Record<string, unknown>;

  // Honeypot: 隐藏 hp 字段被填 → 静默丢弃
  if (typeof b.hp === "string" && b.hp.trim().length > 0) {
    return j(200, true, { leadId: "hp_bot", createdAt: new Date().toISOString() });
  }

  const nickname       = trim(b.nickname, 30);
  const city           = trim(b.city, 60);
  const statusRaw      = trim(b.currentStatus ?? b.status, 20);
  const whatsapp       = nullIfEmpty(trim(b.whatsapp, 40));
  const instagram      = nullIfEmpty(trim(b.instagram, 160));
  const xHandle        = nullIfEmpty(trim(b.xHandle, 160));
  const otherContact   = nullIfEmpty(trim(b.otherContact, 160));
  const ageConfirmed   = b.ageConfirmed === true;
  const contactConsent = b.contactConsent === true;
  const localeRaw      = trim(b.locale, 8).toLowerCase();
  const sourceRaw      = trim(b.source, 24).toLowerCase();
  const pagePath       = nullIfEmpty(trim(b.pagePath, 500));
  const referrer       = nullIfEmpty(trim(b.referrer, 500));
  const utmSource      = nullIfEmpty(trim(b.utmSource, 120));
  const utmMedium      = nullIfEmpty(trim(b.utmMedium, 120));
  const utmCampaign    = nullIfEmpty(trim(b.utmCampaign, 120));
  const utmContent     = nullIfEmpty(trim(b.utmContent, 120));

  // ── 必填 ───────────────────────────
  if (nickname.length < 2)                              return j(400, false, { code: "INVALID_NICKNAME", field: "nickname" });
  if (city.length < 2)                                  return j(400, false, { code: "INVALID_CITY", field: "city" });
  if (!STATUS_ALLOWED.includes(statusRaw as InterestStatus))
                                                        return j(400, false, { code: "INVALID_STATUS", field: "currentStatus" });
  if (!ageConfirmed)                                    return j(400, false, { code: "AGE_NOT_CONFIRMED", field: "ageConfirmed" });
  if (!contactConsent)                                  return j(400, false, { code: "CONSENT_REQUIRED", field: "contactConsent" });

  // ── 联系方式 · 四选一必填 ─────────
  if (!whatsapp && !instagram && !xHandle && !otherContact) {
    return j(400, false, { code: "CONTACT_REQUIRED", field: "contact" });
  }

  // 电话字符净化
  const phoneClean = (v: string | null) =>
    v ? v.replace(/[^0-9+\s()\-]/g, "").trim() || null : null;

  // ── 反滥用 · 24h/IP 6 次 ─────────
  const xff = req.headers.get("x-forwarded-for") || "";
  const ip  = xff.split(",")[0].trim() || req.headers.get("x-real-ip") || "";
  const ipHash = hashIp(ip);
  if (ipHash) {
    const n = await recentSubmitCountByIpHash(ipHash);
    if (n >= 6) return j(429, false, { code: "TOO_MANY_SUBMISSIONS" });
  }

  const ua = trim(req.headers.get("user-agent") || "", 200);

  // 持久化 · 生产严格 Prisma
  try {
    const rec = await createInterest({
      nickname, city,
      status: statusRaw as InterestStatus,
      whatsapp: phoneClean(whatsapp),
      instagram,
      xHandle,
      otherContact,
      ageConfirmed, contactConsent,
      locale: LOCALE_ALLOWED.has(localeRaw) ? (localeRaw as "zh" | "en") : null,
      source: SOURCE_ALLOWED.has(sourceRaw) ? sourceRaw : "unknown",
      pagePath, referrer,
      utmSource, utmMedium, utmCampaign, utmContent,
      ipHash, userAgent: ua,
    });
    return j(200, true, { leadId: rec.id, createdAt: rec.createdAt.toISOString() });
  } catch (e: any) {
    if (e instanceof InterestPersistError) {
      console.error("[apply-intent] persist failed:", e.code);
      const status = e.code === "TABLE_MISSING" ? 503 : 500;
      return j(status, false, { code: e.code });
    }
    console.error("[apply-intent] persist failed:", e?.code || e?.name || "unknown");
    return j(500, false, { code: "DATABASE_INSERT_FAILED" });
  }
}
