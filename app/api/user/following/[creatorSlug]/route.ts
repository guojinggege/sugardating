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
  const removed = await unfollow(uid, ctx.params.creatorSlug);
  const followingCount = await countEligibleFollowing(uid);
  const snap = await computeEligibility(uid, true);
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
}
