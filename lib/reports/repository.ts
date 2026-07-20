// 举报存储 · globalThis · HMR-safe · P0 mock
import { randomBytes } from "node:crypto";
import type {
  Report, ReportAction, ReportActionKind, ReportCreateInput, ReportStatus,
} from "./types";
import { getCategoryMeta } from "./categories";

declare global {
  // eslint-disable-next-line no-var
  var __sgReports: Report[] | undefined;
}

const reports = globalThis.__sgReports ?? seed();
globalThis.__sgReports = reports;

// ══════════════════════════════════════
// Seed · 3 条示例数据 (给当前登录用户 + 一些历史)
// ══════════════════════════════════════

function seed(): Report[] {
  const now = Date.now();
  const ago = (h: number) => new Date(now - h * 3600_000).toISOString();
  return [
    {
      id: "rpt_seed001",
      publicRef: "SD-2026-000101",
      reporterId: "u_demo",
      reporterEmail: "demo@sugardating.local",
      scene: "online",
      category: "off_platform_payment",
      target: { type: "creator", id: "aria", label: "Aria M. · sugargirl" },
      title: "对方要求跳转到微信继续沟通",
      description: "第二次聊天时对方发来微信二维码,说要 5000 rmb 先付订金。我拒绝后被拉黑。",
      contactPreference: "in_app",
      agreedToTerms: true,
      status: "reviewing",
      severity: "high",
      evidence: [
        { id: "ev1", filename: "chat-screenshot-1.png", mimeType: "image/png", sizeBytes: 145000, description: "对方发送二维码", addedBy: "user", addedAt: ago(70) },
      ],
      actions: [
        { id: "a1", reportId: "rpt_seed001", kind: "acknowledge", actorId: "system", actorRole: "staff", actorName: "Sugardating Trust & Safety", createdAt: ago(69), visibleToUser: true, statusAfter: "reviewing", message: "已收到你的举报 · 安全团队会在 24 小时内评估。" },
      ],
      createdAt: ago(72),
      updatedAt: ago(69),
    },
    {
      id: "rpt_seed002",
      publicRef: "SD-2026-000098",
      reporterId: "u_demo",
      reporterEmail: "demo@sugardating.local",
      scene: "online",
      category: "fake_profile",
      target: { type: "creator", id: "yuki", label: "Yuki · sugargirl" },
      title: "视频通话时与资料照片明显不符",
      description: "视频里对方明显比资料照片老 15 岁以上,且五官比例不同。请核实资料真实性。",
      contactPreference: "in_app",
      agreedToTerms: true,
      status: "awaiting_evidence",
      severity: "medium",
      evidence: [],
      actions: [
        { id: "a2", reportId: "rpt_seed002", kind: "acknowledge", actorId: "system", actorRole: "staff", actorName: "Sugardating Trust & Safety", createdAt: ago(120), visibleToUser: true, statusAfter: "reviewing" },
        { id: "a3", reportId: "rpt_seed002", kind: "request_evidence", actorId: "adm_1", actorRole: "staff", actorName: "S&T 团队", createdAt: ago(96), visibleToUser: true, statusAfter: "awaiting_evidence", message: "如果方便,可以补充一张视频通话截图 (打上马赛克即可)。我们会用于核实资料。" },
      ],
      createdAt: ago(140),
      updatedAt: ago(96),
    },
    {
      id: "rpt_seed003",
      publicRef: "SD-2026-000075",
      reporterId: "u_demo",
      reporterEmail: "demo@sugardating.local",
      scene: "offline",
      category: "no_show",
      target: { type: "booking", id: "bk_09", label: "预约 · 2026-05-24 · Mayfair 晚餐" },
      title: "对方约定时间未到 · 也没有取消通知",
      description: "约定周五 20:00 在 Mount Street 见面,我准时到达,等了 40 分钟对方没到,消息也不回。",
      contactPreference: "in_app",
      agreedToTerms: true,
      status: "resolved",
      severity: "low",
      evidence: [],
      actions: [
        { id: "a4", reportId: "rpt_seed003", kind: "acknowledge", actorId: "system", actorRole: "staff", actorName: "Sugardating Trust & Safety", createdAt: ago(720), visibleToUser: true, statusAfter: "reviewing" },
        { id: "a5", reportId: "rpt_seed003", kind: "reply",       actorId: "adm_1",  actorRole: "staff", actorName: "S&T 团队", createdAt: ago(680), visibleToUser: true, message: "已与对方沟通 · 对方账号被记录一次爽约,若再发生将限制预约功能。感谢反馈。" },
        { id: "a6", reportId: "rpt_seed003", kind: "resolve",     actorId: "adm_1",  actorRole: "staff", actorName: "S&T 团队", createdAt: ago(678), visibleToUser: true, statusAfter: "resolved", message: "本次已处理完成。" },
      ],
      createdAt: ago(720),
      updatedAt: ago(678),
    },
  ];
}

