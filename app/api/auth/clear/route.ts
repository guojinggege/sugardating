// GET/POST /api/auth/clear — 清所有 auth cookie · 用于修复损坏 session 后重登
// 前端遇到 401 或无效 session 可 GET 这个,清 cookie 后跳登录页
import { NextResponse } from "next/server";
import { clearSessionCookie } from "@/lib/session";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

async function handle() {
  clearSessionCookie();
  return NextResponse.json({ ok: true });
}
export { handle as GET, handle as POST };
