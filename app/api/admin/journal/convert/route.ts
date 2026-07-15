// POST /api/admin/journal/convert
// 内嵌 Journal 编辑器专用 · 直接返回 conversion output · 不写历史存储
// 前端会把结果 hydrate 到当前表单的 title/excerpt/tags/bodyBlocks
import { NextResponse } from "next/server";
import { requireAdminOrErr } from "@/lib/admin/auth";
import { convertNoteToBlog } from "@/lib/content-tools/note-to-blog";
import { recordAudit } from "@/lib/cms/audit";
import type {
  ConversionInput, ConversionSettings, ConversionLanguage, ConversionTone, ConversionLength,
} from "@/lib/content-tools/conversion-types";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const OK_LANG: ConversionLanguage[] = ["zh", "en", "bilingual"];
const OK_TONE: ConversionTone[] = ["editorial", "insider", "practical", "narrative"];
const OK_LENGTH: ConversionLength[] = ["brief", "standard", "deep"];

export async function POST(req: Request) {
  const { admin, code, message } = requireAdminOrErr();
  if (!admin) return NextResponse.json({ ok: false, message }, { status: code || 403 });

  let body: any;
  try { body = await req.json(); } catch { return NextResponse.json({ ok: false, message: "INVALID_JSON" }, { status: 400 }); }

  const rawText = typeof body?.rawText === "string" ? body.rawText.trim() : "";
  if (!rawText || rawText.length < 30) return NextResponse.json({ ok: false, message: "正文过短 · 至少 30 字" }, { status: 400 });
  if (rawText.length > 20000) return NextResponse.json({ ok: false, message: "正文过长 · 请分段处理" }, { status: 400 });

  const s = body?.settings ?? {};
  const settings: ConversionSettings = {
    categorySlug: typeof s.categorySlug === "string" ? s.categorySlug : "relationship-intelligence",
    language: OK_LANG.includes(s.language) ? s.language : "zh",
    tone: OK_TONE.includes(s.tone) ? s.tone : "editorial",
    length: OK_LENGTH.includes(s.length) ? s.length : "standard",
    insertInsight: s.insertInsight !== false,
    suggestedCtas: Array.isArray(s.suggestedCtas) ? s.suggestedCtas.slice(0, 3).map(String) : [],
    sourceRightsConfirmed: s.sourceRightsConfirmed === true,
  };

  if (!settings.sourceRightsConfirmed) {
    return NextResponse.json({ ok: false, message: "请先确认素材授权" }, { status: 400 });
  }

  const input: ConversionInput = {
    rawText,
    sourceUrl: typeof body.sourceUrl === "string" ? body.sourceUrl.slice(0, 500) : undefined,
    sourceAuthor: typeof body.sourceAuthor === "string" ? body.sourceAuthor.slice(0, 100) : undefined,
    sourceTitle: typeof body.sourceTitle === "string" ? body.sourceTitle.slice(0, 200) : undefined,
    settings,
  };

  try {
    const output = convertNoteToBlog(input, admin.email);
    recordAudit({
      actorId: admin.userId, actorEmail: admin.email,
      action: "create", targetType: "journal-conversion", targetId: output.id,
      summary: `笔记转换 (内嵌编辑器) · ${output.title.slice(0, 50)}`,
    });
    return NextResponse.json({ ok: true, output });
  } catch (e) {
    console.error("journal/convert failed:", e);
    return NextResponse.json({ ok: false, message: "转换失败,请检查输入或稍后重试" }, { status: 500 });
  }
}
