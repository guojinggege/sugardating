// /video 频道页占位数据 — VideoGrid 是 client component,
// 图片路径硬编码以避免 transitive 引入 lib/images.ts(里面用 node:fs)

const IMG_FILES = [
  "8b842efe240c75785893d227066893a617b891b67add8cc26bfef890f4f070ef.webp",
  "v2-29a5587d724d82cd5ae79a0a7907726b_1440w.png",
  "v2-3f14fb06170af477dca684d4cba8023d_1440w.jpg",
  "v2-42d3c6648ccf9bd91c1f1d275cf35bab_1440w.png",
  "v2-443d2c16026da4a40f6c032246ee85da_1440w.png",
  "v2-4f08f6e64e4b7a08029ff25803c7d5ad_1440w.png",
  "v2-6b10011cfa662b4758f93d6b0faa8526_1440w.png",
  "v2-733eb901720eaa60ff4c6b4af7a6af58_1440w.png",
  "v2-929c77914860c506b2762df205e1b3f5_1440w.png",
  "v2-ab393098c7bf5ee1aeea165e8efaeefe_1440w.png",
  "v2-cb8c9dec96499a5f4a2327093935f0b5_1440w.png",
];
function img(i: number, offset = 0): string {
  const n = IMG_FILES.length;
  return `/images/${IMG_FILES[(((i + offset) % n) + n) % n]}`;
}

export type VideoTag = "New" | "Verified" | "Popular";
export type VideoCategoryKey =
  | "all"
  | "recommended"
  | "latest"
  | "popular"
  | "featured"
  | "verified"
  | "online";
export type VideoSortKey = "latest" | "popular" | "recommended";

export interface VideoEntry {
  id: string;
  title: string;
  bio: string;           // 1-2 行
  duration: string;      // "5:32"
  cover: string;
  views: number;
  online: boolean;
  isRecommended: boolean;
  isVerified: boolean;
  isFeatured: boolean;   // 精选创作者
  tags: VideoTag[];
  creator: { name: string; city: string };
  createdAt: string;
  popularity: number;
}

const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;
const NOW = Date.now();
const iso = (ms: number) => new Date(NOW - ms).toISOString();

