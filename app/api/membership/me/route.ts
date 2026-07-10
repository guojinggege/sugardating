// GET /api/membership/me — 当前用户会员状态
import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { getMembership } from "@/lib/membership-store";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  const s = getSession();
  if (!s) return NextResponse.json({ ok: false, code: "NOT_AUTHENTICATED" }, { status: 401 });
  const m = getMembership(s.userId);
  return NextResponse.json({ ok: true, membership: m });
}
