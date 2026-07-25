// 服务端计算 · 前端只展示 · 不信任客户端
import { getEngagement } from "@/lib/engagement/tracker";
import { getFollowing } from "@/lib/mock-db";
import { getMembership } from "@/lib/membership-store";
import { getTrial } from "./repository";
import type { EligibilitySnapshot } from "./types";

const REQUIRED_SECONDS = 5 * 60;   // 5 分钟
const REQUIRED_FOLLOWS = 5;

export function computeEligibility(userId: string, emailVerified: boolean): EligibilitySnapshot {
  const eng = getEngagement(userId);
  const following = getFollowing(userId);
  const membership = getMembership(userId);
  const trial = getTrial(userId);

  const hasUsedIntro7d = !!(membership.hasUsedIntro);
  const isCurrentlyPaid = membership.tier === "paid" && !trial;
  const hasUsedTrial24h = !!trial && (trial.status === "active" || trial.status === "expired" || trial.status === "converted" || trial.status === "cancelled");

  const engagementOk = eng.totalSeconds >= REQUIRED_SECONDS;
  const followsOk = following.length >= REQUIRED_FOLLOWS;

  const eligible =
    emailVerified &&
    !hasUsedIntro7d &&
    !hasUsedTrial24h &&
    !isCurrentlyPaid &&
    engagementOk &&
    followsOk;

  return {
    emailVerified,
    hasUsedIntro7d,
    hasUsedTrial24h,
    isCurrentlyPaid,
    engagementSeconds: eng.totalSeconds,
    requiredSeconds: REQUIRED_SECONDS,
    followCount: following.length,
    requiredFollows: REQUIRED_FOLLOWS,
    eligible,
  };
}
