// 互动社区 mock — 11 分类 × 4 帖子 = 44 posts,含评论
// 路由:/community  ·  /community/[slug]  ·  /community/[slug]/post/[postSlug]
// 内容基调:情绪/职场/关系/独居/深夜话题,克制、非色情、Reddit-tone

export type CommunityColor = "pink" | "purple" | "gold" | "cyan" | "amber" | "emerald" | "rose" | "indigo";

export interface CommunityCategory {
  slug: string;
  name: string;
  description: string;
  color: CommunityColor;
  isHot?: boolean;
  isDiscover?: boolean;   // 显示在"发现专区"
  onlineCount?: number;
  memberCount?: number;
  postCount?: number;
}

export type PostType = "text" | "image" | "video" | "poll" | "link";
export type PostBadge = "hot" | "adult" | "anonymous" | "poll" | "official" | "creator";

export interface PollOption { id: string; text: string; votes: number }

export interface CommunityComment {
  id: string;
  author: string;
  createdAt: string;
  body: string;
  score: number;
}

export interface CommunityPost {
  slug: string;               // URL slug (= id)
  communitySlug: string;
  communityName: string;
  communityColor: CommunityColor;
  author: string;
  authorAvatar?: string;
  createdAt: string;
  title: string;
  body?: string;
  type: PostType;
  badges: PostBadge[];
  tags: string[];
  score: number;
  commentsCount: number;
  roomCount?: number;
  sharesCount: number;
  poll?: {
    question: string;
    options: PollOption[];
    totalVotes: number;
  };
  comments?: CommunityComment[];
}

export interface TrendingTopic {
  rank: number;
  title: string;
  communitySlug: string;
  postSlug: string;
  badge?: "NEW" | "热" | "+188%" | "+612%" | "+322%";
}

// ─── 11 社区 ────────────────────────────────────────
export const communities: CommunityCategory[] = [
  { slug: "today-emo",         name: "今天也 emo 了", description: "白天扛住的情绪,晚上一起放下。",         color: "pink",    isHot: true,  onlineCount: 3420, memberCount: 128400, postCount: 4 },
  { slug: "emotion-tree-hole", name: "情绪树洞",     description: "有些话不敢和朋友说,只能写在这里。",     color: "purple",  onlineCount: 2180, memberCount: 96200,  postCount: 4 },
  { slug: "relationship",      name: "两性关系",     description: "两个人的事,一群人陪你想清楚。",           color: "rose",    isHot: true,  onlineCount: 5610, memberCount: 214800, postCount: 4 },
  { slug: "workplace",         name: "职场吐槽",     description: "打工人不孤独。段子、吐槽、决定,都在这。", color: "amber",   onlineCount: 1980, memberCount: 78300,  postCount: 4 },
  { slug: "night-owl",         name: "熬夜俱乐部",   description: "凌晨两点还醒着的都可以进。",             color: "indigo",  onlineCount: 890,  memberCount: 45100,  postCount: 4 },
  { slug: "living-alone",      name: "独居生活",     description: "一个人也要过得像模像样。",               color: "cyan",    onlineCount: 1240, memberCount: 62700,  postCount: 4 },

  { slug: "love-advisor",      name: "恋爱军师团",   description: "关于喜欢的一切,让我们帮你想。",         color: "rose",    isHot: true,  isDiscover: true, onlineCount: 1820, memberCount: 91200, postCount: 4 },
  { slug: "partner-square",    name: "搭子广场",     description: "咖啡搭子、看展搭子、健身搭子。",         color: "cyan",    isDiscover: true, onlineCount: 640,  memberCount: 28400, postCount: 4 },
  { slug: "life-30-plus",      name: "30+人生",     description: "过了 30 的人生新篇章。",                 color: "gold",    isDiscover: true, onlineCount: 1120, memberCount: 54900, postCount: 4 },
  { slug: "tipsy-bar",         name: "微醺小酒馆",   description: "只在微醺时说的真心话。",                 color: "amber",   isDiscover: true, onlineCount: 480,  memberCount: 19800, postCount: 4 },
  { slug: "anonymous-room",    name: "匿名悄悄室",   description: "在这里,你没有名字。",                     color: "purple",  isDiscover: true, onlineCount: 2340, memberCount: 87500, postCount: 4 },
];