export const videos: VideoEntry[] = [
  { id: "v01", title: "周末雨后海边 vlog",       bio: "新加坡的雨季,清晨的海湾静得像玻璃。",                   duration: "3:42",  cover: img(0),  views: 18900, online: true,  isRecommended: true,  isVerified: true,  isFeatured: true,  tags: ["Popular", "Verified"], creator: { name: "Aria",  city: "新加坡" },   createdAt: iso(1 * DAY),       popularity: 9870 },
  { id: "v02", title: "香港夜景延时",             bio: "凌晨四点到五点半 · 维港天际线 · 4K 完整在 VIP 区。",      duration: "1:24",  cover: img(1),  views: 32400, online: true,  isRecommended: true,  isVerified: true,  isFeatured: false, tags: ["Popular", "New"],      creator: { name: "Mira",  city: "香港" },     createdAt: iso(2 * DAY),       popularity: 9230 },
  { id: "v03", title: "化妆教程 · 日常通勤妆",    bio: "5 分钟搞定 · 适合亚洲眼型 · 平价好物清单评论区。",        duration: "5:32",  cover: img(2),  views: 14200, online: false, isRecommended: true,  isVerified: false, isFeatured: false, tags: ["New"],                  creator: { name: "Yuna",  city: "东京" },     createdAt: iso(8 * HOUR),      popularity: 5230 },
  { id: "v04", title: "旅行 vlog · 东京胡同探店", bio: "下北泽老咖啡馆 · 二手书店 · 三家小酒馆。",                duration: "8:15",  cover: img(3),  views: 21300, online: true,  isRecommended: true,  isVerified: true,  isFeatured: true,  tags: ["Verified", "Popular"], creator: { name: "Chloe", city: "台北" },     createdAt: iso(3 * DAY),       popularity: 8120 },
  { id: "v05", title: "厨房日记 · 三色冷面",      bio: "夏天最快手的午餐 · 全程不开火。",                          duration: "2:48",  cover: img(4),  views: 9800,  online: false, isRecommended: false, isVerified: true,  isFeatured: false, tags: ["Verified"],            creator: { name: "Wenxi", city: "新加坡" },   createdAt: iso(6 * HOUR),      popularity: 4180 },
  { id: "v06", title: "摄影手记 · 胶片在台北",    bio: "Voigtlander 50 1.5 + Portra 400 · 整组扫图分享。",          duration: "6:18",  cover: img(5),  views: 12400, online: false, isRecommended: false, isVerified: true,  isFeatured: false, tags: ["Verified"],            creator: { name: "Sora",  city: "东京" },     createdAt: iso(5 * DAY),       popularity: 7860 },
  { id: "v07", title: "健身记录 · 每周三次",      bio: "30 分钟全身循环训练 · 在家无器械。",                       duration: "4:55",  cover: img(6),  views: 7200,  online: true,  isRecommended: false, isVerified: false, isFeatured: false, tags: ["New"],                  creator: { name: "Nori",  city: "首尔" },     createdAt: iso(2 * DAY),       popularity: 3420 },
  { id: "v08", title: "春装搭配 5 套",            bio: "极简色系 · 中性版型 · 通勤+周末通用。",                    duration: "7:12",  cover: img(7),  views: 16800, online: true,  isRecommended: true,  isVerified: true,  isFeatured: false, tags: ["Popular", "Verified"], creator: { name: "Ivy",   city: "香港" },     createdAt: iso(4 * DAY),       popularity: 7980 },
  { id: "v09", title: "Vintage 古着开箱",         bio: "本周从大阪带回 · 6 件单品 · 配什么聊聊。",                  duration: "9:30",  cover: img(8),  views: 5600,  online: false, isRecommended: false, isVerified: false, isFeatured: false, tags: ["New"],                  creator: { name: "Anika", city: "曼谷" },     createdAt: iso(1 * DAY),       popularity: 3940 },
  { id: "v10", title: "周日咖啡馆探店",           bio: "中环 + 上环三家精品咖啡 · 单品豆推荐。",                    duration: "5:48",  cover: img(9),  views: 8400,  online: true,  isRecommended: false, isVerified: true,  isFeatured: false, tags: ["Verified"],            creator: { name: "Linna", city: "吉隆坡" },   createdAt: iso(6 * DAY),       popularity: 6420 },
  { id: "v11", title: "黑胶碟分享 5 张",          bio: "Jazz + Bossa Nova · 周末听单。",                            duration: "11:24", cover: img(10), views: 4200,  online: false, isRecommended: false, isVerified: true,  isFeatured: false, tags: ["Verified"],            creator: { name: "Hana",  city: "首尔" },     createdAt: iso(7 * DAY),       popularity: 5890 },
  { id: "v12", title: "旅行 vlog · 清迈一周",     bio: "古城晨跑 + 夜市 + 山间瑜伽。",                              duration: "12:48", cover: img(0,  3), views: 19200, online: true, isRecommended: true,  isVerified: true,  isFeatured: true,  tags: ["Popular", "Verified"], creator: { name: "Joy",   city: "新加坡" },   createdAt: iso(8 * DAY),       popularity: 8930 },
  { id: "v13", title: "短篇电影 · 雨夜",          bio: "黑白短片 · 90 秒 · 独立创作。",                              duration: "1:30",  cover: img(1,  3), views: 6800,  online: false, isRecommended: false, isVerified: true,  isFeatured: false, tags: ["Verified", "New"],     creator: { name: "Iris",  city: "台北" },     createdAt: iso(9 * DAY),       popularity: 5640 },
  { id: "v14", title: "美食制作 · 深夜面食",      bio: "三种亚洲式拌面 · 各 5 分钟出锅。",                          duration: "6:42",  cover: img(2,  3), views: 11200, online: false, isRecommended: false, isVerified: false, isFeatured: false, tags: ["Popular"],             creator: { name: "Saya",  city: "东京" },     createdAt: iso(10 * DAY),      popularity: 6710 },
  { id: "v15", title: "阅读笔记 · 三本必读",      bio: "今年读过最好的三本非虚构 · 推荐顺序。",                       duration: "8:55",  cover: img(3,  3), views: 4800,  online: true,  isRecommended: false, isVerified: true,  isFeatured: false, tags: ["Verified"],            creator: { name: "Rin",   city: "伦敦" },     createdAt: iso(11 * DAY),      popularity: 4520 },
  { id: "v16", title: "街拍 vlog · 首尔江南",     bio: "下午茶 + 江南购物 + Vintage 二手店。",                       duration: "10:12", cover: img(4,  3), views: 13400, online: true,  isRecommended: true,  isVerified: false, isFeatured: false, tags: ["Popular", "New"],      creator: { name: "Eve",   city: "香港" },     createdAt: iso(12 * DAY),      popularity: 7430 },
  { id: "v17", title: "工作日 GRWM",              bio: "8 分钟出门 · 妆容 + 穿搭 + 通勤路上。",                       duration: "8:20",  cover: img(5,  3), views: 7600,  online: false, isRecommended: false, isVerified: true,  isFeatured: false, tags: ["Verified"],            creator: { name: "Mei",   city: "悉尼" },     createdAt: iso(13 * DAY),      popularity: 5120 },
  { id: "v18", title: "旅行准备清单",             bio: "短途 + 长途 · 行李 + 工具 + 药品全清单。",                    duration: "4:36",  cover: img(6,  3), views: 6100,  online: false, isRecommended: false, isVerified: false, isFeatured: false, tags: ["New"],                  creator: { name: "Kana",  city: "胡志明市" }, createdAt: iso(14 * DAY),      popularity: 4120 },
  { id: "v19", title: "自然光肖像拍摄",           bio: "黄金时刻 + 反光板 + 简单后期。",                              duration: "7:50",  cover: img(7,  3), views: 9800,  online: true,  isRecommended: true,  isVerified: true,  isFeatured: true,  tags: ["Verified", "Popular"], creator: { name: "Lina",  city: "马尼拉" },   createdAt: iso(15 * DAY),      popularity: 8120 },
  { id: "v20", title: "早晨咖啡仪式",             bio: "手冲 + 滤泡 + 三种豆子的对比试饮。",                          duration: "5:14",  cover: img(8,  3), views: 5400,  online: false, isRecommended: false, isVerified: true,  isFeatured: false, tags: ["Verified"],            creator: { name: "Liyan", city: "新加坡" },   createdAt: iso(16 * DAY),      popularity: 6320 },
];

