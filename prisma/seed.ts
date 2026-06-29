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

// 评论池子(20 条) — 围绕摄影/视频作品本身的观感,seed 时每位创作者随机抽 5-10 条
const commentPool: { name: string; content: string }[] = [
  { name: "小雨",       content: "这组光线真是绝了,海岸的层次推开得很自然。" },
  { name: "陈林",       content: "构图很稳,前景的礁石做引导线特别有故事感。" },
  { name: "Joy",        content: "色调很克制,有黑白胶片的味道。" },
  { name: "Mira",       content: "山顶那张的色温过渡很舒服,后期没有过曝。" },
  { name: "Kevin",      content: "拍出了那种潮湿的空气感,很喜欢。" },
  { name: "雾里看花",   content: "雨水落在石头上的质感拍到了,镜头语言成熟。" },
  { name: "Anika",      content: "对光线的耐心确实是好作品的关键。" },
  { name: "野旅人",     content: "可以多分享一些后期手记吗?想学习。" },
  { name: "Lucas",      content: "看完想立刻订机票去现场。" },
  { name: "白岛",       content: "色彩还原非常自然,没有滤镜的廉价感。" },
  { name: "苏茉",       content: "你的画面有种安静下来的力量。" },
  { name: "顾川",       content: "前后两张的对比把时间的流动表现出来了。" },
  { name: "晚来",       content: "构图克制,留白处也是语言。" },
  { name: "蓝鳞",       content: "天空的层次拉得很好,云没有糊掉。" },
  { name: "Ava",        content: "镜头里有作者本人的呼吸。" },
  { name: "凌川",       content: "雾中那张已经收藏到我的灵感库了。" },
  { name: "Noemi",      content: "请问主要用什么镜头?画面紧凑很喜欢。" },
  { name: "南野",       content: "夜景延时帧间过渡平滑,机位选得讲究。" },
  { name: "Bea",        content: "色彩饱和很克制,不会喧宾夺主。" },
  { name: "Olin",       content: "这一组应该出画册,值得收藏。" },
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

async function main() {
  // 清空(开发用,顺序按外键)
  await prisma.membership.deleteMany();
  await prisma.membershipPlan.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.tip.deleteMany();
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

  // Works — 故意混着分配 image/video,让"图片作品 / 视频作品" tab 都能见数据
  // 比如林夏(w1+w5)/陈屿(w2+w10)分别覆盖两种 type
  const workTypeOverrides: Record<string, "image" | "video"> = {
    w1: "image",   // 雨后的海岸 - 林夏
    w2: "video",   // 霓虹与雨   - 陈屿
    w3: "image",   // 清晨的山   - 苏念
    w4: "image",   // 黑白海岸   - Aria
    w5: "video",   // 山顶黄昏   - 林夏  ← 林夏拿到一条 video
    w6: "video",   // 公路尽头   - 周野
    w7: "image",   // 雾中森林   - 麦地
    w8: "image",   // 湖与天     - 何雨桐
    w9: "video",   // 雪山之巅   - Kenji
    w10: "image",  // 日落港湾   - 陈屿  ← 陈屿拿到一条 image
  };

  const creatorByName = Object.fromEntries(
    (await prisma.creator.findMany()).map((c) => [c.name, c]),
  );
  for (const w of works) {
    const creator = creatorByName[w.author];
    if (!creator) throw new Error(`找不到作者: ${w.author}`);
    await prisma.work.create({
      data: {
        title: w.title,
        type: workTypeOverrides[w.id] ?? "image",
        visibility: "public",
        creatorId: creator.id,
      },
    });
  }

  // Comments — 每位创作者 5-10 条,内容随机抽自 commentPool
  const creatorsInDb = await prisma.creator.findMany();
  const DAY = 24 * 60 * 60 * 1000;
  for (const cr of creatorsInDb) {
    const n = 5 + Math.floor(Math.random() * 6); // 5-10
    const picks = shuffle(commentPool).slice(0, n);
    for (const cm of picks) {
      const ageMs = Math.random() * 30 * DAY; // 0-30 天内随机
      await prisma.comment.create({
        data: {
          authorName: cm.name,
          content: cm.content,
          creatorId: cr.id,
          createdAt: new Date(Date.now() - ageMs),
        },
      });
    }
  }

  // Membership plans — 3 等级 × 4 周期。价格用 cents 存,展示时除 100
  // 权益不含"无限私聊创作者";走内容/体验向
  const TIER_BENEFITS: Record<string, string[]> = {
    basic: [
      "免广告浏览",
      "会员价订阅折扣 5%",
      "专属会员徽章",
    ],
    premium: [
      "免广告浏览",
      "提前 24 小时看新作品",
      "原图高清下载",
      "会员价订阅折扣 10%",
      "进阶会员徽章",
      "活动报名优先",
    ],
    elite: [
      "免广告浏览",
      "提前 48 小时看新作品",
      "独家内容合集每月更新",
      "原图高清 + 无水印批量下载",
      "会员价订阅折扣 15%",
      "尊享会员徽章",
      "线下活动名额优先",
    ],
  };

  // tier → period → cents
  const PRICES: Record<string, Record<string, number>> = {
    basic:   { week:  300, month:  1000, quarter:  2500, year:  8000 },
    premium: { week:  600, month:  2000, quarter:  5200, year: 18000 },
    elite:   { week: 1200, month:  4000, quarter: 10500, year: 36000 },
  };

  const TIER_ORDER: Record<string, number> = { basic: 0, premium: 1, elite: 2 };
  const PERIOD_ORDER: Record<string, number> = { week: 0, month: 1, quarter: 2, year: 3 };

  for (const tier of Object.keys(PRICES)) {
    for (const period of Object.keys(PRICES[tier])) {
      await prisma.membershipPlan.create({
        data: {
          tier,
          period,
          price: PRICES[tier][period],
          benefits: JSON.stringify(TIER_BENEFITS[tier]),
          bestValue: period === "year",
          sortKey: TIER_ORDER[tier] * 10 + PERIOD_ORDER[period],
        },
      });
    }
  }

  const summary = {
    users: await prisma.user.count(),
    creators: await prisma.creator.count(),
    categories: await prisma.category.count(),
    regions: await prisma.region.count(),
    works: await prisma.work.count(),
    tierPlans: await prisma.tierPlan.count(),
    tips: await prisma.tip.count(),
    comments: await prisma.comment.count(),
    membershipPlans: await prisma.membershipPlan.count(),
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
