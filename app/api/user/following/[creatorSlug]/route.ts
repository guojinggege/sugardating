// DELETE /api/user/following/[creatorSlug] — 取消关注 (幂等)
import { NextResponse } from "next/server";
import { getSessionUserId } from "@/lib/session";
import { unfollow, countEligibleFollowing } from "@/lib/follows/repository";
import { computeEligibility } from "@/lib/trial-offer/eligibility";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function DELETE(_req: Request, ctx: { params: { creatorSlug: string } }) {
  const uid = getSessionUserId();
  if (!uid) return NextResponse.json({ ok: false, code: "NOT_AUTHENTICATED" }, { status: 401 });
  const slug = ctx.params.creatorSlug;
  try {
    const removed = await unfollow(uid, slug);
    const followingCount = await countEligibleFollowing(uid);
    const snap = await computeEligibility(uid, true);
    if (process.env.NODE_ENV !== "production") {
      console.log("[follow.DELETE]", { uid, slug, removed, followingCount });
    }
    return NextResponse.json({
      ok: true,
      following: false,
      removed,
      followingCount,
      trialEligibility: {
        followedCount: snap.followCount,
        followRequirementMet: snap.followCount >= snap.requiredFollows,
        eligible: snap.eligible,
      },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "unknown";
    console.error("[follow.DELETE] failed", { uid, slug, message: msg });
    return NextResponse.json({ ok: false, code: "DB_ERROR", message: `取消关注失败:${msg}` }, { status: 500 });
  }
}
