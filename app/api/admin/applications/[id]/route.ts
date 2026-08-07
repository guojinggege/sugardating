// GET  /api/admin/applications/[id] — 详情(含未脱敏 email / mobile / telephone)· 仅 admin
// PATCH /api/admin/applications/[id] — 更新状态与备注 (reviewing / needs_changes / notes)
import { NextResponse } from "next/server";
import { requireAdminOrErr } from "@/lib/admin/auth";
import { cmsRepo } from "@/lib/cms/repository";
import { recordAudit } from "@/lib/cms/audit";
import type { ReviewStatus } from "@/lib/creator-interest/repository";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const ALLOWED: ReviewStatus[] = ["submitted", "reviewing", "needs_changes", "approved", "rejected"];

export async function GET(_req: Request, ctx: { params: { id: string } }) {
  const { admin, code, message } = requireAdminOrErr();
  if (!admin) return NextResponse.json({ ok: false, message }, { status: code || 403 });
  const raw = await cmsRepo.getApplicationRaw(ctx.params.id);
  if (!raw) return NextResponse.json({ ok: false, message: "申请不存在" }, { status: 404 });
  return NextResponse.json({ ok: true, interest: raw });
}

export async function PATCH(req: Request, ctx: { params: { id: string } }) {
  const { admin, code, message } = requireAdminOrErr();
  if (!admin) return NextResponse.json({ ok: false, message }, { status: code || 403 });

  let body: any;
  try { body = await req.json(); } catch { return NextResponse.json({ ok: false, message: "INVALID_JSON" }, { status: 400 }); }
  const status = typeof body?.status === "string" ? body.status : undefined;
  const notes  = typeof body?.notes  === "string" ? body.notes.slice(0, 500) : undefined;

  if (status && !ALLOWED.includes(status as ReviewStatus)) {
    return NextResponse.json({ ok: false, message: "INVALID_STATUS" }, { status: 400 });
  }
  if (!status && notes === undefined) {
    return NextResponse.json({ ok: false, message: "NOTHING_TO_UPDATE" }, { status: 400 });
  }

  const app = await cmsRepo.getApplication(ctx.params.id);
  if (!app) return NextResponse.json({ ok: false, message: "申请不存在" }, { status: 404 });

  const patch: any = {};
  if (status) patch.status = status;
  if (notes !== undefined) patch.reviewNotes = notes;
  const updated = await cmsRepo.updateApplication(ctx.params.id, patch, admin.userId);
  recordAudit({
    actorId: admin.userId, actorEmail: admin.email,
    action: "update", targetType: "application", targetId: ctx.params.id,
    summary: `更新入驻意向:${app.applicantName}${status ? ` · 状态=${status}` : ""}${notes !== undefined ? ` · 备注更新` : ""}`,
  });
  return NextResponse.json({ ok: true, application: updated });
}
