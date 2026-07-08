// GET  /api/chat/conversations/[id]/messages — 拉取会话消息
// POST /api/chat/conversations/[id]/messages — 发送新消息 (含 mock creator auto-reply)
import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { appendMessage, creatorAutoReply, getConversation, listMessages } from "@/lib/chat";
import { detectLanguage, translateText, type SupportedLocale } from "@/lib/translation";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(_req: Request, ctx: { params: { id: string } }) {
  const s = getSession();
  if (!s) return NextResponse.json({ ok: false, code: "NOT_AUTHENTICATED" }, { status: 401 });
  const conv = getConversation(s.userId, ctx.params.id);
  if (!conv) return NextResponse.json({ ok: false, code: "NOT_FOUND" }, { status: 404 });
  return NextResponse.json({ ok: true, messages: listMessages(s.userId, ctx.params.id) });
}

export async function POST(req: Request, ctx: { params: { id: string } }) {
  const s = getSession();
  if (!s) return NextResponse.json({ ok: false, code: "NOT_AUTHENTICATED", message: "请先登录" }, { status: 401 });
  const conv = getConversation(s.userId, ctx.params.id);
  if (!conv) return NextResponse.json({ ok: false, code: "NOT_FOUND", message: "会话不存在" }, { status: 404 });

  let body: unknown;
  try { body = await req.json(); } catch { return NextResponse.json({ ok: false, code: "INVALID_JSON" }, { status: 400 }); }
  const text = typeof (body as any)?.text === "string" ? String((body as any).text).trim() : "";
  const translateTo = (body as any)?.translateTo as SupportedLocale | undefined;
  if (!text || text.length > 2000) {
    return NextResponse.json({ ok: false, code: "INVALID_INPUT", message: "消息内容为空或过长" }, { status: 400 });
  }

  // 用户消息 · optionally 翻译成 creator 主语言
  const originalLanguage = detectLanguage(text);
  let translatedText: string | undefined = undefined;
  let translatedTo: SupportedLocale | undefined = undefined;
  if (translateTo && translateTo !== originalLanguage) {
    try {
      const tr = await translateText({ text, from: originalLanguage, to: translateTo });
      translatedText = tr.translatedText;
      translatedTo = translateTo;
    } catch { /* silent; message 仍发原文 */ }
  }

  const userMsg = appendMessage(conv.id, {
    senderId: s.userId,
    senderType: "user",
    text,
    originalLanguage,
    translatedText,
    translatedTo,
    status: "sent",
  });

  // Mock creator auto-reply (delay simulation 前端 setTimeout;这里同步返回消息)
  const creatorLang: SupportedLocale = conv.creatorLanguages?.[0] ?? "zh";
  const replyMsg = creatorAutoReply(conv.id, creatorLang);

  return NextResponse.json({ ok: true, message: userMsg, reply: replyMsg });
}