// ══════════════════════════════════════
// Query helpers
// ══════════════════════════════════════

export function listMyReports(reporterId: string): Report[] {
  return reports
    .filter((r) => r.reporterId === reporterId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function getReportById(id: string): Report | undefined {
  return reports.find((r) => r.id === id);
}

export function getReportByPublicRef(ref: string): Report | undefined {
  return reports.find((r) => r.publicRef === ref);
}

export function listAllReports(): Report[] {
  return [...reports].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function countByStatus(reporterId: string): Record<ReportStatus, number> {
  const base: Record<ReportStatus, number> = {
    submitted: 0, reviewing: 0, awaiting_evidence: 0,
    resolved: 0, dismissed: 0, escalated: 0,
  };
  for (const r of reports) {
    if (r.reporterId === reporterId) base[r.status]++;
  }
  return base;
}

// ══════════════════════════════════════
// Mutations
// ══════════════════════════════════════

function nextPublicRef(): string {
  const year = new Date().getUTCFullYear();
  // 基础序号 100 · 每次 +1
  const nextNum = reports.length + 100;
  return `SD-${year}-${String(nextNum).padStart(6, "0")}`;
}

export function createReport(input: ReportCreateInput, reporterId: string, reporterEmail?: string): Report {
  const catMeta = getCategoryMeta(input.category);
  const now = new Date().toISOString();
  const id = `rpt_${randomBytes(4).toString("hex")}`;
  const acknowledgeAction: ReportAction = {
    id: `a_${randomBytes(3).toString("hex")}`,
    reportId: id,
    kind: "acknowledge",
    actorId: "system",
    actorRole: "staff",
    actorName: "Sugardating Trust & Safety",
    createdAt: now,
    visibleToUser: true,
    statusAfter: "submitted",
    message: "已收到你的举报 · 安全团队会尽快查看。你会在此页面看到处理进度。",
  };
  const report: Report = {
    id,
    publicRef: nextPublicRef(),
    reporterId,
    reporterEmail,
    scene: input.scene,
    category: input.category,
    target: input.target,
    title: input.title.trim().slice(0, 120),
    description: input.description.trim().slice(0, 4000),
    occurredAt: input.occurredAt,
    location: input.location?.slice(0, 120),
    contactPreference: input.contactPreference,
    agreedToTerms: input.agreedToTerms,
    status: "submitted",
    severity: catMeta?.defaultSeverity ?? "medium",
    evidence: (input.evidence ?? []).map((e) => ({
      ...e,
      id: `ev_${randomBytes(3).toString("hex")}`,
      addedBy: "user" as const,
      addedAt: now,
    })),
    actions: [acknowledgeAction],
    createdAt: now,
    updatedAt: now,
  };
  reports.unshift(report);
  return report;
}

export function appendEvidence(reportId: string, meta: { filename: string; mimeType: string; sizeBytes: number; description?: string }, actorRole: "user" | "staff"): Report | undefined {
  const r = reports.find((x) => x.id === reportId);
  if (!r) return undefined;
  const now = new Date().toISOString();
  r.evidence.push({
    id: `ev_${randomBytes(3).toString("hex")}`,
    filename: meta.filename.slice(0, 200),
    mimeType: meta.mimeType.slice(0, 80),
    sizeBytes: Math.min(Math.max(0, meta.sizeBytes), 50 * 1024 * 1024),
    description: meta.description?.slice(0, 500),
    addedBy: actorRole,
    addedAt: now,
  });
  r.updatedAt = now;
  return r;
}

export function appendAction(reportId: string, patch: {
  kind: ReportActionKind;
  message?: string;
  actorId: string;
  actorRole: "user" | "staff";
  actorName?: string;
  visibleToUser: boolean;
  statusAfter?: ReportStatus;
}): Report | undefined {
  const r = reports.find((x) => x.id === reportId);
  if (!r) return undefined;
  const now = new Date().toISOString();
  const action: ReportAction = {
    id: `a_${randomBytes(3).toString("hex")}`,
    reportId,
    createdAt: now,
    ...patch,
  };
  r.actions.push(action);
  if (patch.statusAfter) r.status = patch.statusAfter;
  r.updatedAt = now;
  return r;
}

export function assignTo(reportId: string, adminEmail: string): Report | undefined {
  const r = reports.find((x) => x.id === reportId);
  if (!r) return undefined;
  r.assignedTo = adminEmail;
  r.updatedAt = new Date().toISOString();
  return r;
}
