// PATCH /api/notifications/[id] · body { read: true } · mark 单条已读
import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { markRead } from "@/lib/notifications";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function PATCH(req: Request, ctx: { params: { id: string } }) {
  const s = getSession();
  if (!s) return NextResponse.json({ ok: false, code: "NOT_AUTHENTICATED" }, { status: 401 });
  let body: any;
  try { body = await req.json(); } catch { body = {}; }
  if (body?.read === true) markRead(s.userId, ctx.params.id);
  return NextResponse.json({ ok: true });
}
