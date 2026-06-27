import { PrismaClient } from "@prisma/client";
import { creators, works, regions, channels } from "../lib/mock";
import type { Creator } from "../lib/types";

const prisma = new PrismaClient();

// 在 mock 之外补的几位创作者:专门用来填本来空着的频道(艺术服务 / AI 艺术家)
// 只塞进 DB,不污染 lib/mock.ts(那里仍服务于尚未切库的页面)
const extraCreators: Creator[] = [
  { slug: "yancheng",  name: "颜城",  category: "艺术服务", specialty: "约拍服务",     region: "香港", price: "S$15", tier: "pro",   subs: "320", followers: "1.4万", works: "88"  },
  { slug: "luye",      name: "鹿野",  category: "艺术服务", specialty: "商业后期修图", region: "香港", price: "S$20", tier: "pro",   subs: "210", followers: "9,800", works: "60"  },
  { slug: "muyu",      name: "木与",  category: "艺术服务", specialty: "插画与平面设计", region: "香港", price: "S$10", tier: "basic", subs: "180", followers: "7,600", works: "124" },
  { slug: "neon",      name: "Neon",  category: "AI艺术家", specialty: "AI 风光与场景", region: "香港", price: "S$8",  tier: "pro",   subs: "480", followers: "2.2万", works: "156" },
  { slug: "subai",     name: "苏白",  category: "AI艺术家", specialty: "AI 人像",      region: "香港", price: "S$12", tier: "elite", subs: "760", followers: "4.1万", works: "220" },
  { slug: "ink",       name: "Ink",   category: "AI艺术家", specialty: "AI 插画",      region: "香港", price: "S$6",  tier: "basic", subs: "240", followers: "1.2万", works: "92"  },
];

const allCreators: Creator[] = [...creators, ...extraCreators];

// "1,240" -> 1240   "8.6万" -> 86000   "312" -> 312
function parseCount(s: string): number {
  const t = s.trim();
  if (t.endsWith("万")) return Math.round(parseFloat(t.slice(0, -1)) * 10000);
  return parseInt(t.replace(/,/g, ""), 10) || 0;
}

const tierMeta: Record<string, { label: string; price: string; benefits: string[] }[]> = {
  default: [
    { label: "入门", price: "S$6", benefits: ["每周公开图集", "评论区优先回复"] },
    { label: "进阶", price: "S$15", benefits: ["入门全部权益", "原图下载 + 手记", "每月直播答疑"] },
    { label: "Elite", price: "S$48", benefits: ["进阶全部权益", "1 对 1 反馈", "线下活动名额"] },
  ],
};

async function main() {
  // 清空(开发用,顺序按外键)
  await prisma.tierPlan.deleteMany();
  await prisma.work.deleteMany();
  await prisma.creator.deleteMany();
  await prisma.user.deleteMany();
  await prisma.category.deleteMany();
  await prisma.region.deleteMany();

  // Category — 从 channels 取真正的"内容门类",过滤掉直播/社区这种非创作分类
  const categorySlugs = ["photography", "video", "art-services", "ai-artists", "male-artists"];
  const categoryLabelBySlug: Record<string, string> = Object.fromEntries(
    channels.filter((c) => categorySlugs.includes(c.slug)).map((c) => [c.slug, c.label]),
  );
  const labelToSlug: Record<string, string> = {
    摄影: "photography",
    视频: "video",
    艺术服务: "art-services",
    "AI艺术家": "ai-artists",
    男艺术家: "male-artists",
  };

  for (const slug of categorySlugs) {
    await prisma.category.create({
      data: { slug, label: categoryLabelBySlug[slug] ?? slug },
    });
  }

  // Region
  for (const label of regions) {
    await prisma.region.create({ data: { label } });
  }

  const catBySlug = Object.fromEntries(
    (await prisma.category.findMany()).map((c) => [c.slug, c]),
  );
  const regBy = Object.fromEntries((await prisma.region.findMany()).map((r) => [r.label, r]));

  // Creator + 关联 User + TierPlan
  for (const c of allCreators) {
    const catSlug = labelToSlug[c.category];
    const cat = catBySlug[catSlug];
    const reg = regBy[c.region];
    if (!cat || !reg) {
      throw new Error(`缺少分类或地区: category=${c.category} region=${c.region}`);
    }

    const user = await prisma.user.create({
      data: {
        email: `${c.slug}@lumina.local`,
        name: c.name,
        role: "creator",
      },
    });

    await prisma.creator.create({
      data: {
        slug: c.slug,
        name: c.name,
        specialty: c.specialty,
        price: c.price,
        tier: c.tier,
        subs: parseCount(c.subs),
        followers: parseCount(c.followers),
        worksCount: parseCount(c.works),
        bio: `${c.name} 的简介占位文案。订阅可查看完整作品集、原图下载与拍摄手记。`,
        userId: user.id,
        categoryId: cat.id,
        regionId: reg.id,
        tiers: {
          create: tierMeta.default.map((t, i) => ({
            name: ["basic", "pro", "elite"][i],
            label: t.label,
            price: t.price,
            benefits: JSON.stringify(t.benefits),
          })),
        },
      },
    });
  }

  // Works
  const creatorByName = Object.fromEntries(
    (await prisma.creator.findMany()).map((c) => [c.name, c]),
  );
  for (const w of works) {
    const creator = creatorByName[w.author];
    if (!creator) throw new Error(`找不到作者: ${w.author}`);
    await prisma.work.create({
      data: {
        title: w.title,
        visibility: "public",
        creatorId: creator.id,
      },
    });
  }

  const summary = {
    users: await prisma.user.count(),
    creators: await prisma.creator.count(),
    categories: await prisma.category.count(),
    regions: await prisma.region.count(),
    works: await prisma.work.count(),
    tierPlans: await prisma.tierPlan.count(),
  };
  console.log("Seeded:", summary);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
