// Checkout Order 存储 · globalThis · HMR-safe · P0 mock
// 生产接 Neon 时:实现相同 CRUD surface + 幂等表
import { randomBytes } from "node:crypto";
import type { CheckoutOrder, CheckoutOrderStatus } from "./types";

declare global {
  // eslint-disable-next-line no-var
  var __sgCheckoutOrders: Map<string, CheckoutOrder> | undefined;
  // eslint-disable-next-line no-var
  var __sgCheckoutRefCounter: { n: number } | undefined;
}

const store = globalThis.__sgCheckoutOrders ?? new Map<string, CheckoutOrder>();
globalThis.__sgCheckoutOrders = store;

const refCounter = globalThis.__sgCheckoutRefCounter ?? { n: 1000 };
globalThis.__sgCheckoutRefCounter = refCounter;

function nextRef(): string {
  refCounter.n += 1;
  const year = new Date().getUTCFullYear();
  return `SD-CHK-${year}-${String(refCounter.n).padStart(6, "0")}`;
}

// ══════════════════════════════════════
// Create · price MUST come from server-side config · never client
// ══════════════════════════════════════

export function createOrder(input: Omit<CheckoutOrder, "id" | "reference" | "status" | "createdAt" | "updatedAt" | "autoRenew" | "handledEvents"> & { autoRenew?: boolean }): CheckoutOrder {
  const now = new Date().toISOString();
  const id = `co_${randomBytes(5).toString("hex")}`;
  const order: CheckoutOrder = {
    ...input,
    id,
    reference: nextRef(),
    status: "created",
    autoRenew: !!input.autoRenew,
    handledEvents: [],
    createdAt: now,
    updatedAt: now,
    // 订单本身默认 30 分钟内选择支付方式 · 之后 expire
    expiresAt: input.expiresAt ?? new Date(Date.now() + 30 * 60_000).toISOString(),
  };
  store.set(id, order);
  return order;
}

export function getOrder(id: string): CheckoutOrder | undefined {
  const o = store.get(id);
  if (!o) return undefined;
  // 未支付且 expiresAt 过 → 自动 expire
  if (o.status === "created" || o.status === "awaiting_payment") {
    if (o.expiresAt && new Date(o.expiresAt).getTime() < Date.now()) {
      const next = { ...o, status: "expired" as CheckoutOrderStatus, updatedAt: new Date().toISOString() };
      store.set(id, next);
      return next;
    }
  }
  return o;
}

export function listOrdersForUser(userId: string): CheckoutOrder[] {
  return Array.from(store.values())
    .filter((o) => o.userId === userId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function updateOrder(id: string, patch: Partial<CheckoutOrder>): CheckoutOrder | undefined {
  const cur = store.get(id);
  if (!cur) return undefined;
  const next: CheckoutOrder = { ...cur, ...patch, updatedAt: new Date().toISOString() };
  store.set(id, next);
  return next;
}

/**
 * 幂等标记 · 已处理的 provider event id 记入 handledEvents · 二次 webhook 直接返回 already handled
 */
export function isEventHandled(orderId: string, eventId: string): boolean {
  const o = store.get(orderId);
  if (!o) return false;
  return (o.handledEvents ?? []).includes(eventId);
}

export function markEventHandled(orderId: string, eventId: string): void {
  const o = store.get(orderId);
  if (!o) return;
  const next: CheckoutOrder = {
    ...o,
    handledEvents: [...(o.handledEvents ?? []), eventId],
    updatedAt: new Date().toISOString(),
  };
  store.set(orderId, next);
}

/** 通过 providerOrderId 找订单 · webhook 场景使用 */
export function findByProviderOrderId(providerOrderId: string): CheckoutOrder | undefined {
  for (const o of store.values()) {
    if (o.providerOrderId === providerOrderId) return o;
  }
  return undefined;
}
