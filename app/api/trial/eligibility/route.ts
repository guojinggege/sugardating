// GET /api/trial/eligibility · 当前用户 trial 资格 + 已有 trial 状态
import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { computeEligibility } from "@/lib/trial-offer/eligibility";
import { getTrial } from "@/lib/trial-offer/repository";
import { trialSecondsLeft } from "@/lib/trial-offer/entitlements";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  const s = getSession();
  if (!s) return NextResponse.json({ ok: false, code: "NOT_AUTHENTICATED" }, { status: 401 });
  const snapshot = computeEligibility(s.userId, true /* emailVerified · P0 假定 register 已验证 */);
  const trial = getTrial(s.userId);
  const secondsLeft = trialSecondsLeft(s.userId);
  return NextResponse.json({ ok: true, snapshot, trial, secondsLeft });
}