// sidebar 分类菜单(显示标签 + 内部 key)
export interface VideoCategoryDef {
  key: VideoCategoryKey;
  label: string;
  desc?: string;
}
export const VIDEO_CATEGORIES: VideoCategoryDef[] = [
  { key: "all",         label: "全部" },
  { key: "recommended", label: "推荐视频" },
  { key: "latest",      label: "最新发布" },
  { key: "popular",     label: "热门内容" },
  { key: "featured",    label: "精选创作者" },
  { key: "verified",    label: "已认证" },
  { key: "online",      label: "在线中" },
];

// 顶部 chip 筛选(用户在 prompt 里列的 5 项)
export const VIDEO_TOP_FILTERS: VideoCategoryDef[] = [
  { key: "recommended", label: "推荐" },
  { key: "latest",      label: "最新" },
  { key: "popular",     label: "热门" },
  { key: "verified",    label: "已认证" },
  { key: "online",      label: "在线中" },
];

export const VIDEO_SORTS: { key: VideoSortKey; label: string }[] = [
  { key: "latest",      label: "最新" },
  { key: "popular",     label: "最受欢迎" },
  { key: "recommended", label: "推荐优先" },
];

// 应用 category 过滤
export function applyCategory(list: VideoEntry[], cat: VideoCategoryKey): VideoEntry[] {
  switch (cat) {
    case "all":         return list;
    case "recommended": return list.filter((v) => v.isRecommended);
    case "latest":      return list; // 只是 sort 维度,不真过滤
    case "popular":     return list; // 同上
    case "featured":    return list.filter((v) => v.isFeatured);
    case "verified":    return list.filter((v) => v.isVerified);
    case "online":      return list.filter((v) => v.online);
    default:            return list;
  }
}

// 应用 sort
export function applySort(list: VideoEntry[], sort: VideoSortKey): VideoEntry[] {
  const out = [...list];
  if (sort === "popular") {
    out.sort((a, b) => b.popularity - a.popularity);
  } else if (sort === "recommended") {
    // 推荐优先:isRecommended 先,然后按 popularity
    out.sort((a, b) => {
      if (a.isRecommended !== b.isRecommended) return a.isRecommended ? -1 : 1;
      return b.popularity - a.popularity;
    });
  } else {
    out.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
  return out;
}
