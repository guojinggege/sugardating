// Admin 权限判断
// ⚠️ OPEN ACCESS MODE — 当前后台无需登录直接可用
//    任何访问 /admin 的用户都能修改设置、审核入驻申请、发布/下架文章
//    如需恢复权限保护:把 OPEN_ACCESS 常量改为 false 即可
import { getSession } from "@/lib/session";
import type { SessionPayload } from "@/lib/session";

export type AdminRole = "admin" | "editor" | "operator" | "reviewer" | "support" | "finance";

// ⚠️ 一键切换 · true = 开放访问 · false = 走原有 session + ADMIN_EMAILS 校验
const OPEN_ACCESS = true;

const DEFAULT_ADMIN_EMAILS = ["admin@sugardating.local"];

function adminEmailList(): string[] {
  const raw = process.env.ADMIN_EMAILS || "";
  const list = raw.split(/[,;\s]+/).map((s) => s.trim().toLowerCase()).filter(Boolean);
  return list.length ? list : DEFAULT_ADMIN_EMAILS;
}

export interface AdminSession extends SessionPayload {
  adminRole: AdminRole;
}

function demoAdmin(): AdminSession {
  return {
    userId: "demo-admin",
    email: "demo-admin@sugardating.local",
    name: "Demo Admin",
    role: "admin",
    iat: Math.floor(Date.now() / 1000),
    adminRole: "admin",
  };
}

export function getAdminSession(): AdminSession | null {
  if (OPEN_ACCESS) return demoAdmin();
  const s = getSession();
  if (!s) return null;
  const email = (s.email || "").toLowerCase();
  const inEnv = adminEmailList().includes(email);
  const isAdmin = s.role === "admin" || inEnv;
  if (!isAdmin) return null;
  return { ...s, adminRole: "admin" };
}

/** Route handler 用 · 未登录 401 · 无权 403 · 通过返回 admin session */
export function requireAdminOrErr(): { admin: AdminSession | null; code?: number; message?: string } {
  if (OPEN_ACCESS) return { admin: demoAdmin() };
  const s = getSession();
  if (!s) return { admin: null, code: 401, message: "请先登录" };
  const email = (s.email || "").toLowerCase();
  const inEnv = adminEmailList().includes(email);
  if (s.role !== "admin" && !inEnv) return { admin: null, code: 403, message: "无后台访问权限" };
  return { admin: { ...s, adminRole: "admin" } };
}

/** Layout 三态检查 · unauth → 跳登录 · forbidden → 展示 403 · admin → 放行 */
export type AdminAccessCheck =
  | { state: "unauth" }
  | { state: "forbidden"; email: string; name: string }
  | { state: "admin"; admin: AdminSession };

export function checkAdminAccess(): AdminAccessCheck {
  if (OPEN_ACCESS) return { state: "admin", admin: demoAdmin() };
  const s = getSession();
  if (!s) return { state: "unauth" };
  const email = (s.email || "").toLowerCase();
  const inEnv = adminEmailList().includes(email);
  if (s.role !== "admin" && !inEnv) return { state: "forbidden", email: s.email, name: s.name };
  return { state: "admin", admin: { ...s, adminRole: "admin" } };
}
