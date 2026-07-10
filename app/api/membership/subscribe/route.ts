// POST /api/membership/subscribe — mock subscribe · 不接真实支付
import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { subscribeMembership } from "@/lib/membership-store";
import { getPlan } from "@/lib/membership-plans";
import type { BillingPeriod } from "@/lib/membership-plans";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const OK_TIERS = ["vip", "svip"] as const;
const OK_PERIODS: BillingPeriod[] = ["monthly", "quarterly", "yearly"];

export async function POST(req: Request) {
  const s = getSession();
  if (!s) return NextResponse.json({ ok: false, code: "NOT_AUTHENTICATED", message: "请先登录" }, { status: 401 });

  let body: any;
  try { body = await req.json(); } catch { return NextResponse.json({ ok: false, message: "INVALID_JSON" }, { status: 400 }); }

  const tier = body?.tier;
  const period = body?.period;
  if (!OK_TIERS.includes(tier)) {
    return NextResponse.json({ ok: false, message: "无效会员等级" }, { status: 400 });
  }
  if (!OK_PERIODS.includes(period)) {
    return NextResponse.json({ ok: false, message: "无效周期" }, { status: 400 });
  }

  const plan = getPlan(tier, period);
  const membership = subscribeMembership(s.userId, tier, period);
  return NextResponse.json({
    ok: true,
    membership,
    plan: { id: plan.id, price: plan.price, currency: plan.currency, includedCredits: plan.includedCredits },
    demo: true,
  });
}
