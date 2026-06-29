// /photography 信息流的占位数据源
// 真正接 DB 之前先用 mock,但作者头像 + 媒体图全部走 public/images 里的真图
// 写在 lib/ 而不是 components/Feed/ 因为以后会被 server action 替换
import type { FeedPost, CreatorProfile, SidebarSuggestion } from "@/components/Feed/types";
import { pick, photos } from "@/lib/images";

const HOURS = 60 * 60 * 1000;
const DAYS = 24 * HOURS;
const NOW = Date.now();

function iso(offsetMs: number): string {
  return new Date(NOW - offsetMs).toISOString();
}

// 主创作者(动态推荐页的归属创作者,先固定一个)
export const featuredCreator: CreatorProfile = {
  name: "林夏",
  handle: "@linxia",
  avatar: pick(0, 17) ?? "/images/placeholder.png",
  cover: pick(1, 0) ?? "/images/placeholder.png",
  bio: "山海风光摄影 · 偶尔旅拍 · 香港 / 新加坡两地。订阅区每周更新一组完整图集与拍摄手记。",
  online: true,
  stats: {
    followers: 86400,
    following: 312,
    likes: 1248000,
  },
};

// 16 条 mock posts — 文字 / 单图 / 多图 / 视频 / VIP 混着,作者都是 featuredCreator
const author = {
  name: featuredCreator.name,
  handle: featuredCreator.handle,
  avatar: featuredCreator.avatar,
  verified: true,
};

// 把 photos 切片当媒体源,offset 用来错开重复
function media(count: number, offset: number, ratio = "16/9"): { type: "image"; src: string; ratio: string }[] {
  if (photos.length === 0) return [];
  return Array.from({ length: count }, (_, i) => ({
    type: "image" as const,
    src: pick(i, offset)!,
    ratio,
  }));
}

function videoOne(offset: number): { type: "video"; src: string; ratio: string }[] {
  if (photos.length === 0) return [];
  return [{ type: "video", src: pick(0, offset)!, ratio: "16/9" }];
}

