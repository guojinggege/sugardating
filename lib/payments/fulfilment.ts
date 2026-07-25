// 支付成功后的开通逻辑 · 幂等 · 只在 order.status === "paid" 且未 fulfilled 时执行
// 生产建议:抽出 fulfilledAt 或事务表 · P0 通过 order.handledEvents 已能保证不重
import { getOrder, updateOrder } from "./repository";
import { subscribeByPlanId } from "@/lib/membership-store";
import { topUp } from "@/lib/wallet";
import { getPlanById } from "@/lib/membership-plans";

export interface FulfilmentResult {
  ok: boolean;
  message?: string;
}

/**
 * 幂等地开通:paidAt 已存在 → 什么都不做
 * order.status 必须先被 webhook 置为 "paid" 才可调用
 */
export function fulfilOrder(orderId: string): FulfilmentResult {
  const o = getOrder(orderId);
  if (!o) return { ok: false, message: "订单不存在" };
  if (o.status !== "paid") return { ok: false, message: `订单状态 ${o.status} · 不可开通` };
  if (o.paidAt) return { ok: true };   // 已开通 · 幂等

  try {
    if (o.type === "membership" && o.membership) {
      subscribeByPlanId(o.userId, o.membership.planId);
    } else if (o.type === "credits" && o.credits) {
      topUp(o.userId, o.credits.creditAmount, `Checkout ${o.reference}`);
    }
    updateOrder(orderId, { paidAt: new Date().toISOString() });
    return { ok: true };
  } catch (e) {
    return { ok: false, message: e instanceof Error ? e.message : "fulfilment failed" };
  }
}

// ══════════════════════════════════════
// Server-side price lookup · client 无法篡改
// ══════════════════════════════════════

export function priceMembershipPlanPence(planId: string): { name: string; pence: number; periodDays: number; isIntro: boolean } | undefined {
  const plan = getPlanById(planId);
  if (!plan) return undefined;
  const periodDays = plan.period === "intro7d" ? 7 : plan.period === "monthly" ? 30 : plan.period === "quarterly" ? 90 : 365;
  return {
    name: plan.displayName,
    pence: Math.round(plan.price * 100),
    periodDays,
    isIntro: !!plan.isIntro,
  };
}

// Credits package prices · 与 Wallet API 一致 · P0 硬编码 (与 /lib/membership-plans 里 CREDIT_PACKAGES 呼应)
// 注意:CREDIT_PACKAGES 用 S$ · Checkout 只做 GBP · 这里给出 GBP 参考价 (与产品经理确认后调整)
export const CREDIT_PENCE: Record<string, { credits: number; pence: number; label: string }> = {
  starter: { credits: 100,  pence: 3500,  label: "100 Credits" },
  popular: { credits: 350,  pence: 9900,  label: "350 Credits" },
  pro:     { credits: 800,  pence: 19900, label: "800 Credits" },
  whale:   { credits: 1800, pence: 39900, label: "1,800 Credits" },
};

export function priceCreditsPackagePence(packageId: string): { name: string; pence: number; credits: number } | undefined {
  const p = CREDIT_PENCE[packageId];
  if (!p) return undefined;
  return { name: p.label, pence: p.pence, credits: p.credits };
}
