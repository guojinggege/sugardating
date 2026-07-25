// GET /api/user/following/status?creatorSlug=... · 快速检查是否关注
import { NextResponse } from "next/server";
import { getSessionUserId } from "@/lib/session";
import { isFollowing } from "@/lib/follows/repository";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(req: Request) {
  const uid = getSessionUserId();
  if (!uid) return NextResponse.json({ ok: true, following: false, authenticated: false });
  const url = new URL(req.url);
  const slug = (url.searchParams.get("creatorSlug") || "").trim();
  if (!slug) return NextResponse.json({ ok: false, code: "INVALID_SLUG" }, { status: 400 });
  const following = await isFollowing(uid, slug);
  return NextResponse.json({ ok: true, following, authenticated: true });
}
