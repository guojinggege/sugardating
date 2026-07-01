// Creator Profile 主页用占位数据生成器
// 从 slug 派生 deterministic 偏移,保证同一创作者每次访问的图/数据/posts 不变
// 真实素材接入后,把这里换成 DB query 即可

import { pick } from "@/lib/images";

export interface FeedPost {
  id: string;
  time: string;            // 相对时间,中文
  text: string;
  images: string[];        // 0/1/3/9 张
  videoCover?: string;     // 视频帖
  likes: number;
  comments: number;
}

export interface VideoItem {
  id: string;
  title: string;
  cover: string;
  duration: string;        // mm:ss
  views: number;
  daysAgo: number;
}

export interface GalleryItem {
  id: string;
  src: string;
  alt: string;
  category: "旅行" | "时尚" | "拍摄" | "生活";
}

export interface ServiceItem {
  key: "dating" | "travel" | "shoot" | "video-chat";
  price: string;
  duration: string;
}

function hashSlug(slug: string): number {
  let h = 0;
  for (let i = 0; i < slug.length; i++) h = (h * 31 + slug.charCodeAt(i)) | 0;
  return Math.abs(h);
}

// 一组占位 post 文案 — 中文
const POST_TEXTS = [
  "周末跑去看了一场独立摄影展,胶片质感真的难以替代。配几张展厅顺手拍的。",
  "整理了最近半年的旅行底片,选了几张最喜欢的。",
  "今天在城里走了 18 公里,腿快废了但拍到了想要的光。",
  "新拍的一组,主题是「黄昏的窗」。后期非常克制。",
  "推荐一首歌:Khruangbin · A Calf Born in Winter。配雨天最对。",
  "本周开始接受 1v1 视频咨询,详情看主页服务,欢迎来聊。",
  "尝试了一种新的曝光手法,色彩的层次比之前更柔和。",
  "去清迈住了两周,带回来一些慢节奏的画面。",
];

const VIDEO_TITLES = [
  "海岸线慢动作 · 4K",
  "城市夜景 · 长曝时延",
  "雨后窗景 · 胶片质感",
  "工作室开箱 · 拍摄日常",
  "周末旅行 vlog · 海岛三日",
  "光影实验 · 黄昏的影子",
];

const GALLERY_CATS: GalleryItem["category"][] = ["旅行", "时尚", "拍摄", "生活"];

const SERVICE_KEYS: ServiceItem["key"][] = ["dating", "travel", "shoot", "video-chat"];
const SERVICE_PRICE = {
  dating:       { price: "S$ 280 起",  duration: "2 小时" },
  travel:       { price: "S$ 1,200 起", duration: "1 天" },
  shoot:        { price: "S$ 680 起",  duration: "3 小时" },
  "video-chat": { price: "S$ 48 起",   duration: "30 分钟" },
};

export function makeFeed(slug: string): FeedPost[] {
  const off = hashSlug(slug);
  const times = ["2 小时前", "5 小时前", "昨天", "2 天前", "3 天前", "5 天前", "1 周前", "2 周前"];
  return POST_TEXTS.map((text, i) => {
    const imgCount = i % 4 === 0 ? 9 : i % 3 === 0 ? 3 : i % 5 === 1 ? 1 : 0;
    const images: string[] = [];
    for (let k = 0; k < imgCount; k++) {
      images.push(pick(i * 3 + k, off + 2) ?? "");
    }
    return {
      id: `${slug}-p${i + 1}`,
      time: times[i] ?? "更早",
      text,
      images: images.filter(Boolean),
      videoCover: i === 2 ? pick(i + 8, off + 5) ?? undefined : undefined,
      likes: 120 + ((off + i * 37) % 880),
      comments: 4 + ((off + i * 13) % 38),
    };
  });
}

export function makeVideos(slug: string): VideoItem[] {
  const off = hashSlug(slug);
  return VIDEO_TITLES.map((title, i) => ({
    id: `${slug}-v${i + 1}`,
    title,
    cover: pick(i + 5, off + 7) ?? "",
    duration:
      i === 0 ? "01:42" :
      i === 1 ? "03:18" :
      i === 2 ? "00:58" :
      i === 3 ? "02:24" :
      i === 4 ? "05:36" : "01:12",
    views: 1200 + ((off + i * 71) % 8400),
    daysAgo: (i + 1) * 3,
  }));
}

export function makeGallery(slug: string): GalleryItem[] {
  const off = hashSlug(slug);
  const items: GalleryItem[] = [];
  for (let i = 0; i < 12; i++) {
    items.push({
      id: `${slug}-g${i + 1}`,
      src: pick(i, off + 3) ?? "",
      alt: `作品 ${i + 1}`,
      category: GALLERY_CATS[i % GALLERY_CATS.length],
    });
  }
  return items;
}

