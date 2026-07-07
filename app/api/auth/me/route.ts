// GET /api/auth/me — 从 session cookie 拿 user (不依赖 mock-db,Vercel serverless-safe)
import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { getUserProfile, createUserProfile, getApplicationByUser } from "@/lib/mock-db";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  const s = getSession();
  if (!s) return NextResponse.json({ ok: false, code: "NOT_AUTHENTICATED" }, { status: 401 });

  // profile 若缺失 (跨 serverless 实例 in-memory 丢),即时从 session 补建骨架
  const profile = getUserProfile(s.userId) || createUserProfile(s.userId, s.name);
  const application = getApplicationByUser(s.userId);

  return NextResponse.json({
    ok: true,
    user: { id: s.userId, name: s.name, email: s.email, role: s.role, createdAt: new Date(s.iat * 1000).toISOString() },
    profile,
    creatorApplication: application ? { slug: application.slug, status: application.status } : null,
  });
}
