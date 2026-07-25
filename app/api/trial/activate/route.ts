// POST /api/trial/activate · body { consent: true, paymentMethodDescriptor }
// 服务端二次校验 eligibility + 支付授权前提 (P0 · Demo 模式接受描述字符串)
// 生产:改为验证真实 provider 返回的 payment_method_id · 未验证不激活
import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { computeEligibility } from "@/lib/trial-offer/eligibility";
import { activate, getTrial } from "@/lib/trial-offer/repository";
import { createNotification } from "@/lib/notifications";
import { recordAudit } from "@/lib/cms/audit";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function isDemoAllowed(): boolean {
  if (process.env.NODE_ENV !== "production") return true;
  return process.env.PAYMENTS_ALLOW_MOCK === "true";
}

export async function POST(req: Request) {
  const s = getSession();
  if (!s) return NextResponse.json({ ok: false, code: "NOT_AUTHENTICATED" }, { status: 401 });

  let body: any;
  try { body = await req.json(); } catch { return NextResponse.json({ ok: false, message: "INVALID_JSON" }, { status: 400 }); }

  if (body?.consent !== true) return NextResponse.json({ ok: false, message: "必须同意订阅授权" }, { status: 400 });
  const descriptor = typeof body?.paymentMethodDescriptor === "string" ? body.paymentMethodDescriptor.slice(0, 80) : "";
  if (!descriptor) return NextResponse.json({ ok: false, message: "缺少支付方式描述" }, { status: 400 });

  // 生产环境未接真实 provider · 不允许激活 (要求真实付款授权)
  if (!isDemoAllowed()) {
    return NextResponse.json({ ok: false, message: "支付功能暂未开放 · 现阶段无法开通 24h 体验" }, { status: 503 });
  }

  const snap = computeEligibility(s.userId, true);
  if (!snap.eligible) {
    return NextResponse.json({ ok: false, message: "尚未满足 24h £0 体验的资格" }, { status: 409 });
  }

  const existing = getTrial(s.userId);
  if (existing && (existing.status === "active" || existing.status === "converted" || existing.status === "expired" || existing.status === "cancelled")) {
    return NextResponse.json({ ok: false, message: "此账号已使用过 24h 体验" }, { status: 409 });
  }

  const trial = activate(s.userId, { paymentMethodDescriptor: descriptor });

  createNotification({
    userId: s.userId,
    kind: "membership",
    title: "24 小时 £0 体验已开通 · 明日转 £29.99/月",
    body: "所有付费会员权益已即时生效 · 在到期前可随时取消,不会扣款。",
    href: "/me?section=membership",
  });
  recordAudit({
    actorId: s.userId, actorEmail: s.email,
    action: "create", targetType: "trial-offer", targetId: s.userId,
    summary: `24h £0 体验已激活 · descriptor=${descriptor}`,
  });

  return NextResponse.json({ ok: true, trial });
}