export const feedPosts: FeedPost[] = [
  {
    id: "f1",
    author,
    createdAt: iso(2 * HOURS),
    text: "新加坡的雨季,清晨的海湾静得像玻璃。今天用 35mm 拍的一张,几乎没动后期。",
    media: media(1, 3, "16/9"),
    isVip: false,
    stats: { likes: 2340, comments: 124, shares: 18, views: 18900 },
  },
  {
    id: "f2",
    author,
    createdAt: iso(5 * HOURS),
    text: "终于把上周在 Domaine 拍的一组整理出来了。光是真好,模特也很配合。完整版在 VIP 区。",
    media: media(2, 5, "1/1"),
    isVip: false,
    stats: { likes: 1890, comments: 96, shares: 32, views: 14200 },
  },
  {
    id: "f3",
    author,
    createdAt: iso(9 * HOURS),
    text: "周末分享:三张试机片,新到的 Voigtlander 50mm 1.5。色彩比预期好,但脱焦的二线性还是有的。",
    media: media(3, 0, "1/1"),
    isVip: false,
    stats: { likes: 1234, comments: 78, shares: 12, views: 9800 },
  },
  {
    id: "f4",
    author,
    createdAt: iso(14 * HOURS),
    text: "夜景延时片段,凌晨四点到五点半。完整 1 分 30 秒在 VIP 区,4K。",
    media: videoOne(7),
    isVip: false,
    stats: { likes: 3120, comments: 187, shares: 78, views: 32400 },
  },
  {
    id: "f5",
    author,
    createdAt: iso(1 * DAYS + 2 * HOURS),
    text: "VIP 专享 · 这一组是上周末私拍,16 张高清未发布。需要 Elite 及以上订阅。",
    media: media(1, 9, "1/1"),
    isVip: true,
    stats: { likes: 4560, comments: 290, shares: 12, views: 28000 },
  },
  {
    id: "f6",
    author,
    createdAt: iso(1 * DAYS + 8 * HOURS),
    text: "整理硬盘翻出来的旧片,2024 年在台北的几天。胶片质感是后期叠加的。",
    media: media(6, 2, "1/1"),
    isVip: false,
    stats: { likes: 876, comments: 54, shares: 6, views: 7200 },
  },
  {
    id: "f7",
    author,
    createdAt: iso(2 * DAYS),
    text: "答几个常被问的问题:1) 我用 X-T5。2) 主力 23mm 1.4 + 35mm 1.4。3) 后期 Capture One,色彩比 LR 厚。",
    media: [],
    isVip: false,
    stats: { likes: 612, comments: 143, shares: 27, views: 5600 },
  },
  {
    id: "f8",
    author,
    createdAt: iso(2 * DAYS + 6 * HOURS),
    text: "刚回到香港。机场外的雨。",
    media: media(3, 4, "1/1"),
    isVip: false,
    stats: { likes: 1456, comments: 88, shares: 15, views: 10800 },
  },
  {
    id: "f9",
    author,
    createdAt: iso(3 * DAYS),
    text: "VIP · 拍摄手记 + 全套原图(共 24 张) — 西贡黄昏。底片色彩还原全部记录。",
    media: videoOne(10),
    isVip: true,
    stats: { likes: 5430, comments: 312, shares: 24, views: 41200 },
  },
  {
    id: "f10",
    author,
    createdAt: iso(3 * DAYS + 10 * HOURS),
    text: "试一下 Sigma 40mm f1.4 Art,体积是大,但解析力非常顶。",
    media: media(1, 1, "16/9"),
    isVip: false,
    stats: { likes: 765, comments: 41, shares: 8, views: 6300 },
  },
  {
    id: "f11",
    author,
    createdAt: iso(4 * DAYS),
    text: "周末小展览的几张作品,实物展示和屏幕看完全不同。",
    media: media(4, 6, "1/1"),
    isVip: false,
    stats: { likes: 1023, comments: 67, shares: 14, views: 8400 },
  },
  {
    id: "f12",
    author,
    createdAt: iso(4 * DAYS + 6 * HOURS),
    text: "VIP · 一组私房风格的实验,光影比构图更重要。",
    media: media(1, 8, "1/1"),
    isVip: true,
    stats: { likes: 3987, comments: 254, shares: 18, views: 24500 },
  },
  {
    id: "f13",
    author,
    createdAt: iso(5 * DAYS),
    text: "新加坡 Marina Bay 的清晨。",
    media: media(1, 2, "16/9"),
    isVip: false,
    stats: { likes: 1234, comments: 56, shares: 11, views: 9200 },
  },
  {
    id: "f14",
    author,
    createdAt: iso(5 * DAYS + 9 * HOURS),
    text: "整组 9 张,今年最满意的一次约拍。模特非常松弛。",
    media: media(9, 0, "1/1"),
    isVip: false,
    stats: { likes: 2789, comments: 178, shares: 42, views: 21300 },
  },
  {
    id: "f15",
    author,
    createdAt: iso(6 * DAYS),
    text: "Vlog · 一天的工作流,从堪景到现场到回家选片。",
    media: videoOne(4),
    isVip: false,
    stats: { likes: 1876, comments: 132, shares: 56, views: 18900 },
  },
  {
    id: "f16",
    author,
    createdAt: iso(7 * DAYS),
    text: "最后一张,周末愉快。下周会更新一组海岸线。",
    media: media(1, 6, "16/9"),
    isVip: false,
    stats: { likes: 943, comments: 38, shares: 9, views: 7100 },
  },
];

// 右侧 sidebar 推荐
export const sidebarSuggestions: SidebarSuggestion[] = [
  {
    name: "苏念",
    handle: "@sunian",
    avatar: pick(2, 11) ?? "/images/placeholder.png",
    bio: "城市风景 · 香港",
  },
  {
    name: "陈屿",
    handle: "@chenyu",
    avatar: pick(3, 14) ?? "/images/placeholder.png",
    bio: "夜景延时 · 视频",
  },
  {
    name: "Aria",
    handle: "@aria",
    avatar: pick(4, 8) ?? "/images/placeholder.png",
    bio: "黑白纪实",
  },
  {
    name: "麦地",
    handle: "@maidi",
    avatar: pick(5, 2) ?? "/images/placeholder.png",
    bio: "街头街景",
  },
];

export const sidebarHotCreators: SidebarSuggestion[] = [
  {
    name: "Kenji",
    handle: "@kenji",
    avatar: pick(6, 5) ?? "/images/placeholder.png",
    bio: "雪山风景 · 视频",
  },
  {
    name: "周野",
    handle: "@zhouye",
    avatar: pick(7, 3) ?? "/images/placeholder.png",
    bio: "旅拍风景 · 视频",
  },
  {
    name: "苏白",
    handle: "@subai",
    avatar: pick(8, 9) ?? "/images/placeholder.png",
    bio: "AI 人像",
  },
];
