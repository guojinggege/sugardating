// /photography (Discover Feed) 数据 — V2 平台级 feed,不再单 creator
// 每条动态来自不同 sugargirl,构成 X/Threads/Instagram 风格的 discover 流
import type { FeedPost, CreatorProfile, SidebarSuggestion } from "@/components/Feed/types";
import { sugarGirls } from "@/lib/sugarGirlMock";

const HOURS = 60 * 60 * 1000;
const DAYS = 24 * HOURS;
const NOW = Date.now();
const iso = (offsetMs: number) => new Date(NOW - offsetMs).toISOString();

// 兼容 legacy prop:featuredCreator 用第一位 sugargirl 做占位
const first = sugarGirls[0];
export const featuredCreator: CreatorProfile = {
  name: first.name,
  handle: `@${first.id}`,
  avatar: first.cover,
  cover: first.cover,
  bio: first.bio,
  online: first.online,
  stats: { followers: Math.round(first.popularity * 3), following: 200, likes: first.popularity * 10 },
};

// 16 post 模板:每条不同 sugargirl 作者
const TPL: { text: string; imgCount: number; isVideo?: boolean; isVip?: boolean; ratio?: string; imgOff?: number }[] = [
  { text: "新加坡雨季,清晨海湾静得像玻璃。今天用 35mm 拍的一张,几乎没动后期。", imgCount: 1, ratio: "16/9", imgOff: 3 },
  { text: "上周在 Domaine 的一组。光线真好,模特也很配合。", imgCount: 2, ratio: "1/1", imgOff: 5 },
  { text: "周末试机片,新到 Voigtlander 50mm 1.5。色彩比预期好。", imgCount: 3, ratio: "1/1", imgOff: 0 },
  { text: "夜景延时片段,凌晨四点到五点半。完整 1 分 30 秒在 VIP 区。", imgCount: 1, isVideo: true, imgOff: 7 },
  { text: "VIP · 上周末私拍,16 张高清未发布。需要 Elite 订阅。", imgCount: 1, ratio: "1/1", isVip: true, imgOff: 9 },
  { text: "整理硬盘翻出来的旧片,2024 年在台北的几天。胶片质感。", imgCount: 6, ratio: "1/1", imgOff: 2 },
  { text: "答几个常问:我用 X-T5,主力 23mm + 35mm,后期 Capture One。", imgCount: 0 },
  { text: "刚回到香港。机场外的雨。", imgCount: 3, ratio: "1/1", imgOff: 4 },
  { text: "VIP · 拍摄手记 + 全套原图 24 张 · 西贡黄昏。", imgCount: 1, isVideo: true, isVip: true, imgOff: 10 },
  { text: "试一下 Sigma 40mm f1.4 Art,体积大但解析力顶。", imgCount: 1, ratio: "16/9", imgOff: 1 },
  { text: "周末小展的几张作品,实物展示和屏幕看完全不同。", imgCount: 4, ratio: "1/1", imgOff: 6 },
  { text: "VIP · 一组私房风格的实验,光影比构图更重要。", imgCount: 1, ratio: "1/1", isVip: true, imgOff: 8 },
  { text: "新加坡 Marina Bay 的清晨。", imgCount: 1, ratio: "16/9", imgOff: 2 },
  { text: "整组 9 张,今年最满意的一次约拍。模特非常松弛。", imgCount: 9, ratio: "1/1", imgOff: 0 },
  { text: "Vlog · 一天工作流,从堪景到现场到回家选片。", imgCount: 1, isVideo: true, imgOff: 4 },
  { text: "最后一张,周末愉快。下周会更新一组海岸线。", imgCount: 1, ratio: "16/9", imgOff: 6 },
];

const POOL = sugarGirls;

function pickImgFrom(sgIdx: number, i: number, off: number): string {
  return POOL[(sgIdx + i + off) % POOL.length]?.cover ?? "/images/placeholder.png";
}

export const feedPosts: FeedPost[] = TPL.map((t, i) => {
  const sg = POOL[i % POOL.length];
  const media: FeedPost["media"] = [];
  if (t.isVideo) {
    media.push({ type: "video", src: sg.cover, ratio: t.ratio ?? "16/9" });
  } else {
    for (let k = 0; k < t.imgCount; k++) {
      media.push({ type: "image", src: pickImgFrom(i, k, t.imgOff ?? 0), ratio: t.ratio ?? "1/1" });
    }
  }
  return {
    id: `f${i + 1}`,
    author: {
      name: sg.name,
      handle: `@${sg.id}`,
      avatar: sg.cover,
      verified: sg.tags.includes("Verified"),
    },
    // 额外元数据供 PostCard 用 (link 到 creator + city + online)
    authorSlug: sg.id,
    authorCity: sg.city,
    authorOnline: sg.online,
    createdAt: iso((i * 4 + 2) * HOURS + (i * 17 % 60) * 60 * 1000),
    text: t.text,
    media,
    isVip: !!t.isVip,
    stats: {
      likes: 400 + ((i * 137) % 3400),
      comments: 15 + ((i * 19) % 220),
      shares: 4 + (i * 3) % 40,
      views: 4200 + ((i * 471) % 24000),
    },
  } as FeedPost;
});

// Sidebar suggestions — 从 sugarGirls pool 取,不同 offset
export const sidebarSuggestions: SidebarSuggestion[] = [4, 6, 9, 12].map((i) => ({
  name: POOL[i].name,
  handle: `@${POOL[i].id}`,
  avatar: POOL[i].cover,
  bio: POOL[i].intro,
}));

export const sidebarHotCreators: SidebarSuggestion[] = [1, 5, 11, 15].map((i) => ({
  name: POOL[i].name,
  handle: `@${POOL[i].id}`,
  avatar: POOL[i].cover,
  bio: POOL[i].intro,
}));

// V2 新增数据源
export const trendingCreators: SidebarSuggestion[] = [0, 5, 12, 20].map((i) => ({
  name: POOL[i].name,
  handle: `@${POOL[i].id}`,
  avatar: POOL[i].cover,
  bio: `${POOL[i].city} · ${POOL[i].intro}`,
}));

export const onlineCreators: SidebarSuggestion[] = POOL.filter((sg) => sg.online).slice(0, 5).map((sg) => ({
  name: sg.name,
  handle: `@${sg.id}`,
  avatar: sg.cover,
  bio: sg.city,
}));

export const vipCreators: SidebarSuggestion[] = POOL.filter((sg) => sg.tags.includes("VIP")).slice(0, 4).map((sg) => ({
  name: sg.name,
  handle: `@${sg.id}`,
  avatar: sg.cover,
  bio: `${sg.city} · VIP`,
}));

export const popularTags: { tag: string; count: number }[] = [
  { tag: "旅行",   count: 4820 },
  { tag: "摄影",   count: 3941 },
  { tag: "时尚",   count: 2688 },
  { tag: "美食",   count: 2154 },
  { tag: "咖啡",   count: 1876 },
  { tag: "音乐",   count: 1420 },
  { tag: "健身",   count: 1183 },
  { tag: "Luxury", count: 986 },
];

export const upcomingTrips: { city: string; date: string; sg: string }[] = [
  { city: "东京",   date: "Mar 2026", sg: POOL[0]?.name ?? "" },
  { city: "巴厘岛", date: "Apr 2026", sg: POOL[3]?.name ?? "" },
  { city: "首尔",   date: "May 2026", sg: POOL[6]?.name ?? "" },
  { city: "巴黎",   date: "Jun 2026", sg: POOL[9]?.name ?? "" },
];
