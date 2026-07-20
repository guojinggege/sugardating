// POST /api/reports/[id]/evidence · 补交证据元数据
import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { getReportById, appendEvidence, appendAction } from "@/lib/reports/repository";
import { canAddEvidence } from "@/lib/reports/permissions";
import { getAdminSession } from "@/lib/admin/auth";
import { recordAudit } from "@/lib/cms/audit";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: Request, ctx: { params: { id: string } }) {
  const s = getSession();
  if (!s) return NextResponse.json({ ok: false, message: "UNAUTHORIZED" }, { status: 401 });
  const r = getReportById(ctx.params.id);
  if (!r) return NextResponse.json({ ok: false, message: "举报不存在" }, { status: 404 });
  const admin = !!getAdminSession();
  if (!canAddEvidence(r, s.userId, admin)) {
    return NextResponse.json({ ok: false, message: "此举报已关闭 · 无法补交" }, { status: 403 });
  }

  let body: any;
  try { body = await req.json(); } catch { return NextResponse.json({ ok: false, message: "INVALID_JSON" }, { status: 400 }); }

  const filename = typeof body?.filename === "string" ? body.filename.trim() : "";
  const mimeType = typeof body?.mimeType === "string" ? body.mimeType.trim() : "";
  const sizeBytes = Number.isFinite(body?.sizeBytes) ? Number(body.sizeBytes) : 0;
  const description = typeof body?.description === "string" ? body.description : undefined;
  if (!filename || !mimeType) {
    return NextResponse.json({ ok: false, message: "缺少 filename / mimeType" }, { status: 400 });
  }
  if (sizeBytes > 50 * 1024 * 1024) {
    return NextResponse.json({ ok: false, message: "单个文件不能超过 50MB" }, { status: 400 });
  }

  const updated = appendEvidence(r.id, { filename, mimeType, sizeBytes, description }, admin ? "staff" : "user");
  if (!updated) return NextResponse.json({ ok: false, message: "补交失败" }, { status: 500 });

  // 用户补交时,若当前状态是 awaiting_evidence → 自动切回 reviewing
  if (!admin && r.status === "awaiting_evidence") {
    appendAction(r.id, {
      kind: "reply",
      actorId: s.userId, actorRole: "user", actorName: s.name,
      message: `已补充证据 · ${filename}`,
      visibleToUser: true,
      statusAfter: "reviewing",
    });
  }

  recordAudit({
    actorId: s.userId, actorEmail: s.email,
    action: "update", targetType: "user-report", targetId: r.id,
    summary: `${admin ? "Admin" : "用户"}补交证据 · ${filename}`,
  });

  return NextResponse.json({ ok: true, report: getReportById(r.id) });
}
