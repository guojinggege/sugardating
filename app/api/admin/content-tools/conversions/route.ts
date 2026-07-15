// GET /api/admin/content-tools/conversions · 历史列表
import { NextResponse } from "next/server";
import { requireAdminOrErr } from "@/lib/admin/auth";
import { listConversions } from "@/lib/content-tools/conversion-store";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  const { admin, code, message } = requireAdminOrErr();
  if (!admin) return NextResponse.json({ ok: false, message }, { status: code || 403 });
  return NextResponse.json({ ok: true, conversions: listConversions(20) });
}
