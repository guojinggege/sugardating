// POST /api/membership/subscribe — mock subscribe · 按 planId · Demo 无真实支付
import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { subscribeByPlanId, canBuyIntro } from "@/lib/membership-store";
import { getPlanById } from "@/lib/membership-plans";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: Request) {
  const s = getSession();
  if (!s) return NextResponse.json({ ok: false, code: "NOT_AUTHENTICATED", message: "请先登录" }, { status: 401 });

  let body: any;
  try { body = await req.json(); } catch { return NextResponse.json({ ok: false, message: "INVALID_JSON" }, { status: 400 }); }

  const planId = typeof body?.planId === "string" ? body.planId : "";
  const plan = getPlanById(planId);
  if (!plan) return NextResponse.json({ ok: false, message: "无效的会员套餐" }, { status: 400 });

  // 首充体验二次拦截 · 前端已 gate · 后端兜底
  if (plan.isIntro && !canBuyIntro(s.userId)) {
    return NextResponse.json({ ok: false, message: "首充体验仅限每个账号购买一次" }, { status: 409 });
  }

  const result = subscribeByPlanId(s.userId, planId);
  if (!result.ok) return NextResponse.json({ ok: false, message: result.message }, { status: 400 });

  return NextResponse.json({
    ok: true,
    membership: result.record,
    plan: {
      id: plan.id,
      displayName: plan.displayName,
      price: plan.price,
      currency: plan.currency,
      period: plan.period,
      isIntro: !!plan.isIntro,
      autoRenew: plan.autoRenew,
    },
    demo: true,
  });
}