export const myCommunities = communities.filter((c) => !c.isDiscover);
export const discoverCommunities = communities.filter((c) => c.isDiscover);

// ─── 帖子生成 helper ─────────────────────────────────
type PostSeed = {
  author: string;
  createdAt: string;
  title: string;
  body?: string;
  badges?: PostBadge[];
  tags: string[];
  score: number;
  commentsCount: number;
  roomCount?: number;
  sharesCount: number;
  poll?: CommunityPost["poll"];
  comments?: CommunityComment[];
};

function mkPosts(communitySlug: string, seeds: PostSeed[]): CommunityPost[] {
  const c = communities.find((x) => x.slug === communitySlug)!;
  return seeds.map((s, i) => ({
    slug: `${communitySlug}-${i + 1}`,
    communitySlug,
    communityName: c.name,
    communityColor: c.color,
    type: s.poll ? "poll" : "text",
    badges: s.badges || [],
    ...s,
  }));
}

const genComments = (base: string[]): CommunityComment[] =>
  base.map((body, i) => ({
    id: `c-${i}`,
    author: ["夜猫", "沙雕日常", "咖啡加糖", "月光型", "老骨头", "匿名"][i % 6],
    createdAt: ["2h", "1h", "45m", "30m", "10m"][i % 5],
    body,
    score: 12 + (i * 7) % 40,
  }));

