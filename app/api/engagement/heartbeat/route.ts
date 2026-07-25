// POST /api/engagement/heartbeat · 客户端上报 · body { seconds }
// 未登录直接返回 ok · 不产生 · 让匿名浏览页不 fail
import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { recordHeartbeat, getEngagement } from "@/lib/engagement/tracker";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: Request) {
  const s = getSession();
  if (!s) return NextResponse.json({ ok: true, skipped: "not-authenticated" });
  let body: any;
  try { body = await req.json(); } catch { body = {}; }
  const seconds = Number(body?.seconds) || 0;
  const rec = recordHeartbeat(s.userId, seconds);
  return NextResponse.json({ ok: true, totalSeconds: rec.totalSeconds });
}

export async function GET() {
  const s = getSession();
  if (!s) return NextResponse.json({ ok: false, code: "NOT_AUTHENTICATED" }, { status: 401 });
  const rec = getEngagement(s.userId);
  return NextResponse.json({ ok: true, totalSeconds: rec.totalSeconds });
}
