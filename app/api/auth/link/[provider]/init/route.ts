// POST /api/auth/link/[provider]/init · 关联流程入口
// 生产 · 生成 state/nonce/PKCE · 存 httpOnly cookie · 返回 authorize URL
// P0 · env 未配置 → 返回 not_configured · 前端显示 "Apple 登录暂未开放"
import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { isAppleAvailable, isXAvailable, type LinkedProvider } from "@/lib/auth/linked-accounts";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const OK: LinkedProvider[] = ["apple", "x"];

export async function POST(_req: Request, ctx: { params: { provider: string } }) {
  const s = getSession();
  if (!s) return NextResponse.json({ ok: false, code: "NOT_AUTHENTICATED" }, { status: 401 });

  const provider = ctx.params.provider as LinkedProvider;
  if (!OK.includes(provider)) return NextResponse.json({ ok: false, message: "unknown provider" }, { status: 400 });

  const available = provider === "apple" ? isAppleAvailable() : isXAvailable();
  if (!available) {
    return NextResponse.json({
      ok: false,
      code: "NOT_CONFIGURED",
      message: `${provider === "apple" ? "Apple" : "X"} 登录暂未开放`,
    }, { status: 501 });
  }

  // 已配置 · 生成 state / nonce / (PKCE for X) · 设 httpOnly cookie · 返回 authorize URL
  // P0 阶段不接真实回调 · 只返回骨架 URL + 明确说明
  return NextResponse.json({
    ok: false,
    code: "NOT_CONFIGURED",
    message: "OAuth 回调 handler 尚待接入真实 provider · 请联系管理员开通",
  }, { status: 501 });
}
