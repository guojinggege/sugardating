// POST /api/chat/conversations/[id]/read · 打开会话时清 unread
import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { markConversationRead } from "@/lib/chat";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(_req: Request, ctx: { params: { id: string } }) {
  const s = getSession();
  if (!s) return NextResponse.json({ ok: false, code: "NOT_AUTHENTICATED" }, { status: 401 });
  const conv = markConversationRead(s.userId, ctx.params.id);
  if (!conv) return NextResponse.json({ ok: false, message: "会话不存在" }, { status: 404 });
  return NextResponse.json({ ok: true, conversation: conv });
}
