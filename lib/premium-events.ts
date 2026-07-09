// 高端活动定制 · 5 场景数据 (server-safe)
import { pick } from "@/lib/images";

export type EventKey = "yacht" | "cocktail" | "photoshoot" | "business" | "members-club";

export interface PremiumEvent {
  key: EventKey;
  title: string;
  titleEn: string;
  tagline: string;
  description: string;
  fits: string[];
  matchTraits: string[];
  coverImage: string;
  budgetFrom: string;   // "S$ 2,500 起"
  budgetDuration: string;
}

export const premiumEvents: PremiumEvent[] = [
  {
    key: "yacht",
    title: "游艇派对",
    titleEn: "Yacht Party",
    tagline: "出海派对 · 香槟聚会 · 私人船上社交",
    description:
      "适合出海派对、香槟聚会、私人船上社交和高端朋友局。平台可根据语言、气质、穿搭风格、城市和活动人数,推荐适合出席的 sugargirl。",
    fits: ["出海派对", "游艇生日", "香槟社交", "小型私人局", "旅行拍摄"],
    matchTraits: ["会拍照", "会社交", "形象好", "语言沟通自然", "有视频资料优先"],
    coverImage: pick(3, 50) ?? "/images/placeholder.png",
    budgetFrom: "S$ 2,500 起",
    budgetDuration: "半天 / 全天",
  },
  {
    key: "cocktail",
    title: "高端酒会",
    titleEn: "Luxury Cocktail Night",
    tagline: "品牌活动 · 投资人聚会 · Rooftop Champagne Night",
    description:
      "适合品牌活动、社交酒会、投资人聚会、酒店 bar、rooftop champagne night 和私人 networking 场景。平台可为你推荐气质得体、边界清晰、适合高端社交场合的 sugargirl。",
    fits: ["高端酒会", "品牌发布会", "酒店酒吧", "Rooftop Party", "小型 Networking"],
    matchTraits: ["气质成熟", "英语沟通好", "懂礼仪", "适合公开社交", "认证资料完整"],
    coverImage: pick(11, 90) ?? "/images/placeholder.png",
    budgetFrom: "S$ 1,200 起",
    budgetDuration: "1 晚",
  },
  {
    key: "photoshoot",
    title: "私人拍摄",
    titleEn: "Private Photoshoot",
    tagline: "私人写真 · 高端街拍 · 酒店 Lifestyle Shoot",
    description:
      "适合私人写真、生活方式拍摄、街拍、酒店场景拍摄、旅行内容记录和社交媒体素材。平台可根据拍摄风格、城市、服装、摄影师和内容边界推荐合适的 sugargirl。",
    fits: ["私人写真", "高端街拍", "酒店 Lifestyle Shoot", "旅行拍摄", "视频内容合作"],
    matchTraits: ["镜头感好", "主页照片质量高", "有拍摄经验", "形象风格匹配", "可提前视频确认"],
    coverImage: pick(7, 120) ?? "/images/placeholder.png",
    budgetFrom: "S$ 680 起",
    budgetDuration: "3 小时",
  },
  {
    key: "business",
    title: "商务伴游",
    titleEn: "Business Companion",
    tagline: "商务旅行 · 客户晚宴 · 会议后社交",
    description:
      "适合商务旅行、客户晚宴、会议后社交、酒店晚餐、城市短暂停留和高端商务陪同。平台可根据城市、语言、时间、着装要求和社交属性推荐更合适的 sugargirl。",
    fits: ["商务晚宴", "会议后社交", "酒店晚餐", "商务旅行", "城市短暂停留"],
    matchTraits: ["沟通自然", "懂边界", "时间配合度高", "语言能力强", "认证优先"],
    coverImage: pick(15, 160) ?? "/images/placeholder.png",
    budgetFrom: "S$ 1,200 起",
    budgetDuration: "半天起",
  },
  {
    key: "members-club",
    title: "会员俱乐部之夜",
    titleEn: "Members' Club Night",
    tagline: "Mayfair · Soho · Kensington · 会员俱乐部与私人 Lounge",
    description:
      "适合 Mayfair、Soho、Kensington 等会员俱乐部、私人 lounge、雪茄吧、鸡尾酒夜和高端熟人局。平台可根据场合调性、穿搭风格、语言和社交氛围推荐合适的 sugargirl。",
    fits: ["会员俱乐部", "私人 Lounge", "雪茄吧", "高端熟人局", "深夜轻社交"],
    matchTraits: ["气质安静", "穿搭高级", "低调自然", "尊重隐私", "适合成熟社交"],
    coverImage: pick(19, 200) ?? "/images/placeholder.png",
    budgetFrom: "S$ 680 起",
    budgetDuration: "2 小时起",
  },
];

export function getEvent(key: EventKey): PremiumEvent | undefined {
  return premiumEvents.find((e) => e.key === key);
}
