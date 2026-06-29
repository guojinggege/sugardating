import { prisma } from "./db";
import type { Creator, Tier, Work } from "./types";

const slugToCategoryLabel: Record<string, string> = {
  photography: "摄影",
  video: "视频",
  "art-services": "艺术服务",
  "ai-artists": "AI艺术家",
  "male-artists": "男艺术家",
};

// 1240 -> "1,240"   86000 -> "8.6万"
function fmtCount(n: number): string {
  if (n >= 10000) {
    const v = (n / 10000).toFixed(1).replace(/\.0$/, "");
    return `${v}万`;
  }
  return n.toLocaleString("en-US");
}

type CreatorWithJoins = Awaited<ReturnType<typeof prisma.creator.findMany>>[number] & {
  category: { slug: string; label: string };
  region: { label: string };
};

function toCreatorDTO(c: CreatorWithJoins): Creator {
  return {
    slug: c.slug,
    name: c.name,
    category: slugToCategoryLabel[c.category.slug] ?? c.category.label,
    specialty: c.specialty,
    region: c.region.label,
    price: c.price,
    tier: c.tier as Tier,
    subs: fmtCount(c.subs),
    followers: fmtCount(c.followers),
    works: fmtCount(c.worksCount),
  };
}

export async function listCreators(opts?: { region?: string }): Promise<Creator[]> {
  const rows = await prisma.creator.findMany({
    where: opts?.region ? { region: { label: opts.region } } : undefined,
    include: { category: true, region: true },
    orderBy: { createdAt: "asc" },
  });
  return rows.map((c) => toCreatorDTO(c as CreatorWithJoins));
}

// 城市按地理分组返回,供 Nav 下拉用
// 分组在前端逻辑里硬编码,避免给 Region 表加 group 字段
const REGION_GROUP: Record<string, "se-asia" | "east-asia" | "overseas"> = {
  "新加坡": "se-asia", "吉隆坡": "se-asia", "曼谷": "se-asia",
  "马尼拉": "se-asia", "胡志明市": "se-asia",
  "香港": "east-asia", "台北": "east-asia", "首尔": "east-asia", "东京": "east-asia",
  "伦敦": "overseas", "悉尼": "overseas",
};
const GROUP_LABEL: Record<string, string> = {
  "se-asia": "东南亚",
  "east-asia": "东亚",
  "overseas": "海外",
};
const GROUP_ORDER = ["se-asia", "east-asia", "overseas"] as const;

export interface RegionGroup {
  key: string;
  label: string;
  cities: string[];
}

export async function listRegionsGrouped(): Promise<RegionGroup[]> {
  const rows = await prisma.region.findMany({ orderBy: { id: "asc" } });
  const buckets: Record<string, string[]> = { "se-asia": [], "east-asia": [], "overseas": [] };
  for (const r of rows) {
    const g = REGION_GROUP[r.label] ?? "overseas";
    buckets[g].push(r.label);
  }
  return GROUP_ORDER
    .map((k) => ({ key: k, label: GROUP_LABEL[k], cities: buckets[k] }))
    .filter((g) => g.cities.length > 0);
}

export async function listCreatorsByCategory(categorySlug: string): Promise<Creator[]> {
  const rows = await prisma.creator.findMany({
    where: { category: { slug: categorySlug } },
    include: { category: true, region: true },
    orderBy: { createdAt: "asc" },
  });
  return rows.map((c) => toCreatorDTO(c as CreatorWithJoins));
}

export interface CreatorTierPlan {
  name: string; // basic | pro | elite
  label: string;
  price: string;
  benefits: string[];
}

export type WorkType = "image" | "video";

// 创作者主页要按 type 分组,所以扩展一下 Work 的形状(不动 lib/types.ts)
export interface ProfileWork extends Work {
  type: WorkType;
}

export interface CreatorDetail {
  creator: Creator;
  bio: string;
  works: ProfileWork[];
  tiers: CreatorTierPlan[];
}

