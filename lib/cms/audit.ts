// Audit log · globalThis-backed in-memory store · 未来接 DB
import { randomBytes } from "node:crypto";
import type { AuditAction, CmsAuditEntry } from "./types";

declare global {
  // eslint-disable-next-line no-var
  var __sgAuditLog: CmsAuditEntry[] | undefined;
}
const log = globalThis.__sgAuditLog ?? seed();
globalThis.__sgAuditLog = log;

function seed(): CmsAuditEntry[] {
  const now = Date.now();
  const mk = (h: number, action: AuditAction, target: string, targetId: string, summary: string, email = "admin@sugardating.local"): CmsAuditEntry => ({
    id: `au_${randomBytes(4).toString("hex")}`,
    actorId: "admin",
    actorEmail: email,
    action,
    targetType: target,
    targetId,
    summary,
    createdAt: new Date(now - h * 3600_000).toISOString(),
  });
  return [
    mk(1,   "approve",         "application", "app_leo",       "通过 sugarboy 入驻申请:Leo"),
    mk(3,   "publish",         "journal",     "premium-unlimited-chat-explained", "发布 Journal:Premium 无限畅聊是什么"),
    mk(6,   "update",          "settings",    "flags",         "开启 sugarboy 频道 feature flag"),
    mk(10,  "update",          "creator",     "aria",          "更新 Aria 主页 slogan"),
    mk(24,  "reject",          "application", "app_test",      "拒绝入驻申请:资料不完整"),
    mk(30,  "settings.update", "settings",    "site",          "更新默认语言 zh → en"),
  ];
}

export function recordAudit(entry: Omit<CmsAuditEntry, "id" | "createdAt">): CmsAuditEntry {
  const full: CmsAuditEntry = {
    ...entry,
    id: `au_${randomBytes(4).toString("hex")}`,
    createdAt: new Date().toISOString(),
  };
  log.unshift(full);
  if (log.length > 200) log.length = 200;
  return full;
}

export function listAudit(limit = 50): CmsAuditEntry[] {
  return log.slice(0, limit);
}
