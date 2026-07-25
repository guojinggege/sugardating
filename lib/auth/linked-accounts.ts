// 已关联第三方账号 · 邮箱始终是主身份 · Apple / X 仅可作为登录关联
import { randomBytes } from "node:crypto";

export type LinkedProvider = "apple" | "x";

export interface LinkedAccount {
  id: string;
  userId: string;
  provider: LinkedProvider;
  providerSubject: string;       // Apple sub / X user id · 稳定主键
  providerUsername?: string;
  providerEmail?: string;
  linkedAt: string;
  lastUsedAt?: string;
}

declare global {
  // eslint-disable-next-line no-var
  var __sgLinkedAccounts: LinkedAccount[] | undefined;
}
const store = globalThis.__sgLinkedAccounts ?? [];
globalThis.__sgLinkedAccounts = store;

// ══════════════════════════════════════
// Query
// ══════════════════════════════════════

export function listByUser(userId: string): LinkedAccount[] {
  return store.filter((a) => a.userId === userId);
}

export function findByProviderSubject(provider: LinkedProvider, subject: string): LinkedAccount | undefined {
  return store.find((a) => a.provider === provider && a.providerSubject === subject);
}

export function findByUserAndProvider(userId: string, provider: LinkedProvider): LinkedAccount | undefined {
  return store.find((a) => a.userId === userId && a.provider === provider);
}

// ══════════════════════════════════════
// Mutations
// ══════════════════════════════════════

export function link(input: Omit<LinkedAccount, "id" | "linkedAt">): { ok: true; account: LinkedAccount } | { ok: false; message: string } {
  const existing = findByProviderSubject(input.provider, input.providerSubject);
  if (existing) {
    if (existing.userId === input.userId) return { ok: true, account: existing };
    return { ok: false, message: `此 ${input.provider === "apple" ? "Apple" : "X"} 账号已关联到另一个 Sugardating 账户` };
  }
  const already = findByUserAndProvider(input.userId, input.provider);
  if (already) return { ok: false, message: `你已关联过 ${input.provider === "apple" ? "Apple" : "X"} · 请先解除后再重新关联` };
  const account: LinkedAccount = {
    ...input,
    id: `la_${randomBytes(4).toString("hex")}`,
    linkedAt: new Date().toISOString(),
  };
  store.push(account);
  return { ok: true, account };
}

export function unlink(userId: string, provider: LinkedProvider): { ok: true } | { ok: false; message: string } {
  const idx = store.findIndex((a) => a.userId === userId && a.provider === provider);
  if (idx < 0) return { ok: false, message: "未找到该关联" };
  store.splice(idx, 1);
  return { ok: true };
}

export function touchLastUsed(userId: string, provider: LinkedProvider): void {
  const rec = findByUserAndProvider(userId, provider);
  if (rec) rec.lastUsedAt = new Date().toISOString();
}

// ══════════════════════════════════════
// Provider capability · env 变量检查 · 生产未配置时前台按钮禁用
// ══════════════════════════════════════

export function isAppleAvailable(): boolean {
  if (process.env.APPLE_LOGIN_ENABLED !== "true") return false;
  return !!(process.env.APPLE_CLIENT_ID && process.env.APPLE_TEAM_ID && process.env.APPLE_KEY_ID && process.env.APPLE_PRIVATE_KEY && process.env.APPLE_REDIRECT_URI);
}

export function isXAvailable(): boolean {
  if (process.env.X_LOGIN_ENABLED !== "true") return false;
  return !!(process.env.X_CLIENT_ID && process.env.X_CLIENT_SECRET && process.env.X_REDIRECT_URI);
}