export function makeServices(): ServiceItem[] {
  return SERVICE_KEYS.map((k) => ({
    key: k,
    price: SERVICE_PRICE[k].price,
    duration: SERVICE_PRICE[k].duration,
  }));
}

// 统计派生
export interface CreatorStatsData {
  followers: number;
  following: number;
  posts: number;
  videos: number;
  photos: number;
  saved: number;
  joinedAt: string;          // YYYY-MM
  completion: number;        // 0-100
}

export function deriveStats(slug: string, subs: string, followers: string, works: string): CreatorStatsData {
  const off = hashSlug(slug);
  const fmtNum = (s: string) => {
    if (s.endsWith("万")) return Math.round(parseFloat(s) * 10000);
    return parseInt(s.replace(/,/g, ""), 10) || 0;
  };
  const posts = 8;
  const videos = 6;
  const photos = 12;
  return {
    followers: fmtNum(followers),
    following: 80 + (off % 220),
    posts,
    videos,
    photos,
    saved: 30 + (off % 80),
    joinedAt: ["2024-08", "2024-11", "2025-02", "2025-05", "2025-09"][off % 5],
    completion: 70 + (off % 30),
  };
}

// Availability + trust 数据 (sidebar 顶部信任信号)
export interface AvailabilityData {
  isOnline: boolean;
  lastActiveText: string;
  responseRate: number;
  replyMinutes: number;
  completedDates: number;
  memberSince: string;
  identityVerified: boolean;
}

export function deriveAvailability(slug: string, memberSince: string, opts?: { online?: boolean }): AvailabilityData {
  const off = hashSlug(slug);
  const isOnline = opts?.online ?? (off % 3 !== 0);
  const responseRate = 90 + (off % 10);           // 90-99
  const replyMinutes = 5 + (off % 55);            // 5-59
  const completedDates = 40 + (off % 400);        // 40-440
  const lastHours = 1 + (off % 24);
  return {
    isOnline,
    lastActiveText: isOnline ? "" : `${lastHours}h`,
    responseRate,
    replyMinutes,
    completedDates,
    memberSince,
    identityVerified: true,
  };
}

// Trust flags
export interface TrustFlags {
  identity: boolean;
  phone: boolean;
  email: boolean;
  video: boolean;
  face: boolean;
  safeMeet: boolean;
}
export function deriveTrust(slug: string): TrustFlags {
  const off = hashSlug(slug);
  return {
    identity: true,
    phone: true,
    email: true,
    video: (off % 5) !== 0,
    face: (off % 4) !== 0,
    safeMeet: (off % 3) !== 0,
  };
}

// Travel Plan
export interface TravelData {
  currentCity: string;
  upcoming: { city: string; date: string }[];
  wishList: string[];
  favRestaurants: string[];
  favHotels: string[];
  favActivities: string[];
}
export function deriveTravel(slug: string, region: string): TravelData {
  const off = hashSlug(slug);
  const cityPool = ["东京", "首尔", "巴厘岛", "曼谷", "巴黎", "米兰", "伦敦", "洛杉矶", "迪拜"];
  const wishPool = ["京都", "圣托里尼", "冰岛", "马尔代夫", "开普敦", "秘鲁"];
  const restPool = ["Amber (Hong Kong)", "Odette (Singapore)", "Sushi Saito (Tokyo)", "Central (Lima)"];
  const hotelPool = ["Aman Tokyo", "The Peninsula", "Rosewood", "Six Senses"];
  const actPool = ["Yoga", "Sailing", "Fine Dining", "Wine Tasting", "Gallery Hop", "Beach Day", "Ski"];
  const monthOff = ["Mar 2026", "Apr 2026", "May 2026", "Jun 2026", "Jul 2026"];
  const pick = <T,>(arr: T[], n: number, salt: number) => {
    const r: T[] = [];
    for (let i = 0; i < n; i++) r.push(arr[(off + i * 3 + salt) % arr.length]);
    return Array.from(new Set(r));
  };
  return {
    currentCity: region,
    upcoming: [0, 1, 2].map((i) => ({
      city: cityPool[(off + i * 7) % cityPool.length],
      date: monthOff[i % monthOff.length],
    })),
    wishList: pick(wishPool, 4, 11),
    favRestaurants: pick(restPool, 3, 5),
    favHotels: pick(hotelPool, 3, 8),
    favActivities: pick(actPool, 5, 13),
  };
}

