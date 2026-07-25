// 服务端 · async · 读真实持久化 Follow 数据
import { getEngagement } from "@/lib/engagement/tracker";
import { countEligibleFollowing } from "@/lib/follows/repository";
import { getMembership } from "@/lib/membership-store";
import { getTrial } from "./repository";
import type { EligibilitySnapshot } from "./types";

const REQUIRED_SECONDS = 5 * 60;   // 5 分钟
const REQUIRED_FOLLOWS = 5;

export async function computeEligibility(userId: string, emailVerified: boolean): Promise<EligibilitySnapshot> {
  const eng = getEngagement(userId);
  const followCount = await countEligibleFollowing(userId);
  const membership = getMembership(userId);
  const trial = getTrial(userId);

  const hasUsedIntro7d = !!(membership.hasUsedIntro);
  const isCurrentlyPaid = membership.tier === "paid" && !trial;
  // payment_mandate_required 不算已用 · 用户可反复尝试直到真实付款渠道开通
  const hasUsedTrial24h = !!trial && (
    trial.status === "active" ||
    trial.status === "expired" ||
    trial.status === "converted" ||
    trial.status === "cancelled"
  );

  const engagementOk = eng.totalSeconds >= REQUIRED_SECONDS;
  const followsOk = followCount >= REQUIRED_FOLLOWS;

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
    followCount,
    requiredFollows: REQUIRED_FOLLOWS,
    eligible,
  };
}
