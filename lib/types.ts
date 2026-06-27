export type Tier = "basic" | "pro" | "elite";

export interface Channel { slug: string; label: string; flag?: "live" | "ai"; }
export interface Creator {
  slug: string; name: string; category: string; specialty: string;
  region: string; price: string; tier: Tier; subs: string; followers: string; works: string;
}
export interface Work { id: string; title: string; author: string; category: string; }
export interface LiveItem { slug: string; name: string; title: string; viewers: string; }
export interface Post { id: string; author: string; time: string; text: string; image: boolean; likes: string; comments: string; }
