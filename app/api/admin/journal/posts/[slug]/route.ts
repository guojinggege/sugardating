// PATCH /api/admin/journal/posts/[slug] · update
// DELETE /api/admin/journal/posts/[slug] · archive (base posts) or delete (new posts)
import { NextResponse } from "next/server";
import { requireAdminOrErr } from "@/lib/admin/auth";
import { cmsRepo } from "@/lib/cms/repository";
import { recordAudit } from "@/lib/cms/audit";
import type { CmsJournalPostFull } from "@/lib/cms/types";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function PATCH(req: Request, ctx: { params: { slug: string } }) {
  const { admin, code, message } = requireAdminOrErr();
  if (!admin) return NextResponse.json({ ok: false, message }, { status: code || 403 });

  const existing = cmsRepo.getJournalPost(ctx.params.slug);
  if (!existing) return NextResponse.json({ ok: false, message: "文章不存在" }, { status: 404 });

  let body: any;
  try { body = await req.json(); } catch { return NextResponse.json({ ok: false, message: "INVALID_JSON" }, { status: 400 }); }

  const patch: Partial<CmsJournalPostFull> = {};
  const allowed: (keyof CmsJournalPostFull)[] = [
    "title", "subtitle", "excerpt", "categorySlug", "language",
    "coverImage", "author", "readingTime", "tags",
    "body", "cta", "featured", "popular", "status", "seo",
  ];
  for (const k of allowed) if (k in body) (patch as any)[k] = body[k];

  const updated = cmsRepo.updateJournalPost(ctx.params.slug, patch);
  if (!updated) return NextResponse.json({ ok: false, message: "更新失败" }, { status: 500 });

  const changedStatus = patch.status && patch.status !== existing.status;
  recordAudit({
    actorId: admin.userId, actorEmail: admin.email,
    action: changedStatus ? (patch.status === "published" ? "publish" : "update") : "update",
    targetType: "journal", targetId: ctx.params.slug,
    summary: changedStatus
      ? `${patch.status === "published" ? "发布" : "更新状态为 " + patch.status} Journal:${updated.title}`
      : `更新 Journal:${updated.title}`,
  });
  return NextResponse.json({ ok: true, post: updated });
}

export async function DELETE(_req: Request, ctx: { params: { slug: string } }) {
  const { admin, code, message } = requireAdminOrErr();
  if (!admin) return NextResponse.json({ ok: false, message }, { status: code || 403 });

  const existing = cmsRepo.getJournalPost(ctx.params.slug);
  if (!existing) return NextResponse.json({ ok: false, message: "文章不存在" }, { status: 404 });

  const ok = cmsRepo.deleteJournalPost(ctx.params.slug);
  if (!ok) return NextResponse.json({ ok: false, message: "删除失败" }, { status: 500 });

  recordAudit({
    actorId: admin.userId, actorEmail: admin.email,
    action: "delete", targetType: "journal", targetId: ctx.params.slug,
    summary: `${existing.isNewPost ? "删除" : "归档"} Journal:${existing.title}`,
  });
  return NextResponse.json({ ok: true });
}
