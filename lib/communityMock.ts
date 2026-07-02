// 互动社区 mock — 分类 / 帖子 / 话题 / 会员
// 内容基调:情绪/职场/关系/独居/深夜话题,克制、不色情、Reddit-like
// 所有数据 deterministic,后续接入 DB 时替换 mock 层即可

export type CommunityColor = "pink" | "purple" | "gold" | "cyan" | "amber" | "emerald" | "rose" | "indigo";

export interface CommunityCategory {
  id: string;
  name: string;
  slug: string;
  color: CommunityColor;
  isHot?: boolean;
  onlineCount?: number;
}

export type PostType = "text" | "image" | "video" | "poll" | "link";
export type PostBadge = "hot" | "adult" | "anonymous" | "poll" | "official" | "creator";

export interface PollOption { id: string; text: string; votes: number }

export interface CommunityPost {
  id: string;
  communityId: string;
  communityName: string;
  communityColor: CommunityColor;
  author: string;
  authorAvatar?: string;
  createdAt: string;         // "2h" / "刚刚"
  title: string;
  body?: string;
  type: PostType;
  badges: PostBadge[];
  tags: string[];
  score: number;
  commentsCount: number;
  roomCount?: number;        // 在线房间人数
  sharesCount: number;
  poll?: {
    question: string;
    options: PollOption[];
    totalVotes: number;
  };
}

export interface TrendingTopic {
  rank: number;
  title: string;
  badge?: "NEW" | "热" | "+188%" | "+612%" | "+322%";
}

// ─── 我加入的社区 ──────────────────────────────────
export const myCommunities: CommunityCategory[] = [
  { id: "emo",       name: "今天也 emo 了", slug: "emo",       color: "pink",    isHot: true,  onlineCount: 3420 },
  { id: "moodtree",  name: "情绪树洞",     slug: "moodtree",  color: "purple",  onlineCount: 2180 },
  { id: "love",      name: "两性关系",     slug: "love",      color: "rose",    isHot: true,  onlineCount: 5610 },
  { id: "workrant",  name: "职场吐槽",     slug: "workrant",  color: "amber",   onlineCount: 1980 },
  { id: "night",     name: "熬夜俱乐部",   slug: "night",     color: "indigo",  onlineCount: 890 },
  { id: "solo",      name: "独居生活",     slug: "solo",      color: "cyan",    onlineCount: 1240 },
];

// ─── 发现专区 ──────────────────────────────────────
export const discoverCommunities: CommunityCategory[] = [
  { id: "loveadvice", name: "恋爱军师团",   slug: "loveadvice", color: "rose",    isHot: true },
  { id: "buddies",    name: "搭子广场",     slug: "buddies",    color: "cyan"  },
  { id: "over30",     name: "30+人生",     slug: "over30",     color: "gold"  },
  { id: "wine",       name: "微醺小酒馆",   slug: "wine",       color: "amber" },
  { id: "whisper",    name: "匿名悄悄室",   slug: "whisper",    color: "purple" },
];

// ─── 右侧今晚在聊 ──────────────────────────────────
export const trendingTopics: TrendingTopic[] = [
  { rank: 1, title: "公司说我们是一家人",       badge: "NEW"    },
  { rank: 2, title: "前任的婚礼请柬该不该去",   badge: "热"     },
  { rank: 3, title: "凌晨三点睡不着",           badge: "+612%"  },
  { rank: 4, title: "第三次复合",               badge: "+188%"  },
  { rank: 5, title: "相亲被说挑",               badge: "+322%"  },
];

