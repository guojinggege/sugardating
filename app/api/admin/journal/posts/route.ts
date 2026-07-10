// POST /api/admin/journal/posts · create new journal post
import { NextResponse } from "next/server";
import { requireAdminOrErr } from "@/lib/admin/auth";
import { cmsRepo } from "@/lib/cms/repository";
import { recordAudit } from "@/lib/cms/audit";
import type { CmsJournalBlock, CmsStatus } from "@/lib/cms/types";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: Request) {
  const { admin, code, message } = requireAdminOrErr();
  if (!admin) return NextResponse.json({ ok: false, message }, { status: code || 403 });

  let body: any;
  try { body = await req.json(); } catch { return NextResponse.json({ ok: false, message: "INVALID_JSON" }, { status: 400 }); }

  if (!body?.title || !body?.slug || !body?.excerpt || !body?.categorySlug) {
    return NextResponse.json({ ok: false, message: "缺少必填字段: title / slug / excerpt / categorySlug" }, { status: 400 });
  }
  const body_blocks = Array.isArray(body.body) ? body.body as CmsJournalBlock[] : [];
  if (body_blocks.length === 0) {
    return NextResponse.json({ ok: false, message: "正文至少 1 个 block" }, { status: 400 });
  }

  try {
    const post = cmsRepo.createJournalPost({
      title: String(body.title).slice(0, 200),
      slug: String(body.slug).toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "").slice(0, 80),
      subtitle: body.subtitle ? String(body.subtitle).slice(0, 200) : undefined,
      excerpt: String(body.excerpt).slice(0, 500),
      categorySlug: String(body.categorySlug),
      language: body.language === "en" ? "en" : "zh",
      author: body.author ? String(body.author).slice(0, 100) : admin.email,
      coverImage: body.coverImage ? String(body.coverImage) : undefined,
      readingTime: body.readingTime ? String(body.readingTime).slice(0, 30) : "5 min read",
      tags: Array.isArray(body.tags) ? body.tags.slice(0, 15).map(String) : [],
      body: body_blocks,
      cta: Array.isArray(body.cta) ? body.cta.map(String) : [],
      featured: !!body.featured,
      popular: !!body.popular,
      status: (body.status === "published" ? "published" : "draft") as CmsStatus,
      seo: body.seo,
    }, admin.email);

    recordAudit({
      actorId: admin.userId, actorEmail: admin.email,
      action: "create", targetType: "journal", targetId: post.slug,
      summary: `${post.status === "published" ? "创建并发布" : "创建草稿"} Journal:${post.title}`,
    });
    return NextResponse.json({ ok: true, post });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "SERVER_ERROR";
    if (msg === "SLUG_TAKEN") return NextResponse.json({ ok: false, message: "slug 已被占用,请换一个" }, { status: 409 });
    console.error("journal create failed:", msg);
    return NextResponse.json({ ok: false, message: "创建失败,请稍后重试" }, { status: 500 });
  }
}
