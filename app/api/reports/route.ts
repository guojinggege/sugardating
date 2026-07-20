// GET /api/reports  · 拉取当前用户的举报列表
// POST /api/reports · 新建举报
import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { validateReportInput } from "@/lib/reports/validators";
import { createReport, listMyReports } from "@/lib/reports/repository";
import { recordAudit } from "@/lib/cms/audit";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  const s = getSession();
  if (!s) return NextResponse.json({ ok: false, message: "UNAUTHORIZED" }, { status: 401 });
  const list = listMyReports(s.userId);
  return NextResponse.json({ ok: true, reports: list });
}

export async function POST(req: Request) {
  const s = getSession();
  if (!s) return NextResponse.json({ ok: false, message: "UNAUTHORIZED" }, { status: 401 });

  let body: any;
  try { body = await req.json(); } catch { return NextResponse.json({ ok: false, message: "INVALID_JSON" }, { status: 400 }); }

  const v = validateReportInput(body);
  if (!v.ok) return NextResponse.json({ ok: false, message: v.message }, { status: 400 });

  try {
    const report = createReport(v.input, s.userId, s.email);
    recordAudit({
      actorId: s.userId, actorEmail: s.email,
      action: "create", targetType: "user-report", targetId: report.id,
      summary: `新增举报 · ${report.publicRef} · ${report.scene} · ${report.title.slice(0, 40)}`,
    });
    return NextResponse.json({ ok: true, report });
  } catch (e) {
    console.error("create report failed:", e);
    return NextResponse.json({ ok: false, message: "提交失败,请稍后再试" }, { status: 500 });
  }
}
