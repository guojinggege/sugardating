// Trial store · globalThis · P0 mock
import type { TrialRecord, TrialStatus } from "./types";

declare global {
  // eslint-disable-next-line no-var
  var __sgTrialOffers: Map<string, TrialRecord> | undefined;
}
const store = globalThis.__sgTrialOffers ?? new Map<string, TrialRecord>();
globalThis.__sgTrialOffers = store;

export function getTrial(userId: string): TrialRecord | undefined {
  const t = store.get(userId);
  if (!t) return undefined;
  // 自动过期 · active 到期未 cancel/convert → expired
  if (t.status === "active" && t.endsAt && new Date(t.endsAt).getTime() < Date.now()) {
    const next: TrialRecord = { ...t, status: "expired" };
    store.set(userId, next);
    return next;
  }
  return t;
}

/** 用户领取时创建 · consent_pending 状态 */
export function initConsent(userId: string): TrialRecord {
  const now = new Date().toISOString();
  const record: TrialRecord = {
    userId,
    status: "consent_pending",
    createdAt: now,
    scheduledPlanId: "paid_monthly",
  };
  store.set(userId, record);
  return record;
}

/** 用户完成支付授权后 · 激活 24h 体验 */
export function activate(userId: string, consent: { paymentMethodDescriptor: string }): TrialRecord {
  const now = Date.now();
  const record: TrialRecord = {
    userId,
    status: "active",
    createdAt: new Date(now).toISOString(),
    startedAt: new Date(now).toISOString(),
    endsAt: new Date(now + 24 * 3600_000).toISOString(),
    scheduledPlanId: "paid_monthly",
    consent: { at: new Date(now).toISOString(), paymentMethodDescriptor: consent.paymentMethodDescriptor },
  };
  store.set(userId, record);
  return record;
}

export function cancel(userId: string): TrialRecord | undefined {
  const t = store.get(userId);
  if (!t) return undefined;
  if (t.status !== "active" && t.status !== "consent_pending") return t;
  const next: TrialRecord = { ...t, status: "cancelled", cancelledAt: new Date().toISOString() };
  store.set(userId, next);
  return next;
}

/** 体验到期 + 用户未取消 → 转正月度会员 (调用方需要触发 subscribeByPlanId) */
export function markConverted(userId: string): TrialRecord | undefined {
  const t = store.get(userId);
  if (!t) return undefined;
  const next: TrialRecord = { ...t, status: "converted", convertedAt: new Date().toISOString() };
  store.set(userId, next);
  return next;
}

export function setStatus(userId: string, status: TrialStatus): TrialRecord | undefined {
  const t = store.get(userId);
  if (!t) return undefined;
  const next: TrialRecord = { ...t, status };
  store.set(userId, next);
  return next;
}

// Admin 测试:清空 / 强设 · 便于验收
export function resetForTesting(userId: string): void { store.delete(userId); }
