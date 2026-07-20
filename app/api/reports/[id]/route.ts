// GET /api/reports/[id]  · 举报详情 (仅本人 or admin)
import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { getReportById } from "@/lib/reports/repository";
import { canView } from "@/lib/reports/permissions";
import { getAdminSession } from "@/lib/admin/auth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(_req: Request, ctx: { params: { id: string } }) {
  const s = getSession();
  if (!s) return NextResponse.json({ ok: false, message: "UNAUTHORIZED" }, { status: 401 });
  const r = getReportById(ctx.params.id);
  if (!r) return NextResponse.json({ ok: false, message: "举报不存在" }, { status: 404 });
  const admin = !!getAdminSession();
  if (!canView(r, s.userId, admin)) {
    return NextResponse.json({ ok: false, message: "无权查看" }, { status: 403 });
  }
  // 用户视角:过滤 internal_note
  const view = admin ? r : { ...r, actions: r.actions.filter((a) => a.visibleToUser) };
  return NextResponse.json({ ok: true, report: view });
}