// ─── 帖子 mock ─────────────────────────────────────
export const posts: CommunityPost[] = [
  {
    id: "p1",
    communityId: "workrant",
    communityName: "职场吐槽",
    communityColor: "amber",
    author: "沙雕日常",
    createdAt: "2h",
    title: "公司说「我们是一家人」的时候，你的第一反应是？",
    type: "poll",
    badges: ["hot", "poll"],
    tags: ["职场", "投票"],
    score: 1284,
    commentsCount: 342,
    roomCount: 128,
    sharesCount: 46,
    poll: {
      question: "公司说「我们是一家人」的时候，你的第一反应是？",
      totalVotes: 3128,
      options: [
        { id: "a", text: "那家里发工资吗",     votes: 1420 },
        { id: "b", text: "家里可以不来吗",     votes: 812  },
        { id: "c", text: "真信的请举手",       votes: 632  },
        { id: "d", text: "我们公司还行其实",   votes: 264  },
      ],
    },
  },
  {
    id: "p2",
    communityId: "emo",
    communityName: "今天也 emo 了",
    communityColor: "pink",
    author: "夜班的猫",
    createdAt: "45m",
    title: "凌晨三点，突然觉得所有事都值得，又觉得都不值得",
    body: "不知道你们有没有过这种感觉。白天忙起来就没事，一到晚上安静下来，情绪就跟潮水一样涌上来。今天特别想聊聊。",
    type: "text",
    badges: ["hot"],
    tags: ["情绪", "深夜"],
    score: 892,
    commentsCount: 218,
    roomCount: 64,
    sharesCount: 32,
  },
  {
    id: "p3",
    communityId: "whisper",
    communityName: "匿名悄悄室",
    communityColor: "purple",
    author: "匿名用户",
    createdAt: "1h",
    title: "前任的婚礼请柬到了，我居然认真在想要不要去",
    body: "五年，两次订婚，一次分手。请柬到的时候我在便利店买咖啡，手在抖。他人挺好，只是我们不合适。",
    type: "text",
    badges: ["anonymous", "hot"],
    tags: ["前任", "关系"],
    score: 1642,
    commentsCount: 528,
    roomCount: 210,
    sharesCount: 84,
  },
  {
    id: "p4",
    communityId: "solo",
    communityName: "独居生活",
    communityColor: "cyan",
    author: "一人食小册",
    createdAt: "3h",
    title: "今晚做了一锅奶油白菜，一个人也值得好好吃饭",
    body: "分享给独居的朋友们:白菜切段 · 蒜片爆香 · 白酒少许 · 淡奶油煮 5 分钟 · 现磨黑胡椒。20 分钟搞定。",
    type: "text",
    badges: [],
    tags: ["独居", "美食"],
    score: 512,
    commentsCount: 96,
    sharesCount: 24,
  },
  {
    id: "p5",
    communityId: "over30",
    communityName: "30+人生",
    communityColor: "gold",
    author: "老骨头社长",
    createdAt: "5h",
    title: "30 岁之后，我开始学会不解释",
    body: "以前会花很多力气去解释自己的选择。现在:不解释、不迎合、不消耗。发现生活反而清爽起来。你们呢？",
    type: "text",
    badges: ["hot", "creator"],
    tags: ["成长", "30+"],
    score: 2104,
    commentsCount: 612,
    roomCount: 320,
    sharesCount: 128,
  },
  {
    id: "p6",
    communityId: "buddies",
    communityName: "搭子广场",
    communityColor: "cyan",
    author: "周末不想在家",
    createdAt: "6h",
    title: "找一个周末去逛美术馆的搭子，安静型",
    body: "上海徐汇 · 每周六下午 · 不需要一起吃饭 · 看完各自散场 · 有一句没一句聊天最舒服。",
    type: "text",
    badges: [],
    tags: ["搭子", "上海"],
    score: 328,
    commentsCount: 82,
    sharesCount: 12,
  },
  {
    id: "p7",
    communityId: "love",
    communityName: "两性关系",
    communityColor: "rose",
    author: "咖啡加两块糖",
    createdAt: "8h",
    title: "对方回消息很慢，是没兴趣还是我太急",
    body: "认识两周，聊得挺好，但他经常隔几小时回。我脑补了 100 遍剧本。求过来人 tell me 真相。",
    type: "text",
    badges: [],
    tags: ["关系", "焦虑"],
    score: 736,
    commentsCount: 254,
    roomCount: 42,
    sharesCount: 18,
  },
  {
    id: "p8",
    communityId: "night",
    communityName: "熬夜俱乐部",
    communityColor: "indigo",
    author: "月光型选手",
    createdAt: "12h",
    title: "凌晨两点的朋友，报个到吧",
    body: "打个卡:今天几点睡的？今天为什么没睡？",
    type: "text",
    badges: ["hot"],
    tags: ["深夜", "打卡"],
    score: 1428,
    commentsCount: 486,
    roomCount: 180,
    sharesCount: 68,
  },
];
