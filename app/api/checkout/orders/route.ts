// POST /api/checkout/orders · 创建统一订单 (会员 or Credits)
// 关键:价格 · 名称 · 期间 全部服务端查 · 不信任 client
import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { createOrder } from "@/lib/payments/repository";
import { priceMembershipPlanPence, priceCreditsPackagePence } from "@/lib/payments/fulfilment";
import { canBuyIntro } from "@/lib/membership-store";
import { getPlanById } from "@/lib/membership-plans";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: Request) {
  const s = getSession();
  if (!s) return NextResponse.json({ ok: false, code: "NOT_AUTHENTICATED", message: "请先登录" }, { status: 401 });

  let body: any;
  try { body = await req.json(); } catch { return NextResponse.json({ ok: false, message: "INVALID_JSON" }, { status: 400 }); }

  const type = body?.type;
  const productId = typeof body?.productId === "string" ? body.productId : "";

  if (type === "membership") {
    const price = priceMembershipPlanPence(productId);
    if (!price) return NextResponse.json({ ok: false, message: "无效的会员套餐" }, { status: 400 });
    const plan = getPlanById(productId)!;
    if (plan.isIntro && !canBuyIntro(s.userId)) {
      return NextResponse.json({ ok: false, message: "首充体验仅限每个账号购买一次" }, { status: 409 });
    }
    const order = createOrder({
      userId: s.userId,
      type: "membership",
      productId,
      productName: price.name,
      amount: price.pence,
      displayAmount: price.pence / 100,
      currency: "GBP",
      autoRenew: plan.autoRenew,
      membership: {
        planId: productId,
        periodDays: price.periodDays,
        isIntro: price.isIntro,
      },
    });
    return NextResponse.json({ ok: true, order });
  }

  if (type === "credits") {
    const price = priceCreditsPackagePence(productId);
    if (!price) return NextResponse.json({ ok: false, message: "无效的 Credits 套餐" }, { status: 400 });
    const order = createOrder({
      userId: s.userId,
      type: "credits",
      productId,
      productName: price.name,
      amount: price.pence,
      displayAmount: price.pence / 100,
      currency: "GBP",
      autoRenew: false,
      credits: {
        packageId: productId,
        creditAmount: price.credits,
      },
    });
    return NextResponse.json({ ok: true, order });
  }

  return NextResponse.json({ ok: false, message: "type 必须是 membership 或 credits" }, { status: 400 });
}
