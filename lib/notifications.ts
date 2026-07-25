// 通知中心 · in-memory · globalThis · HMR-safe
// P0 · seed 数据 + list / markRead · 未来接真实事件
import { randomBytes } from "node:crypto";

export type NotificationKind =
  | "follow"           // 新粉丝
  | "tip"              // 打赏
  | "credit"           // Credits 变化
  | "safety"           // 安全反馈
  | "review"           // 内容/申请审核
  | "membership"       // 会员到期/续费
  | "verify"           // 身份认证
  | "system";          // 系统公告

export interface Notification {
  id: string;
  userId: string;              // 归属用户
  kind: NotificationKind;
  title: string;
  body?: string;
  href?: string;               // 点击跳转
  actorName?: string;
  actorAvatar?: string;
  read: boolean;
  createdAt: string;
}

declare global {
  // eslint-disable-next-line no-var
  var __sgNotifications: Notification[] | undefined;
}

const store = globalThis.__sgNotifications ?? seed();
globalThis.__sgNotifications = store;

// ══════════════════════════════════════
// Seed · 8 条示例 · 归属所有登录用户 (userId = "*")
// ══════════════════════════════════════

function seed(): Notification[] {
  const now = Date.now();
  const ago = (h: number) => new Date(now - h * 3600_000).toISOString();
  const mk = (
    id: string, kind: NotificationKind, title: string,
    opts: Partial<Notification> = {},
  ): Notification => ({
    id, userId: "*", kind, title, read: false, createdAt: ago(1),
    ...opts,
  });
  return [
    mk("n_seed01", "follow",     "Aria M. 关注了你",
      { actorName: "Aria M.", href: "/creators/aria", createdAt: ago(0.5) }),
    mk("n_seed02", "tip",        "Yuki 收到你 88 Credits 打赏 · 已回礼一张私密照",
      { actorName: "Yuki", href: "/creators/yuki", createdAt: ago(2) }),
    mk("n_seed03", "membership", "付费会员剩余 3 天到期 · 续费享季度价 £69.99",
      { href: "/membership", createdAt: ago(4) }),
    mk("n_seed04", "verify",     "身份认证已完成 · 你已升级为认证会员",
      { href: "/me?section=security", createdAt: ago(8), read: true }),
    mk("n_seed05", "credit",     "钱包已充值 +350 Credits (Demo)",
      { href: "/me?section=wallet", createdAt: ago(20), read: true }),
    mk("n_seed06", "safety",     "你的举报 SD-2026-000101 · 已进入处理中",
      { href: "/me/reports", createdAt: ago(30), read: true }),
    mk("n_seed07", "review",     "你的创作者入驻申请审核通过",
      { href: "/me", createdAt: ago(48), read: true }),
    mk("n_seed08", "system",     "社区规则更新 · 补充线下会面前置视频验证条款",
      { href: "/community/safety", createdAt: ago(72), read: true }),
  ];
}

// ══════════════════════════════════════
// Query
// ══════════════════════════════════════

/** 归属:userId === "*" (广播) 或 userId === current · 用户级 fork 覆盖广播 read */
function effectiveList(userId: string): Notification[] {
  const forks = new Map<string, Notification>();  // originalId → 用户 fork
  for (const n of store) {
    if (n.id.startsWith(`${userId}::`)) {
      const originalId = n.id.slice(userId.length + 2);
      forks.set(originalId, n);
    }
  }
  return store
    .filter((n) => !n.id.startsWith(`${userId}::`))       // 排除 fork · 只保留原始记录
    .filter((n) => n.userId === userId || n.userId === "*")
    .map((n) => forks.has(n.id) ? { ...n, read: true } : n);   // 用 fork 的 read 覆盖
}

export function listNotifications(userId: string): Notification[] {
  return effectiveList(userId).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function countUnread(userId: string): number {
  return effectiveList(userId).filter((n) => !n.read).length;
}

// ══════════════════════════════════════
// Mutations
// ══════════════════════════════════════

/** 用户读单条 · 广播通知会 fork 一份用户级 read 记录 */
export function markRead(userId: string, id: string): void {
  const n = store.find((x) => x.id === id);
  if (!n) return;
  if (n.userId === userId) {
    n.read = true;
  } else if (n.userId === "*") {
    // 广播通知:插入一条用户级已读覆盖 (id 加上 userId 前缀)
    const overrideId = `${userId}::${id}`;
    if (!store.some((x) => x.id === overrideId)) {
      store.push({ ...n, id: overrideId, userId, read: true });
    }
  }
  // 若之前已 fork 过,直接改
  const own = store.find((x) => x.id === `${userId}::${id}`);
  if (own) own.read = true;
}

export function markAllRead(userId: string): void {
  for (const n of store) {
    if (n.userId === userId) n.read = true;
  }
  // 广播通知 · 逐条 fork
  for (const n of store.filter((x) => x.userId === "*")) {
    if (!store.some((x) => x.id === `${userId}::${n.id}`)) {
      store.push({ ...n, id: `${userId}::${n.id}`, userId, read: true });
    }
  }
}

export function createNotification(input: Omit<Notification, "id" | "createdAt" | "read"> & { read?: boolean }): Notification {
  const full: Notification = {
    ...input,
    id: `n_${randomBytes(4).toString("hex")}`,
    read: !!input.read,
    createdAt: new Date().toISOString(),
  };
  store.unshift(full);
  return full;
}
