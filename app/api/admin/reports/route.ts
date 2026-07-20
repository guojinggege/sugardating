// GET /api/admin/reports · 全部举报 (支持按状态过滤)
import { NextResponse } from "next/server";
import { requireAdminOrErr } from "@/lib/admin/auth";
import { listAllReports } from "@/lib/reports/repository";
import type { ReportStatus } from "@/lib/reports/types";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const VALID_STATUS: ReportStatus[] = [
  "submitted", "reviewing", "awaiting_evidence", "resolved", "dismissed", "escalated",
];

export async function GET(req: Request) {
  const { admin, code, message } = requireAdminOrErr();
  if (!admin) return NextResponse.json({ ok: false, message }, { status: code || 403 });

  const url = new URL(req.url);
  const status = url.searchParams.get("status");
  let list = listAllReports();
  if (status && VALID_STATUS.includes(status as ReportStatus)) {
    list = list.filter((r) => r.status === status);
  }
  return NextResponse.json({ ok: true, reports: list });
}
