// DELETE /api/auth/link/[provider] · 解除关联
// 安全:必须保证至少还有一种可用登录方式 (email/password 目前是主身份 · 一直保留)
import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { unlink, type LinkedProvider } from "@/lib/auth/linked-accounts";
import { recordAudit } from "@/lib/cms/audit";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const OK: LinkedProvider[] = ["apple", "x"];

export async function DELETE(_req: Request, ctx: { params: { provider: string } }) {
  const s = getSession();
  if (!s) return NextResponse.json({ ok: false, code: "NOT_AUTHENTICATED" }, { status: 401 });

  const provider = ctx.params.provider as LinkedProvider;
  if (!OK.includes(provider)) return NextResponse.json({ ok: false, message: "unknown provider" }, { status: 400 });

  // 邮箱主身份始终可用 · 直接解除
  const r = unlink(s.userId, provider);
  if (!r.ok) return NextResponse.json({ ok: false, message: r.message }, { status: 400 });

  recordAudit({
    actorId: s.userId, actorEmail: s.email,
    action: "delete", targetType: "linked-account", targetId: provider,
    summary: `解除关联 · ${provider}`,
  });
  return NextResponse.json({ ok: true });
}
