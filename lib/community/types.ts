// 私语广场 · 数据类型
// P0: mock-only · in-memory · 后续可映射到 Prisma schema

export type CommunityContentType = "story" | "question";

export type CommunityAuthorType = "user" | "sugargirl" | "sugarboy" | "staff";

export type CommunityStatus =
  | "draft" | "pending_review" | "published" | "limited" | "hidden" | "removed";

// 反应类型 · 故事使用前 4 · 问题使用有帮助
export type CommunityReaction =
  | "empathy"          // 同感
  | "hug"              // 抱抱
  | "insight"          // 有启发
  | "want-more"        // 想听后续
  | "helpful";         // 有帮助 (问答)

export interface CommunityPollOption {
  id: string;
  label: string;
  voteCount: number;
}

export interface CommunityPost {
  id: string;
  slug: string;
  contentType: CommunityContentType;
  title: string;
  body: string;                // Markdown-ish 纯文本
  excerpt?: string;
  authorId: string;
  authorName?: string;         // 匿名时不显示
  authorAvatar?: string;
  authorType?: CommunityAuthorType;
  isAnonymous: boolean;
  status: CommunityStatus;
  tags: string[];
  images?: string[];
  pollOptions?: CommunityPollOption[];
  reactionCounts: Partial<Record<CommunityReaction, number>>;
  viewCount: number;
  commentCount: number;
  answerCount: number;         // question 专用
  followerCount?: number;
  acceptedAnswerId?: string;
  seoIndexable: boolean;
  createdAt: string;           // ISO
  updatedAt: string;
}

export interface CommunityTag {
  slug: string;
  label: string;
  color?: string;
  storyCount: number;
  questionCount: number;
}

export interface CommunityAuthor {
  id: string;
  name: string;
  avatar?: string;
  type: CommunityAuthorType;
  bio?: string;
  isVerified?: boolean;
}

// 用于卡片展示的精简结构 · 服务端拼装后传给客户端
export interface CommunityListItem {
  post: CommunityPost;
  author?: CommunityAuthor;      // 匿名时会被清洗
  topReactionCount: number;      // 排名用
  hotnessDelta?: "up" | "down" | "flat";
}
