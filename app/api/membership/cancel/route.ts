// PATCH /api/membership/cancel — 取消会员 (当前周期结束后失效)
import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { cancelMembership } from "@/lib/membership-store";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function PATCH() {
  const s = getSession();
  if (!s) return NextResponse.json({ ok: false, code: "NOT_AUTHENTICATED", message: "请先登录" }, { status: 401 });
  const m = cancelMembership(s.userId);
  return NextResponse.json({ ok: true, membership: m });
}
