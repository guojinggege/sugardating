// GET  /api/chat/conversations                — 当前用户 conversation list
// POST /api/chat/conversations                — 创建 / 复用与某 Creator 的会话
import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { getOrCreateConversation, listConversations } from "@/lib/chat";
import type { SupportedLocale } from "@/lib/translation";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  const s = getSession();
  if (!s) return NextResponse.json({ ok: false, code: "NOT_AUTHENTICATED" }, { status: 401 });
  return NextResponse.json({ ok: true, conversations: listConversations(s.userId) });
}

export async function POST(req: Request) {
  const s = getSession();
  if (!s) return NextResponse.json({ ok: false, code: "NOT_AUTHENTICATED", message: "请先登录" }, { status: 401 });

  let body: unknown;
  try { body = await req.json(); } catch { return NextResponse.json({ ok: false, code: "INVALID_JSON" }, { status: 400 }); }
  const b = (body ?? {}) as Record<string, unknown>;

  const creatorSlug = typeof b.creatorSlug === "string" ? b.creatorSlug.trim() : "";
  const creatorName = typeof b.creatorName === "string" ? b.creatorName.trim() : "";
  if (!creatorSlug || !creatorName) {
    return NextResponse.json({ ok: false, code: "INVALID_INPUT" }, { status: 400 });
  }
  const creatorAvatar = typeof b.creatorAvatar === "string" ? b.creatorAvatar : undefined;
  const creatorLanguages = Array.isArray(b.creatorLanguages)
    ? b.creatorLanguages.filter((x): x is SupportedLocale => ["zh", "en", "th", "vi", "fil"].includes(x as string))
    : undefined;

  const conv = getOrCreateConversation(s.userId, creatorSlug, { creatorName, creatorAvatar, creatorLanguages });
  return NextResponse.json({ ok: true, conversation: conv });
}
