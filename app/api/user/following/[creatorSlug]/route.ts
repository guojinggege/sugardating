// DELETE /api/user/following/[creatorSlug] — 取消关注
import { NextResponse } from "next/server";
import { getSessionUserId } from "@/lib/session";
import { removeFollowing, getFollowing } from "@/lib/mock-db";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function DELETE(_req: Request, ctx: { params: { creatorSlug: string } }) {
  const uid = getSessionUserId();
  if (!uid) return NextResponse.json({ ok: false, code: "NOT_AUTHENTICATED" }, { status: 401 });
  const removed = removeFollowing(uid, ctx.params.creatorSlug);
  return NextResponse.json({ ok: true, removed, following: getFollowing(uid) });
}
