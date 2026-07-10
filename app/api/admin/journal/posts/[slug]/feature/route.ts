// POST /api/admin/journal/posts/[slug]/feature · toggle featured
import { NextResponse } from "next/server";
import { requireAdminOrErr } from "@/lib/admin/auth";
import { cmsRepo } from "@/lib/cms/repository";
import { recordAudit } from "@/lib/cms/audit";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(_req: Request, ctx: { params: { slug: string } }) {
  const { admin, code, message } = requireAdminOrErr();
  if (!admin) return NextResponse.json({ ok: false, message }, { status: code || 403 });

  const post = cmsRepo.toggleJournalFeatured(ctx.params.slug);
  if (!post) return NextResponse.json({ ok: false, message: "文章不存在" }, { status: 404 });

  recordAudit({
    actorId: admin.userId, actorEmail: admin.email,
    action: "update", targetType: "journal", targetId: ctx.params.slug,
    summary: `${post.featured ? "标记" : "取消"} Featured · Journal:${post.title}`,
  });
  return NextResponse.json({ ok: true, post });
}
