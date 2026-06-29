"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";

export interface ActionResult {
  ok: boolean;
  error?: string;
}

// 打赏 — 不接真实支付,只记录到 DB
export async function addTip(slug: string, formData: FormData): Promise<ActionResult> {
  const amountStr = String(formData.get("amount") ?? "");
  const amount = parseInt(amountStr, 10);
  if (!Number.isFinite(amount) || amount < 1 || amount > 9999) {
    return { ok: false, error: "金额需在 S$1–9999 之间" };
  }
  const messageRaw = String(formData.get("message") ?? "").trim();
  const message = messageRaw.length === 0 ? null : messageRaw.slice(0, 200);

  const creator = await prisma.creator.findUnique({ where: { slug }, select: { id: true } });
  if (!creator) return { ok: false, error: "创作者不存在" };

  await prisma.tip.create({
    data: { creatorId: creator.id, amount, message: message ?? undefined },
  });
  revalidatePath(`/creators/${slug}`);
  return { ok: true };
}

// 评论 — 先不接认证,名字来自表单
export async function addComment(slug: string, formData: FormData): Promise<ActionResult> {
  const authorName = String(formData.get("authorName") ?? "").trim().slice(0, 40);
  const content = String(formData.get("content") ?? "").trim().slice(0, 500);
  if (!authorName) return { ok: false, error: "请填写名字" };
  if (!content) return { ok: false, error: "请填写评论内容" };

  const creator = await prisma.creator.findUnique({ where: { slug }, select: { id: true } });
  if (!creator) return { ok: false, error: "创作者不存在" };

  await prisma.comment.create({
    data: { creatorId: creator.id, authorName, content },
  });
  revalidatePath(`/creators/${slug}`);
  return { ok: true };
}
