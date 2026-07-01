// Feed 模块通用类型
export type MediaKind = "image" | "video";

export interface FeedMedia {
  type: MediaKind;
  src: string;
  ratio?: string; // e.g. "16/9" "1/1"
}

export type FeedTabKey = "for-you" | "following" | "nearby" | "vip" | "newest";

export interface FeedTabDef {
  key: FeedTabKey;
  label: string;
}

export interface FeedAuthor {
  name: string;
  handle: string;       // 比如 "@linxia"
  avatar: string;       // 头像图 URL
  verified?: boolean;
}

export interface FeedPost {
  id: string;
  author: FeedAuthor;
  authorSlug?: string;    // 供 <Link href=/creators/{slug}> 用
  authorCity?: string;    // Nearby filter + 展示
  authorOnline?: boolean; // online dot
  createdAt: string;
  text?: string;
  media: FeedMedia[];
  isVip: boolean;
  stats: {
    likes: number;
    comments: number;
    shares: number;
    views: number;
  };
}

export interface CreatorProfile {
  name: string;
  handle: string;
  avatar: string;
  cover: string;
  bio: string;
  online: boolean;
  stats: {
    followers: number;
    following: number;
    likes: number;
  };
}

export interface SidebarSuggestion {
  name: string;
  handle: string;
  avatar: string;
  bio: string;
}
