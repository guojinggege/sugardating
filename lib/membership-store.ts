// Membership store · globalThis-backed in-memory · mock 不接真实支付
// 支持:planId 订阅 · verificationStatus 独立字段 · legacy tier 迁移读侧兼容
import type {
  BillingPeriod, LegacyTier, MembershipPlan, MembershipTier, VerificationStatus,
} from "./membership-plans";
import { getPlanById, mapLegacyTier, periodDays } from "./membership-plans";
import { topUp } from "./wallet";

export interface MembershipRecord {
  userId: string;
  tier: MembershipTier;                   // 新体系:basic | paid
  period?: BillingPeriod;
  startedAt: string;
  expiresAt?: string;
  autoRenew: boolean;
  currentPlanId?: string;
  cancelledAt?: string;
  hasUsedIntro?: boolean;                 // 首充体验只能用一次
  verificationStatus: VerificationStatus;
}

/** 旧记录格式 · 用于读侧迁移 */
interface LegacyMembershipRecord {
  userId: string;
  tier: LegacyTier | MembershipTier;
  period?: BillingPeriod | "monthly" | "quarterly" | "yearly";
  startedAt: string;
  expiresAt?: string;
  autoRenew?: boolean;
  currentPlanId?: string;
  cancelledAt?: string;
  hasUsedIntro?: boolean;
  verificationStatus?: VerificationStatus;
}

declare global {
  // eslint-disable-next-line no-var
  var __sgMemberships: Map<string, LegacyMembershipRecord> | undefined;
}
const store = globalThis.__sgMemberships ?? new Map<string, LegacyMembershipRecord>();
globalThis.__sgMemberships = store;

// ══════════════════════════════════════
// 读侧统一迁移 · 保留剩余有效期 · 不缩短
// ══════════════════════════════════════

function normalize(existing: LegacyMembershipRecord): MembershipRecord {
  const tier = mapLegacyTier(existing.tier);
  return {
    userId: existing.userId,
    tier,
    period: existing.period as BillingPeriod | undefined,
    startedAt: existing.startedAt,
    expiresAt: existing.expiresAt,
    autoRenew: !!existing.autoRenew,
    currentPlanId: existing.currentPlanId,
    cancelledAt: existing.cancelledAt,
    hasUsedIntro: !!existing.hasUsedIntro,
    verificationStatus: existing.verificationStatus ?? "unverified",
  };
}

// ══════════════════════════════════════
// Query
// ══════════════════════════════════════

export function getMembership(userId: string): MembershipRecord {
  const existing = store.get(userId);
  if (existing) {
    const norm = normalize(existing);
    // 到期自动降级 basic (verificationStatus 保留)
    if (norm.expiresAt && new Date(norm.expiresAt).getTime() < Date.now()) {
      const downgraded: MembershipRecord = {
        ...norm,
        tier: "basic",
        period: undefined,
        currentPlanId: undefined,
        autoRenew: false,
      };
      store.set(userId, downgraded);
      return downgraded;
    }
    return norm;
  }
  return {
    userId,
    tier: "basic",
    startedAt: new Date().toISOString(),
    autoRenew: false,
    verificationStatus: "unverified",
  };
}

/** 判断当前账户是否可购买首充体验 · 前后端共用规则 */
export function canBuyIntro(userId: string): boolean {
  const cur = store.get(userId);
  if (!cur) return true;
  return !cur.hasUsedIntro;
}

// ══════════════════════════════════════
// Mutations
// ══════════════════════════════════════

export function subscribeByPlanId(userId: string, planId: string): {
  ok: boolean;
  message?: string;
  record?: MembershipRecord;
  plan?: MembershipPlan;
} {
  const plan = getPlanById(planId);
  if (!plan) return { ok: false, message: "无效的会员套餐" };

  const cur = store.get(userId);
  if (plan.isIntro && cur?.hasUsedIntro) {
    return { ok: false, message: "首充体验仅限每个账号购买一次 · 请选择其它套餐" };
  }

  const now = new Date();
  const currentExpiry = cur?.expiresAt ? new Date(cur.expiresAt) : null;
  // 未到期续订 → 累加剩余时间 · 已到期 → 从现在算
  const base = currentExpiry && currentExpiry > now ? currentExpiry : now;
  const expires = new Date(base.getTime() + periodDays(plan.period) * 86400_000);

  const next: MembershipRecord = {
    userId,
    tier: "paid",
    period: plan.period,
    currentPlanId: plan.id,
    startedAt: now.toISOString(),
    expiresAt: expires.toISOString(),
    autoRenew: plan.autoRenew,
    hasUsedIntro: cur?.hasUsedIntro || plan.isIntro,
    verificationStatus: cur?.verificationStatus ?? "unverified",
  };
  store.set(userId, next);

  // Demo · paid 套餐不再赠送 Credits (可按需保留)
  // 保持向后兼容:如果历史 VIP 逻辑赠送 Credits,这里默认不再赠送
  void topUp;

  return { ok: true, record: next, plan };
}

export function cancelMembership(userId: string): MembershipRecord {
  const cur = store.get(userId);
  if (!cur) return getMembership(userId);
  const norm = normalize(cur);
  if (norm.tier === "basic") return norm;
  const next: MembershipRecord = { ...norm, autoRenew: false, cancelledAt: new Date().toISOString() };
  store.set(userId, next);
  return next;
}

// ══════════════════════════════════════
// Verification (KYC) · 独立字段
// ══════════════════════════════════════

export function setVerification(userId: string, status: VerificationStatus): MembershipRecord {
  const cur = normalize(store.get(userId) ?? {
    userId, tier: "basic", startedAt: new Date().toISOString(), autoRenew: false,
  });
  const next: MembershipRecord = { ...cur, verificationStatus: status };
  store.set(userId, next);
  return next;
}
