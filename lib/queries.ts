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

export async function listCreators(): Promise<Creator[]> {
  const rows = await prisma.creator.findMany({
    include: { category: true, region: true },
    orderBy: { createdAt: "asc" },
  });
  return rows.map((c) => toCreatorDTO(c as CreatorWithJoins));
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

export interface CreatorDetail {
  creator: Creator;
  bio: string;
  works: Work[];
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
    })),
    tiers: c.tiers.map((t) => ({
      name: t.name,
      label: t.label,
      price: t.price,
      benefits: JSON.parse(t.benefits) as string[],
    })),
  };
}