// ─── 44 帖子 ─────────────────────────────────────────
export const posts: CommunityPost[] = [
  ...mkPosts("today-emo", [
    { author: "夜班的猫", createdAt: "45m", title: "凌晨三点又醒了,突然觉得自己已经一年多没有真正开心过了",
      body: "不是那种悲伤,更像是被抽空了。工作没停过,朋友聚会也参加,但每一次结束都更空。今天想认真聊聊,不是在寻求安慰,只是想知道有没有同样的人。",
      badges: ["hot"], tags: ["情绪", "深夜"], score: 892, commentsCount: 218, roomCount: 64, sharesCount: 32,
      comments: genComments([
        "别急着找答案。有时候只是需要一段安静的时间。",
        "去年这个时候我也是。慢慢来,不用逼自己。",
        "我最近开始每天走 30 分钟,不听音乐,只走。会好一点。",
      ]) },
    { author: "咖啡加两块糖", createdAt: "2h", title: "今天下班路上突然很想哭,但我说不出来为什么",
      tags: ["情绪"], score: 512, commentsCount: 128, sharesCount: 20 },
    { author: "月光型选手", createdAt: "5h", title: "为什么越长大越不知道怎么和人亲近",
      body: "认识的人多了,能说心里话的反而少了。是我变了,还是这就是长大。", tags: ["成长", "关系"], score: 728, commentsCount: 194, sharesCount: 28 },
    { author: "独角戏演员", createdAt: "1d", title: "有一件小事今天让我掉眼泪了,好像已经很久没这样了",
      badges: ["hot"], tags: ["情绪"], score: 1240, commentsCount: 312, sharesCount: 48 },
  ]),

  ...mkPosts("emotion-tree-hole", [
    { author: "匿名用户", createdAt: "1h", title: "有些话不敢和朋友说,只能写在这里",
      body: "把它写出来的一瞬间,心里就轻一点。谢谢这个树洞。",
      badges: ["anonymous"], tags: ["树洞"], score: 634, commentsCount: 156, sharesCount: 24 },
    { author: "小声一点", createdAt: "3h", title: "最近总是很累,但又说不出哪里累",
      tags: ["情绪"], score: 428, commentsCount: 92, sharesCount: 16 },
    { author: "匿名用户", createdAt: "6h", title: "我是不是太敏感了",
      body: "同事一个眼神,我能脑补一整天。理智上知道是自己想多,情绪上就是过不去。", badges: ["anonymous"], tags: ["自我"], score: 812, commentsCount: 218, sharesCount: 34 },
    { author: "月亮很近", createdAt: "1d", title: "今天想对未来的自己说:你已经做得够好了",
      tags: ["树洞", "温柔"], score: 1082, commentsCount: 264, sharesCount: 62 },
  ]),

  ...mkPosts("relationship", [
    { author: "咖啡加两块糖", createdAt: "2h", title: "对方忽冷忽热,到底要不要继续",
      body: "认识两个月,他前一周很热情,这一周基本消失。是我太急,还是他本来就没那么在乎。",
      badges: ["hot"], tags: ["关系", "焦虑"], score: 1428, commentsCount: 386, roomCount: 82, sharesCount: 54,
      comments: genComments([
        "如果一开始就要猜,后面只会更累。",
        "问一下自己:这段关系让你有安全感吗？",
        "我朋友遇到过一模一样的。后来发现对方本来就不认真。",
      ]) },
    { author: "小尾巴", createdAt: "4h", title: "已读不回到底算不算答案",
      tags: ["关系"], score: 926, commentsCount: 248, sharesCount: 42 },
    { author: "沙雕日常", createdAt: "8h", title: "关系里最消耗人的是什么",
      body: "对我来说是「不确定」。比吵架、比冷战都更消耗。你们呢？", badges: ["hot"], tags: ["讨论"], score: 1642, commentsCount: 428, sharesCount: 96 },
    { author: "夜风", createdAt: "1d", title: "分手后前任还是朋友,是我太天真吗",
      tags: ["前任", "关系"], score: 736, commentsCount: 194, sharesCount: 32 },
  ]),

  ...mkPosts("workplace", [
    { author: "沙雕日常", createdAt: "2h", title: "公司说「我们是一家人」的时候,你的第一反应是？",
      badges: ["hot", "poll"], tags: ["职场", "投票"], score: 1284, commentsCount: 342, roomCount: 128, sharesCount: 46,
      poll: {
        question: "公司说「我们是一家人」的时候,你的第一反应是？", totalVotes: 3128,
        options: [
          { id: "a", text: "那家里发工资吗",   votes: 1420 },
          { id: "b", text: "家里可以不来吗",   votes: 812  },
          { id: "c", text: "真信的请举手",     votes: 632  },
          { id: "d", text: "我们公司还行其实", votes: 264  },
        ],
      },
      comments: genComments([
        "笑不出来。上一家公司「一家人」到裁员通知发到微信。",
        "我们公司真的还行。",
        "关键看老板发工资爽不爽快。",
      ]) },
    { author: "打工人 001", createdAt: "5h", title: "加班到深夜,突然开始怀疑这份工作值不值",
      body: "拿的比同龄人多,但每天回家像被抽空。到底是钱多还是命贵。", tags: ["职场"], score: 826, commentsCount: 218, sharesCount: 42 },
    { author: "老骨头社长", createdAt: "1d", title: "同事把锅甩给我,我该怎么处理",
      tags: ["职场", "求助"], score: 618, commentsCount: 184, sharesCount: 22 },
    { author: "地铁最后一班", createdAt: "2d", title: "工作 5 年了,第一次开始考虑离职",
      badges: ["hot"], tags: ["职场", "决定"], score: 1082, commentsCount: 268, sharesCount: 58 },
  ]),

  ...mkPosts("night-owl", [
    { author: "月光型选手", createdAt: "12h", title: "又是凌晨两点,大家都还醒着吗",
      body: "打个卡:今天几点睡的？今天为什么没睡？", badges: ["hot"], tags: ["深夜", "打卡"], score: 1428, commentsCount: 486, roomCount: 180, sharesCount: 68 },
    { author: "夜风", createdAt: "1d", title: "失眠的时候你们会做什么",
      tags: ["深夜"], score: 726, commentsCount: 218, sharesCount: 34 },
    { author: "只吃夜宵的人", createdAt: "1d", title: "夜里最容易想起谁",
      body: "白天想不起来,凌晨突然涌上来。这算什么心理效应。", tags: ["深夜", "情绪"], score: 984, commentsCount: 264, sharesCount: 48 },
    { author: "月亮很近", createdAt: "2d", title: "熬夜之后第二天的自我厌恶,谁懂",
      tags: ["深夜", "情绪"], score: 542, commentsCount: 148, sharesCount: 22 },
  ]),

  ...mkPosts("living-alone", [
    { author: "一人食小册", createdAt: "3h", title: "一个人吃火锅其实也挺好",
      body: "今晚点了菌菇锅,配一小瓶啤酒。听着播客,不用等谁,也不用照顾谁。第一次觉得独居真好。",
      tags: ["独居", "美食"], score: 512, commentsCount: 96, sharesCount: 24 },
    { author: "周末不想在家", createdAt: "6h", title: "独居后最快乐的一件事是什么",
      badges: ["hot"], tags: ["独居"], score: 1082, commentsCount: 268, sharesCount: 42 },
    { author: "屋里的猫", createdAt: "1d", title: "周末一个人怎么安排才不空虚",
      tags: ["独居", "生活"], score: 726, commentsCount: 194, sharesCount: 28 },
    { author: "小声一点", createdAt: "2d", title: "第一次觉得,一个人吃饭的日子也可以很好",
      tags: ["独居"], score: 428, commentsCount: 82, sharesCount: 14 },
  ]),

  ...mkPosts("love-advisor", [
    { author: "军师老李", createdAt: "2h", title: "第一次约会聊什么不尴尬",
      body: "帮朋友问的(真的是朋友)。他约到一个心动很久的女生,现在紧张到失眠。",
      badges: ["hot"], tags: ["约会", "求助"], score: 928, commentsCount: 284, roomCount: 82, sharesCount: 42 },
    { author: "咖啡加两块糖", createdAt: "5h", title: "对方主动少,是不是没兴趣",
      tags: ["关系", "焦虑"], score: 726, commentsCount: 218, sharesCount: 34 },
    { author: "沙雕日常", createdAt: "8h", title: "如何判断对方是不是认真",
      body: "不是看嘴,是看时间和精力愿意花多少。你们同意吗？", badges: ["hot"], tags: ["讨论"], score: 1284, commentsCount: 342, sharesCount: 68 },
    { author: "夜风", createdAt: "1d", title: "喜欢一个人,该不该先表白",
      tags: ["关系"], score: 618, commentsCount: 156, sharesCount: 22 },
  ]),

  ...mkPosts("partner-square", [
    { author: "周末不想在家", createdAt: "6h", title: "找一个周末咖啡搭子,安静型",
      body: "上海徐汇 · 每周六下午 · 不需要一起吃饭 · 各自看书或电脑 · 有一句没一句聊天最舒服。",
      tags: ["搭子", "上海"], score: 328, commentsCount: 82, sharesCount: 12 },
    { author: "月亮很近", createdAt: "1d", title: "有没有一起看展的朋友",
      tags: ["搭子", "看展"], score: 264, commentsCount: 64, sharesCount: 10 },
    { author: "地铁最后一班", createdAt: "1d", title: "想找一个健身搭子互相监督",
      body: "北京朝阳 · 每周 3 次 · 拳击 / 力量 / 慢跑都可以。目标是坚持而不是练到多壮。", tags: ["搭子", "北京", "健身"], score: 218, commentsCount: 42, sharesCount: 6 },
    { author: "小尾巴", createdAt: "2d", title: "深圳有没有周末爬山的搭子",
      tags: ["搭子", "深圳"], score: 186, commentsCount: 38, sharesCount: 4 },
  ]),

  ...mkPosts("life-30-plus", [
    { author: "老骨头社长", createdAt: "5h", title: "30 岁之后,我开始学会不解释",
      body: "以前会花很多力气去解释自己的选择。现在:不解释、不迎合、不消耗。发现生活反而清爽起来。你们呢？",
      badges: ["hot", "creator"], tags: ["成长", "30+"], score: 2104, commentsCount: 612, roomCount: 320, sharesCount: 128 },
    { author: "夜风", createdAt: "1d", title: "年纪越大,越不想浪费时间",
      tags: ["30+", "成长"], score: 928, commentsCount: 218, sharesCount: 42 },
    { author: "咖啡加两块糖", createdAt: "1d", title: "你们什么时候开始接受普通生活",
      body: "不是妥协,是真的觉得普通也很好。这一年心境真的变了。", tags: ["30+"], score: 726, commentsCount: 186, sharesCount: 28 },
    { author: "沙雕日常", createdAt: "2d", title: "35 岁最深的一个感受:朋友不用多,合适就好",
      tags: ["30+", "友情"], score: 618, commentsCount: 148, sharesCount: 22 },
  ]),

  ...mkPosts("tipsy-bar", [
    { author: "微醺型玩家", createdAt: "3h", title: "今晚喝一点点,聊点真心话",
      tags: ["深夜", "微醺"], score: 428, commentsCount: 128, sharesCount: 18 },
    { author: "夜风", createdAt: "6h", title: "微醺之后最想联系谁",
      body: "不必真的联系。留在这里就好。", badges: ["hot"], tags: ["微醺", "情绪"], score: 826, commentsCount: 218, sharesCount: 42 },
    { author: "月亮很近", createdAt: "1d", title: "一个人去酒吧会奇怪吗",
      tags: ["微醺"], score: 384, commentsCount: 96, sharesCount: 14 },
    { author: "屋里的猫", createdAt: "2d", title: "推荐几款适合独饮的低度酒",
      tags: ["微醺", "推荐"], score: 264, commentsCount: 82, sharesCount: 12 },
  ]),

  ...mkPosts("anonymous-room", [
    { author: "匿名用户", createdAt: "1h", title: "前任的婚礼请柬到了,我居然认真在想要不要去",
      body: "五年,两次订婚,一次分手。请柬到的时候我在便利店买咖啡,手在抖。他人挺好,只是我们不合适。",
      badges: ["anonymous", "hot"], tags: ["前任", "关系"], score: 1642, commentsCount: 528, roomCount: 210, sharesCount: 84 },
    { author: "匿名用户", createdAt: "4h", title: "有一件事我一直没敢说",
      badges: ["anonymous"], tags: ["树洞"], score: 926, commentsCount: 248, sharesCount: 42 },
    { author: "匿名用户", createdAt: "8h", title: "如果匿名,你最想问前任什么",
      body: "只是想问,不必真的问出口。", badges: ["anonymous", "hot"], tags: ["前任"], score: 1284, commentsCount: 386, sharesCount: 68 },
    { author: "匿名用户", createdAt: "1d", title: "今天只想做一个没人认识的人",
      badges: ["anonymous"], tags: ["情绪"], score: 736, commentsCount: 184, sharesCount: 32 },
  ]),
];

