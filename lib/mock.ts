import { Channel, Creator, Work, LiveItem, Post } from "./types";

// 所有频道入口（导航 + 路由）
// 注: URL slug 保留旧值(不破坏既有链接),只改 label
export const channels: Channel[] = [
  { slug: "photography",  label: "动态推荐" },
  { slug: "video",        label: "视频专区" },
  { slug: "art-services", label: "专属服务", children: [
    { slug: "dating",     label: "约会" },
    { slug: "travel",     label: "旅游" },
    { slug: "shoot",      label: "拍摄" },
    { slug: "video-chat", label: "视频聊天" },
  ]},
  { slug: "male-artists", label: "SugarGirl" },
  { slug: "ai-artists",   label: "AI艺术家", flag: "ai" },
  { slug: "live",         label: "直播平台", flag: "live" },
  { slug: "community",    label: "社区" },
];

export const regions = ["新加坡", "香港", "台北", "吉隆坡", "曼谷", "首尔", "东京", "伦敦", "悉尼", "马尼拉", "胡志明市"];
export const sorts = ["推荐", "最新", "最热", "订阅最多"];

const tierLabel: Record<string, string> = { basic: "入门", pro: "进阶", elite: "Elite" };
export function tierText(t: string) { return tierLabel[t] ?? t; }

export const creators: Creator[] = [
  { slug: "linxia", name: "林夏", category: "动态推荐", specialty: "山海风光", region: "香港", price: "S$6", tier: "elite", subs: "1,240", followers: "8.6万", works: "312" },
  { slug: "sunian", name: "苏念", category: "动态推荐", specialty: "城市风景", region: "香港", price: "S$12", tier: "elite", subs: "920", followers: "5.1万", works: "204" },
  { slug: "chenyu", name: "陈屿", category: "视频专区", specialty: "夜景延时", region: "香港", price: "S$8", tier: "pro", subs: "860", followers: "4.4万", works: "176" },
  { slug: "aria", name: "Aria", category: "动态推荐", specialty: "黑白纪实", region: "香港", price: "S$5", tier: "pro", subs: "540", followers: "2.8万", works: "98" },
  { slug: "zhouye", name: "周野", category: "视频专区", specialty: "旅拍风景", region: "香港", price: "S$6", tier: "basic", subs: "410", followers: "2.1万", works: "120" },
  { slug: "maidi", name: "麦地", category: "动态推荐", specialty: "街头街景", region: "香港", price: "S$7", tier: "pro", subs: "680", followers: "3.3万", works: "210" },
  { slug: "heyutong", name: "何雨桐", category: "动态推荐", specialty: "极简风光", region: "香港", price: "S$5", tier: "basic", subs: "300", followers: "1.6万", works: "76" },
  { slug: "kenji", name: "Kenji", category: "视频专区", specialty: "雪山风景", region: "香港", price: "S$9", tier: "pro", subs: "520", followers: "3.0万", works: "140" },
];

export const works: Work[] = [
  { id: "w1", title: "雨后的海岸", author: "林夏", category: "动态推荐" },
  { id: "w2", title: "霓虹与雨", author: "陈屿", category: "视频专区" },
  { id: "w3", title: "清晨的山", author: "苏念", category: "动态推荐" },
  { id: "w4", title: "黑白海岸", author: "Aria", category: "动态推荐" },
  { id: "w5", title: "山顶黄昏", author: "林夏", category: "动态推荐" },
  { id: "w6", title: "公路尽头", author: "周野", category: "视频专区" },
  { id: "w7", title: "雾中森林", author: "麦地", category: "动态推荐" },
  { id: "w8", title: "湖与天", author: "何雨桐", category: "动态推荐" },
  { id: "w9", title: "雪山之巅", author: "Kenji", category: "视频专区" },
  { id: "w10", title: "日落港湾", author: "陈屿", category: "视频专区" },
];

export const liveNow: LiveItem[] = [
  { slug: "linxia", name: "林夏", title: "山海风光直播", viewers: "1.2k" },
  { slug: "sunian", name: "苏念", title: "城市风景答疑", viewers: "860" },
  { slug: "chenyu", name: "陈屿", title: "夜景长曝实拍", viewers: "2.4k" },
  { slug: "aria", name: "Aria", title: "旅拍纪实分享", viewers: "540" },
  { slug: "zhouye", name: "周野", title: "公路风景后期", viewers: "1.8k" },
  { slug: "maidi", name: "麦地", title: "街景扫拍直播", viewers: "720" },
];

export const posts: Post[] = [
  { id: "p1", author: "林夏", time: "2 小时前", text: "整理了一组在西贡拍的海岸线，订阅区更新了完整版与拍摄参数。", image: true, likes: "128", comments: "24" },
  { id: "p2", author: "周野", time: "5 小时前", text: "公路旅拍第 14 站，今天的光线很难等，分享几张直出。", image: true, likes: "86", comments: "12" },
  { id: "p3", author: "Aria", time: "昨天", text: "关于黑白纪实的后期思路，写了一篇长文，欢迎讨论。", image: false, likes: "203", comments: "41" },
];

export function getCreator(slug: string): Creator {
  return creators.find((c) => c.slug === slug) ?? creators[0];
}
