// GET  /api/notifications        · 当前用户通知列表 + unread count
// POST /api/notifications        · body { action: "markAllRead" }
import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { listNotifications, countUnread, markAllRead } from "@/lib/notifications";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  const s = getSession();
  if (!s) return NextResponse.json({ ok: false, code: "NOT_AUTHENTICATED" }, { status: 401 });
  return NextResponse.json({
    ok: true,
    notifications: listNotifications(s.userId),
    unreadCount: countUnread(s.userId),
  });
}

export async function POST(req: Request) {
  const s = getSession();
  if (!s) return NextResponse.json({ ok: false, code: "NOT_AUTHENTICATED" }, { status: 401 });
  let body: any;
  try { body = await req.json(); } catch { body = {}; }
  if (body?.action === "markAllRead") {
    markAllRead(s.userId);
    return NextResponse.json({ ok: true, unreadCount: 0 });
  }
  return NextResponse.json({ ok: false, message: "unknown action" }, { status: 400 });
}
