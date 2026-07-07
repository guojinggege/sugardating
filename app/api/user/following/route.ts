// GET  /api/user/following            — 当前用户关注列表 (creator slugs)
// POST /api/user/following            — body { creatorSlug } 关注
import { NextResponse } from "next/server";
import { getSessionUserId } from "@/lib/session";
import { addFollowing, getFollowing } from "@/lib/mock-db";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  const uid = getSessionUserId();
  if (!uid) return err("NOT_AUTHENTICATED", 401);
  return NextResponse.json({ ok: true, following: getFollowing(uid) });
}

export async function POST(req: Request) {
  const uid = getSessionUserId();
  if (!uid) return err("NOT_AUTHENTICATED", 401);
  let body: unknown;
  try { body = await req.json(); } catch { return err("INVALID_JSON", 400); }
  const slug = (body as any)?.creatorSlug;
  if (typeof slug !== "string" || !slug.trim()) return err("INVALID_SLUG", 400);
  const added = addFollowing(uid, slug.trim());
  return NextResponse.json({ ok: true, added, following: getFollowing(uid) });
}

function err(code: string, status: number, message?: string) {
  return NextResponse.json({ ok: false, code, message: message ?? code }, { status });
}
