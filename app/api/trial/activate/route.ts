// POST /api/trial/activate · body { consent: true, paymentMethodDescriptor }
// 服务端二次校验 eligibility + 支付授权前提
// 生产 · 无真实周期扣款授权 · 只能进入 payment_mandate_required · 不激活权益
// Dev / Preview + TRIAL_DEMO_MODE=true · 允许真实激活 24h 体验 (无扣款 · 无订单)
import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { computeEligibility } from "@/lib/trial-offer/eligibility";
import { activate, getTrial, markMandateRequired } from "@/lib/trial-offer/repository";
import { createNotification } from "@/lib/notifications";
import { recordAudit } from "@/lib/cms/audit";
import { isTrialDemoEnabled, isProduction } from "@/lib/trial-offer/demo-mode";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: Request) {
  const s = getSession();
  if (!s) return NextResponse.json({ ok: false, code: "NOT_AUTHENTICATED" }, { status: 401 });

  let body: any;
  try { body = await req.json(); } catch { return NextResponse.json({ ok: false, message: "INVALID_JSON" }, { status: 400 }); }

  if (body?.consent !== true) return NextResponse.json({ ok: false, message: "必须同意订阅授权" }, { status: 400 });
  const descriptor = typeof body?.paymentMethodDescriptor === "string" ? body.paymentMethodDescriptor.slice(0, 80) : "";
  if (!descriptor) return NextResponse.json({ ok: false, message: "缺少支付方式描述" }, { status: 400 });

  const snap = computeEligibility(s.userId, true);
  if (!snap.eligible) {
    return NextResponse.json({ ok: false, message: "尚未满足 24h £0 体验的资格" }, { status: 409 });
  }

  const existing = getTrial(s.userId);
  if (existing && (existing.status === "active" || existing.status === "converted" || existing.status === "expired" || existing.status === "cancelled")) {
    return NextResponse.json({ ok: false, message: "此账号已使用过 24h 体验" }, { status: 409 });
  }

  // 生产 · 无真实周期扣款授权 · 只能进入 payment_mandate_required
  if (isProduction() || !isTrialDemoEnabled()) {
    const trial = markMandateRequired(s.userId);
    return NextResponse.json({
      ok: false,
      code: "PAYMENT_MANDATE_REQUIRED",
      message: "自动续费付款授权尚未开放,体验暂未开始",
      trial,
    }, { status: 409 });
  }

  // Dev / Preview + TRIAL_DEMO_MODE · 真实激活 24h 体验 (无订单 · 无扣款)
  const trial = activate(s.userId, { paymentMethodDescriptor: descriptor });

  createNotification({
    userId: s.userId,
    kind: "membership",
    title: "测试模式 · 24 小时体验已开通",
    body: "所有付费会员权益已即时生效 · 不会产生任何扣款 · 到期后恢复基础会员。正式接入周期支付后才会按 £29.99/月 续订。",
    href: "/me?section=membership",
  });
  recordAudit({
    actorId: s.userId, actorEmail: s.email,
    action: "create", targetType: "trial-offer", targetId: s.userId,
    summary: `Trial · Demo mode · descriptor=${descriptor}`,
  });

  return NextResponse.json({ ok: true, trial, demoMode: true });
}