export async function getCreatorBySlug(slug: string): Promise<CreatorDetail | null> {
  const c = await prisma.creator.findUnique({
    where: { slug },
    include: {
      category: true,
      region: true,
      works: { orderBy: { createdAt: "asc" } },
      tiers: { orderBy: { id: "asc" } },
    },
  });
  if (!c) return null;

  const categoryLabel = slugToCategoryLabel[c.category.slug] ?? c.category.label;
  return {
    creator: toCreatorDTO(c as CreatorWithJoins),
    bio: c.bio ?? "",
    works: c.works.map((w) => ({
      id: w.id,
      title: w.title,
      author: c.name,
      category: categoryLabel,
      type: (w.type === "video" ? "video" : "image") as WorkType,
    })),
    tiers: c.tiers.map((t) => ({
      name: t.name,
      label: t.label,
      price: t.price,
      benefits: (t.benefits as string[]) ?? [],
    })),
  };
}

export interface ProfileComment {
  id: string;
  authorName: string;
  content: string;
  createdAt: Date;
}

// 创作者主页底部评论列表 — 倒序,最新在前
export async function listCommentsByCreator(slug: string): Promise<ProfileComment[]> {
  const creator = await prisma.creator.findUnique({ where: { slug }, select: { id: true } });
  if (!creator) return [];
  const rows = await prisma.comment.findMany({
    where: { creatorId: creator.id },
    orderBy: { createdAt: "desc" },
  });
  return rows.map((c) => ({
    id: c.id,
    authorName: c.authorName,
    content: c.content,
    createdAt: c.createdAt,
  }));
}

// 按 creator + type 单独查,供主页两段使用
export async function listWorksByCreatorAndType(
  creatorSlug: string,
  type: WorkType,
): Promise<ProfileWork[]> {
  const creator = await prisma.creator.findUnique({
    where: { slug: creatorSlug },
    include: { category: true },
  });
  if (!creator) return [];
  const categoryLabel = slugToCategoryLabel[creator.category.slug] ?? creator.category.label;
  const rows = await prisma.work.findMany({
    where: { creatorId: creator.id, type, visibility: "public" },
    orderBy: { createdAt: "asc" },
  });
  return rows.map((w) => ({
    id: w.id,
    title: w.title,
    author: creator.name,
    category: categoryLabel,
    type,
  }));
}

// ---- Membership ----

export type MembershipTier = "basic" | "premium" | "elite";
export type MembershipPeriod = "week" | "month" | "quarter" | "year";

export interface PlanCard {
  id: string;
  tier: MembershipTier;
  period: MembershipPeriod;
  price: number;        // cents
  currency: string;
  benefits: string[];
  bestValue: boolean;
  savingsPct: number;   // 相对同等级 week 价的折扣率(>= 0); week 自身为 0
}

const PERIOD_WEEKS: Record<MembershipPeriod, number> = {
  week: 1,
  month: 4,
  quarter: 13,
  year: 52,
};

// 取某 period 下的 3 个等级套餐(basic / premium / elite),附带相对周套餐的省钱比例
export async function listMembershipPlans(period: MembershipPeriod): Promise<PlanCard[]> {
  const [forPeriod, weekly] = await Promise.all([
    prisma.membershipPlan.findMany({ where: { period }, orderBy: { sortKey: "asc" } }),
    prisma.membershipPlan.findMany({ where: { period: "week" } }),
  ]);
  const weeklyByTier: Record<string, number> = {};
  for (const w of weekly) weeklyByTier[w.tier] = w.price;

  const weeksInPeriod = PERIOD_WEEKS[period];

  return forPeriod.map((p) => {
    const wkPrice = weeklyByTier[p.tier];
    const effectiveWeekly = p.price / weeksInPeriod;
    const savingsPct =
      period === "week" || !wkPrice ? 0 : Math.max(0, Math.round((1 - effectiveWeekly / wkPrice) * 100));
    return {
      id: p.id,
      tier: p.tier as MembershipTier,
      period: p.period as MembershipPeriod,
      price: p.price,
      currency: p.currency,
      benefits: (p.benefits as string[]) ?? [],
      bestValue: p.bestValue,
      savingsPct,
    };
  });
}

// 单条 plan 查找(server action 用)
export async function getMembershipPlan(planId: string) {
  return prisma.membershipPlan.findUnique({ where: { id: planId } });
}
