// POST /api/creator/apply-intent · Sugargirl 入驻意向收集 · 无需登录
// - nickname / city / status 必填
// - telephone / email / mobile 至少一项非空
// - 24h 内同 IP 最多 6 次 · 反滥用
// - 不写敏感字段到日志 / URL / analytics
import { NextResponse } from "next/server";
import { createInterest, hashIp, recentSubmitCountByIpHash, InterestPersistError, type InterestStatus } from "@/lib/creator-interest/repository";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const STATUS_ALLOWED: InterestStatus[] = ["student", "employed", "freelancer"];
const SOURCE_ALLOWED = ["hero", "inline", "sticky", "final", "unknown"];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function trim(v: unknown, max: number): string {
  return String(v ?? "").trim().slice(0, max);
}

function json(status: number, ok: boolean, extra: Record<string, unknown> = {}) {
  return NextResponse.json({ ok, ...extra }, { status });
}

export async function POST(req: Request) {
  let body: unknown;
  try { body = await req.json(); } catch { return json(400, false, { code: "INVALID_JSON" }); }
  const b = (body ?? {}) as Record<string, unknown>;

  const nickname = trim(b.nickname, 30);
  const city     = trim(b.city, 60);
  const statusRaw = trim(b.status, 20);
  const telephoneRaw = trim(b.telephone, 40);
  const emailRaw     = trim(b.email, 120).toLowerCase();
  const mobileRaw    = trim(b.mobile, 40);
  const localeRaw    = trim(b.locale, 8).toLowerCase();
  const sourceRaw    = trim(b.source, 16).toLowerCase();

  // ── 必填 ─────────────────────────
  if (nickname.length < 2) {
    return json(400, false, { code: "INVALID_NICKNAME", field: "nickname" });
  }
  if (city.length < 2) {
    return json(400, false, { code: "INVALID_CITY", field: "city" });
  }
  if (!STATUS_ALLOWED.includes(statusRaw as InterestStatus)) {
    return json(400, false, { code: "INVALID_STATUS", field: "status" });
  }

  // ── 联系方式联合校验 · 至少一项 ─
  const telephone = telephoneRaw || null;
  const email     = emailRaw || null;
  const mobile    = mobileRaw || null;
  if (!telephone && !email && !mobile) {
    return json(400, false, { code: "CONTACT_REQUIRED", field: "contact" });
  }

  // 邮箱格式(非空时)
  if (email && !EMAIL_RE.test(email)) {
    return json(400, false, { code: "INVALID_EMAIL", field: "email" });
  }
  // 电话 / 手机基础净化 · 只保留 + · 数字 · 空格 · 括号 · 短横线
  const phoneClean = (v: string | null) => v ? v.replace(/[^0-9+\s()\-]/g, "").trim() || null : null;
  const telClean = phoneClean(telephone);
  const mobClean = phoneClean(mobile);

  // ── 反滥用 · IP 24h 频次限流 ─────
  const xff = req.headers.get("x-forwarded-for") || "";
  const ip  = xff.split(",")[0].trim() || req.headers.get("x-real-ip") || "";
  const ipHash = hashIp(ip);
  if (ipHash) {
    const n = await recentSubmitCountByIpHash(ipHash);
    if (n >= 6) return json(429, false, { code: "TOO_MANY_SUBMISSIONS" });
  }

  const ua = trim(req.headers.get("user-agent") || "", 200);

  // 持久化 · 生产严格 Prisma · 失败即错(不能让用户看到假成功)
  let savedId: string;
  try {
    const rec = await createInterest({
      nickname,
      city,
      status: statusRaw as InterestStatus,
      telephone: telClean,
      email,
      mobile: mobClean,
      locale: (localeRaw === "zh" || localeRaw === "en") ? (localeRaw as "zh" | "en") : null,
      source: SOURCE_ALLOWED.includes(sourceRaw) ? sourceRaw : "unknown",
      ipHash,
      userAgent: ua,
    });
    savedId = rec.id;
  } catch (e: any) {
    // 不写 body / contact / IP 到日志
    if (e instanceof InterestPersistError) {
      console.error("[apply-intent] persist failed:", e.code);
      const status = e.code === "TABLE_MISSING" ? 503 : 500;
      return json(status, false, { code: e.code });
    }
    console.error("[apply-intent] persist failed:", e?.code || e?.name || "unknown");
    return json(500, false, { code: "PERSIST_FAILED" });
  }

  // 只有拿到真实数据库 ID 才回 ok · 前端才能显示成功
  return json(200, true, { id: savedId });
}