// ─── 右侧今晚在聊(链接到真实帖子) ────────────────────
export const trendingTopics: TrendingTopic[] = [
  { rank: 1, title: "公司说我们是一家人",       communitySlug: "workplace",      postSlug: "workplace-1",      badge: "NEW"    },
  { rank: 2, title: "前任的婚礼请柬该不该去",   communitySlug: "anonymous-room", postSlug: "anonymous-room-1", badge: "热"     },
  { rank: 3, title: "凌晨三点睡不着",           communitySlug: "today-emo",      postSlug: "today-emo-1",      badge: "+612%"  },
  { rank: 4, title: "第三次复合",               communitySlug: "relationship",   postSlug: "relationship-1",   badge: "+188%"  },
  { rank: 5, title: "相亲被说挑",               communitySlug: "love-advisor",   postSlug: "love-advisor-1",   badge: "+322%"  },
];

// ─── Lookups ─────────────────────────────────────────
export function getCommunityBySlug(slug: string): CommunityCategory | undefined {
  return communities.find((c) => c.slug === slug);
}

export function getPostsByCommunity(slug: string): CommunityPost[] {
  return posts.filter((p) => p.communitySlug === slug);
}

export function getPostBySlug(communitySlug: string, postSlug: string): CommunityPost | undefined {
  return posts.find((p) => p.communitySlug === communitySlug && p.slug === postSlug);
}
