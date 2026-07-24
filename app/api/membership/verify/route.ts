// POST /api/membership/verify — Demo · KYC mock
// 生产环境应替换为真实身份认证接口
// P0 · 直接标记为 verified · 让用户可立刻看到「认证会员」效果
import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { setVerification, getMembership } from "@/lib/membership-store";
import type { VerificationStatus } from "@/lib/membership-plans";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const VALID: VerificationStatus[] = ["unverified", "pending", "verified"];

export async function POST(req: Request) {
  const s = getSession();
  if (!s) return NextResponse.json({ ok: false, code: "NOT_AUTHENTICATED", message: "请先登录" }, { status: 401 });

  let body: any;
  try { body = await req.json().catch(() => ({})); } catch { body = {}; }

  const requested = typeof body?.status === "string" ? body.status : "verified";
  const status: VerificationStatus = VALID.includes(requested) ? requested : "verified";

  const record = setVerification(s.userId, status);
  return NextResponse.json({
    ok: true,
    membership: record,
    demo: true,
    note: "Demo mode · 生产接入 KYC 后由第三方回调 setVerification",
  });
}

export async function GET() {
  const s = getSession();
  if (!s) return NextResponse.json({ ok: false }, { status: 401 });
  const record = getMembership(s.userId);
  return NextResponse.json({ ok: true, verificationStatus: record.verificationStatus });
}
