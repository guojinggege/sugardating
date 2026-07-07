// GET /api/auth/me — 当前用户 (未登录 401)
import { NextResponse } from "next/server";
import { getSessionUserId } from "@/lib/session";
import { findUserById, getApplicationByUser, toPublicUser } from "@/lib/mock-db";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  const uid = getSessionUserId();
  if (!uid) return NextResponse.json({ ok: false, code: "NOT_AUTHENTICATED" }, { status: 401 });

  const user = findUserById(uid);
  // Session 有效但 user 不存在 (in-memory 冷启动 reset) — 返 null 让前端登出
  if (!user) return NextResponse.json({ ok: false, code: "USER_NOT_FOUND" }, { status: 401 });

  const application = getApplicationByUser(uid);
  return NextResponse.json({
    ok: true,
    user: toPublicUser(user),
    application: application
      ? { id: application.id, slug: application.slug, status: application.status }
      : null,
  });
}