// Timeline events
export interface TimelineEvent {
  type: "online" | "update" | "travel" | "post";
  text: string;
  time: string;
}
export function deriveTimeline(slug: string, currentCity: string): TimelineEvent[] {
  const off = hashSlug(slug);
  return [
    { type: "online", text: "刚刚上线,准备好回复消息",             time: "2 分钟前" },
    { type: "post",   text: "更新了新的动态 · 分享本周旅拍",         time: "3 小时前" },
    { type: "travel", text: `本周前往 ${["东京","首尔","巴厘岛","曼谷"][off % 4]}`, time: "昨天" },
    { type: "update", text: `更新了资料 · 新增服务类型`,             time: "2 天前" },
    { type: "post",   text: `从 ${currentCity} 出发的旅行照`,        time: "5 天前" },
  ];
}

// 派生额外统计 (likes / gifts / rating)
export function deriveExtraStats(slug: string, popularity?: number): { likes: number; gifts: number; rating: number } {
  const off = hashSlug(slug);
  const base = popularity ?? 5000;
  return {
    likes: Math.round(base * 3 + (off % 5000)),
    gifts: 800 + (off % 4200),
    rating: 4.85 + ((off % 15) / 100),   // 4.85 - 4.99
  };
}

// 关于 Ta 区块 — 完整 Basic Info + Interests + Travel + Availability
export interface CreatorAbout {
  bio: string;
  interests: string[];
  languages: string[];
  city: string;
  frequentCountries: string[];
  travelPlans: string[];
  joinedAt: string;
  // 扩展 Basic Info (per spec V2)
  weight: number;             // kg
  hairColor: string;
  eyeColor: string;
  bodyType: string;
  skinTone: string;
  birthCountry: string;
  zodiac: string;
  bloodType: string;
  education: string;
}

const HAIR_COLORS   = ["黑色", "棕色", "深棕", "栗色", "亚麻色", "金色"];
const EYE_COLORS    = ["黑色", "深棕色", "棕色", "琥珀色", "灰色"];
const BODY_TYPES    = ["纤细", "标准", "运动型", "曲线"];
const SKIN_TONES    = ["白皙", "自然", "小麦色", "浅古铜"];
const BIRTH_COUNTRIES = ["中国", "日本", "韩国", "新加坡", "马来西亚", "泰国", "越南", "菲律宾", "俄罗斯", "乌克兰", "波兰"];
const ZODIACS       = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];
const BLOOD_TYPES   = ["A", "B", "AB", "O"];
const EDUCATIONS    = ["Bachelor", "Master", "PhD", "College"];

export function deriveAbout(slug: string, baseBio: string, region: string, joinedAt: string): CreatorAbout {
  const off = hashSlug(slug);
  const interestsPool = ["旅行", "摄影", "阅读", "电影", "咖啡", "美食", "音乐", "健身", "时尚", "Luxury"];
  const langPool = ["中文", "English", "日本語", "한국어", "ภาษาไทย"];
  const countryPool = ["日本", "韩国", "泰国", "新加坡", "马来西亚", "意大利", "法国", "英国", "美国"];
  const planPool = ["东京 · 2026 春", "巴厘岛 · 旅拍 5 天", "首尔 · 摄影周", "巴黎 · 冬季", "新加坡 · 长居"];
  const pickN = <T,>(arr: T[], n: number, salt: number): T[] => {
    const r: T[] = [];
    for (let i = 0; i < n; i++) r.push(arr[(off + i * 7 + salt) % arr.length]);
    return Array.from(new Set(r));
  };
  return {
    bio: baseBio || "热爱生活与摄影 · 长期分享旅行 vlog 与日常 · 慢节奏",
    interests: pickN(interestsPool, 8, 0),
    languages: pickN(langPool, 2, 11),
    city: region,
    frequentCountries: pickN(countryPool, 3, 23),
    travelPlans: pickN(planPool, 3, 31),
    joinedAt,
    weight:       45 + (off % 15),                          // 45-59 kg
    hairColor:    HAIR_COLORS[off % HAIR_COLORS.length],
    eyeColor:     EYE_COLORS[(off * 3) % EYE_COLORS.length],
    bodyType:     BODY_TYPES[(off * 5) % BODY_TYPES.length],
    skinTone:     SKIN_TONES[(off * 7) % SKIN_TONES.length],
    birthCountry: BIRTH_COUNTRIES[off % BIRTH_COUNTRIES.length],
    zodiac:       ZODIACS[(off * 11) % ZODIACS.length],
    bloodType:    BLOOD_TYPES[(off * 13) % BLOOD_TYPES.length],
    education:    EDUCATIONS[(off * 17) % EDUCATIONS.length],
  };
}
