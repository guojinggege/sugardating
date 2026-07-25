// GET  /api/user/following            — 当前用户关注列表 (creator slugs · 持久化)
// POST /api/user/following            — body { creatorSlug, creatorType? } 关注 (幂等)
import { NextResponse } from "next/server";
import { getSessionUserId } from "@/lib/session";
import { follow, getFollowingRows, countEligibleFollowing, type CreatorType } from "@/lib/follows/repository";
import { computeEligibility } from "@/lib/trial-offer/eligibility";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const VALID_TYPES: CreatorType[] = ["sugargirl", "sugarboy", "massage"];

export async function GET() {
  const uid = getSessionUserId();
  if (!uid) return err("NOT_AUTHENTICATED", 401);
  const rows = await getFollowingRows(uid);
  return NextResponse.json({
    ok: true,
    following: rows.map((r) => r.creatorSlug),
    rows,
  });
}

export async function POST(req: Request) {
  const uid = getSessionUserId();
  if (!uid) return err("NOT_AUTHENTICATED", 401);
  let body: unknown;
  try { body = await req.json(); } catch { return err("INVALID_JSON", 400); }
  const b = (body ?? {}) as Record<string, unknown>;
  const slug = typeof b.creatorSlug === "string" ? b.creatorSlug.trim() : "";
  if (!slug) return err("INVALID_SLUG", 400, "creatorSlug 必填");
  const creatorType: CreatorType = VALID_TYPES.includes(b.creatorType as CreatorType) ? (b.creatorType as CreatorType) : "sugargirl";

  try {
    const added = await follow(uid, slug, creatorType);
    const followingCount = await countEligibleFollowing(uid);
    const snap = await computeEligibility(uid, true);

    if (process.env.NODE_ENV !== "production") {
      console.log("[follow.POST]", { uid, slug, creatorType, added, followingCount });
    }

    return NextResponse.json({
      ok: true,
      following: true,
      added,
      followingCount,
      trialEligibility: {
        followedCount: snap.followCount,
        followRequirementMet: snap.followCount >= snap.requiredFollows,
        eligible: snap.eligible,
      },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "unknown";
    console.error("[follow.POST] failed", { uid, slug, message: msg });
    return NextResponse.json({ ok: false, code: "DB_ERROR", message: `写入失败:${msg}` }, { status: 500 });
  }
}

function err(code: string, status: number, message?: string) {
  return NextResponse.json({ ok: false, code, message: message ?? code }, { status });
}
