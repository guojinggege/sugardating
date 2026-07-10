// Admin 权限判断 · 基于 ADMIN_EMAILS 环境变量 + session.role
// 使用方式:
//   const admin = requireAdmin();           // Server component / route handler
//   if (!admin) redirect("/admin/forbidden") // 权限拒绝
import { getSession } from "@/lib/session";
import type { SessionPayload } from "@/lib/session";

export type AdminRole = "admin" | "editor" | "operator" | "reviewer" | "support" | "finance";

const DEFAULT_ADMIN_EMAILS = ["admin@sugardating.local"];

function adminEmailList(): string[] {
  const raw = process.env.ADMIN_EMAILS || "";
  const list = raw.split(/[,;\s]+/).map((s) => s.trim().toLowerCase()).filter(Boolean);
  return list.length ? list : DEFAULT_ADMIN_EMAILS;
}

export interface AdminSession extends SessionPayload {
  adminRole: AdminRole;
}

export function getAdminSession(): AdminSession | null {
  const s = getSession();
  if (!s) return null;
  const email = (s.email || "").toLowerCase();
  const inEnv = adminEmailList().includes(email);
  const isAdmin = s.role === "admin" || inEnv;
  if (!isAdmin) return null;
  // 未来可根据 email 或 DB 字段区分 role;当前统一 admin
  return { ...s, adminRole: "admin" };
}

/** Route handler 用 · 未登录 401 · 无权 403 · 通过返回 admin session */
export function requireAdminOrErr(): { admin: AdminSession | null; code?: number; message?: string } {
  const s = getSession();
  if (!s) return { admin: null, code: 401, message: "请先登录" };
  const email = (s.email || "").toLowerCase();
  const inEnv = adminEmailList().includes(email);
  if (s.role !== "admin" && !inEnv) return { admin: null, code: 403, message: "无后台访问权限" };
  return { admin: { ...s, adminRole: "admin" } };
}
