// POST /api/admin/journal/posts/from-conversion
// 接受 conversion output · 创建 Journal 草稿 · 引导管理员进入编辑器
import { NextResponse } from "next/server";
import { requireAdminOrErr } from "@/lib/admin/auth";
import { getConversion, markUsedForDraft } from "@/lib/content-tools/conversion-store";
import { cmsRepo } from "@/lib/cms/repository";
import { recordAudit } from "@/lib/cms/audit";
import type { CmsJournalCreateInput } from "@/lib/cms/types";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: Request) {
  const { admin, code, message } = requireAdminOrErr();
  if (!admin) return NextResponse.json({ ok: false, message }, { status: code || 403 });

  let body: any;
  try { body = await req.json(); } catch { return NextResponse.json({ ok: false, message: "INVALID_JSON" }, { status: 400 }); }

  const conversionId = typeof body?.conversionId === "string" ? body.conversionId : "";
  const conversion = getConversion(conversionId);
  if (!conversion) {
    return NextResponse.json({ ok: false, message: "转换记录不存在,请重新生成" }, { status: 404 });
  }

  // Human review checklist: 强制勾选 · 前端已 gate,后端兜底
  const humanReviewed = body?.humanReviewed === true;
  if (!humanReviewed) {
    return NextResponse.json({ ok: false, message: "请确认人工已复核内容" }, { status: 400 });
  }

  // 允许调用方 override 部分字段 (标题/slug/摘要 微调)
  const override = body?.override ?? {};
  const createInput: CmsJournalCreateInput = {
    title: (override.title || conversion.title).slice(0, 200),
    slug: String(override.slug || conversion.slug).toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "").slice(0, 80),
    excerpt: (override.excerpt || conversion.excerpt).slice(0, 500),
    categorySlug: override.categorySlug || conversion.categorySlug,
    language: (override.language || conversion.language) === "en" ? "en" : "zh",
    author: override.author || conversion.author,
    coverImage: override.coverImage,
    readingTime: conversion.readingTime,
    tags: conversion.tags,
    body: conversion.body,
    cta: conversion.cta,
    featured: false,
    popular: false,
    status: "draft",              // 强制草稿 · 不允许自动发布
    seo: {
      title: override.seoTitle,
      description: override.seoDescription,
    },
  };

  try {
    const post = cmsRepo.createJournalPost(createInput, admin.email);
    markUsedForDraft(conversion.id, post.slug);
    recordAudit({
      actorId: admin.userId, actorEmail: admin.email,
      action: "create", targetType: "journal", targetId: post.slug,
      summary: `从笔记转换创建 Journal 草稿 · ${post.title.slice(0, 50)}`,
    });
    return NextResponse.json({ ok: true, post });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "";
    if (msg === "SLUG_TAKEN") {
      return NextResponse.json({ ok: false, message: "slug 已被占用,请微调后重试" }, { status: 409 });
    }
    console.error("from-conversion failed:", e);
    return NextResponse.json({ ok: false, message: "创建草稿失败" }, { status: 500 });
  }
}
