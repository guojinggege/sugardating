// POST /api/admin/journal/posts/[slug]/publish · toggle published/draft
import { NextResponse } from "next/server";
import { requireAdminOrErr } from "@/lib/admin/auth";
import { cmsRepo } from "@/lib/cms/repository";
import { recordAudit } from "@/lib/cms/audit";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(_req: Request, ctx: { params: { slug: string } }) {
  const { admin, code, message } = requireAdminOrErr();
  if (!admin) return NextResponse.json({ ok: false, message }, { status: code || 403 });

  const post = cmsRepo.toggleJournalPublish(ctx.params.slug);
  if (!post) return NextResponse.json({ ok: false, message: "文章不存在" }, { status: 404 });

  recordAudit({
    actorId: admin.userId, actorEmail: admin.email,
    action: post.status === "published" ? "publish" : "unpublish",
    targetType: "journal", targetId: ctx.params.slug,
    summary: `${post.status === "published" ? "发布" : "下架"} Journal 文章:${post.title}`,
  });
  return NextResponse.json({ ok: true, post });
}
