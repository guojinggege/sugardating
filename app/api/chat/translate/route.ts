// POST /api/chat/translate — 翻译单条文本
import { NextResponse } from "next/server";
import { translateText, type SupportedLocale } from "@/lib/translation";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const OK_LOCALES: SupportedLocale[] = ["zh", "en", "th", "vi", "fil"];

export async function POST(req: Request) {
  let body: unknown;
  try { body = await req.json(); } catch { return NextResponse.json({ ok: false, code: "INVALID_JSON" }, { status: 400 }); }
  const b = (body ?? {}) as Record<string, unknown>;
  const text = typeof b.text === "string" ? b.text : "";
  const to = OK_LOCALES.includes(b.to as SupportedLocale) ? (b.to as SupportedLocale) : null;
  const from = OK_LOCALES.includes(b.from as SupportedLocale) ? (b.from as SupportedLocale) : undefined;

  if (!text || !to) {
    return NextResponse.json({ ok: false, code: "INVALID_INPUT" }, { status: 400 });
  }
  try {
    const result = await translateText({ text, from, to });
    return NextResponse.json({ ok: true, ...result });
  } catch {
    return NextResponse.json({ ok: false, code: "TRANSLATE_FAILED", message: "翻译失败" }, { status: 500 });
  }
}
