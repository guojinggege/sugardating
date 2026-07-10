// CMS 权限矩阵 · 未来接真实 role system 时替换 canDo 实现
import type { AdminRole } from "@/lib/admin/auth";

export type Resource =
  | "dashboard" | "home-content" | "navigation" | "creators" | "applications"
  | "media" | "locked-media" | "journal" | "custom-services" | "users"
  | "wallet" | "membership" | "chat-reports" | "moderation"
  | "seo" | "i18n" | "settings" | "audit-log";

export type Action = "view" | "create" | "update" | "delete" | "approve" | "reject" | "publish";

// 简化矩阵 · admin 可做所有;其它角色按此表
const MATRIX: Record<AdminRole, Partial<Record<Resource, Action[]>>> = {
  admin: {},  // full access (special-cased below)
  editor: {
    "dashboard": ["view"],
    "home-content": ["view", "update", "publish"],
    "navigation": ["view", "update"],
    "journal": ["view", "create", "update", "delete", "publish"],
    "seo": ["view", "update", "publish"],
    "i18n": ["view", "update"],
    "media": ["view", "create", "update"],
  },
  operator: {
    "dashboard": ["view"],
    "creators": ["view", "update"],
    "applications": ["view", "update"],
    "media": ["view", "update"],
    "custom-services": ["view", "update"],
    "home-content": ["view"],
  },
  reviewer: {
    "dashboard": ["view"],
    "applications": ["view", "approve", "reject"],
    "media": ["view", "approve", "reject"],
    "moderation": ["view", "approve", "reject"],
  },
  support: {
    "dashboard": ["view"],
    "users": ["view", "update"],
    "chat-reports": ["view", "update"],
    "moderation": ["view"],
  },
  finance: {
    "dashboard": ["view"],
    "wallet": ["view"],
    "membership": ["view"],
  },
};

export function canDo(role: AdminRole, resource: Resource, action: Action): boolean {
  if (role === "admin") return true;
  const allowed = MATRIX[role]?.[resource] ?? [];
  return allowed.includes(action);
}
