// Membership store · globalThis-backed in-memory · mock 不接真实支付
import { randomBytes } from "node:crypto";
import type { BillingPeriod, MembershipTier } from "./membership-plans";
import { getPlan } from "./membership-plans";
import { topUp } from "./wallet";

export interface MembershipRecord {
  userId: string;
  tier: MembershipTier;
  period?: BillingPeriod;
  startedAt: string;
  expiresAt?: string;
  autoRenew: boolean;
  currentPlanId?: string;
  cancelledAt?: string;
}

declare global {
  // eslint-disable-next-line no-var
  var __sgMemberships: Map<string, MembershipRecord> | undefined;
}
const store = globalThis.__sgMemberships ?? new Map<string, MembershipRecord>();
globalThis.__sgMemberships = store;

function periodDays(p: BillingPeriod): number {
  return p === "monthly" ? 30 : p === "quarterly" ? 90 : 365;
}

export function getMembership(userId: string): MembershipRecord {
  const existing = store.get(userId);
  if (existing) {
    // 到期自动降级 free
    if (existing.expiresAt && new Date(existing.expiresAt).getTime() < Date.now()) {
      const downgraded: MembershipRecord = { ...existing, tier: "free", autoRenew: false };
      store.set(userId, downgraded);
      return downgraded;
    }
    return existing;
  }
  return {
    userId,
    tier: "free",
    startedAt: new Date().toISOString(),
    autoRenew: false,
  };
}

export function subscribeMembership(
  userId: string,
  tier: "vip" | "svip",
  period: BillingPeriod,
): MembershipRecord {
  const plan = getPlan(tier, period);
  const now = new Date();
  const expires = new Date(now.getTime() + periodDays(period) * 86400_000);
  const rec: MembershipRecord = {
    userId,
    tier,
    period,
    currentPlanId: plan.id,
    startedAt: now.toISOString(),
    expiresAt: expires.toISOString(),
    autoRenew: true,
  };
  store.set(userId, rec);
  // 赠送 Credits (bonus 到钱包)
  if (plan.includedCredits > 0) {
    try { topUp(userId, plan.includedCredits, `${tier.toUpperCase()} 会员赠送`); } catch {}
  }
  return rec;
}

export function cancelMembership(userId: string): MembershipRecord {
  const cur = store.get(userId);
  if (!cur || cur.tier === "free") {
    return getMembership(userId);
  }
  const next: MembershipRecord = { ...cur, autoRenew: false, cancelledAt: new Date().toISOString() };
  store.set(userId, next);
  return next;
}
