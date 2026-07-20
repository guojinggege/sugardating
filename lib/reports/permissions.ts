// 权限判断 · 用户仅可看/改自己的举报 · admin 可看全部
import type { Report } from "./types";

export function canView(report: Report, userId: string, isAdmin: boolean): boolean {
  if (isAdmin) return true;
  return report.reporterId === userId;
}

export function canAddEvidence(report: Report, userId: string, isAdmin: boolean): boolean {
  if (isAdmin) return true;
  if (report.reporterId !== userId) return false;
  // resolved / dismissed 后禁止 (仍可看历史 · 需重新举报)
  return report.status !== "resolved" && report.status !== "dismissed";
}
