// PATCH /api/admin/reports/[id] · 追加 action / 变更状态 / assign
import { NextResponse } from "next/server";
import { requireAdminOrErr } from "@/lib/admin/auth";
import { appendAction, assignTo, getReportById } from "@/lib/reports/repository";
import { recordAudit } from "@/lib/cms/audit";
import type { ReportActionKind, ReportStatus } from "@/lib/reports/types";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const VALID_KINDS: ReportActionKind[] = [
  "acknowledge", "request_evidence", "internal_note", "reply", "resolve", "dismiss", "escalate",
];
const KIND_TO_STATUS: Partial<Record<ReportActionKind, ReportStatus>> = {
  acknowledge:      "reviewing",
  request_evidence: "awaiting_evidence",
  resolve:          "resolved",
  dismiss:          "dismissed",
  escalate:         "escalated",
};

export async function PATCH(req: Request, ctx: { params: { id: string } }) {
  const { admin, code, message } = requireAdminOrErr();
  if (!admin) return NextResponse.json({ ok: false, message }, { status: code || 403 });

  let body: any;
  try { body = await req.json(); } catch { return NextResponse.json({ ok: false, message: "INVALID_JSON" }, { status: 400 }); }

  const r = getReportById(ctx.params.id);
  if (!r) return NextResponse.json({ ok: false, message: "举报不存在" }, { status: 404 });

  // 1. 支持 assign
  if (typeof body?.assignTo === "string" && body.assignTo) {
    assignTo(r.id, body.assignTo.slice(0, 120));
    recordAudit({
      actorId: admin.userId, actorEmail: admin.email,
      action: "update", targetType: "user-report", targetId: r.id,
      summary: `分配举报 · ${r.publicRef} → ${body.assignTo}`,
    });
  }

  // 2. 支持 append action
  if (typeof body?.actionKind === "string") {
    const kind = body.actionKind as ReportActionKind;
    if (!VALID_KINDS.includes(kind)) {
      return NextResponse.json({ ok: false, message: "actionKind 不合法" }, { status: 400 });
    }
    const visibleToUser = kind === "internal_note" ? false : (body.visibleToUser !== false);
    const statusAfter = KIND_TO_STATUS[kind];
    appendAction(r.id, {
      kind,
      message: typeof body.message === "string" ? body.message.trim().slice(0, 2000) : undefined,
      actorId: admin.userId,
      actorRole: "staff",
      actorName: admin.name,
      visibleToUser,
      statusAfter,
    });
    recordAudit({
      actorId: admin.userId, actorEmail: admin.email,
      action: "update", targetType: "user-report", targetId: r.id,
      summary: `Admin action ${kind} · ${r.publicRef}${statusAfter ? ` → ${statusAfter}` : ""}`,
    });
  }

  return NextResponse.json({ ok: true, report: getReportById(r.id) });
}
