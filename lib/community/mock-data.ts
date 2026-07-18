// 私语广场 · 种子 mock 数据 · 12 篇 stories + 8 questions
// 内容基调:高端 · 私密 · 尊重 · 与 Sugardating Journal 品牌一致
import type { CommunityPost, CommunityAuthor, CommunityTag } from "./types";

const now = Date.now();
const ago = (h: number) => new Date(now - h * 3600_000).toISOString();

// ══════════════════════════════════════
// Authors
// ══════════════════════════════════════

export const communityAuthors: CommunityAuthor[] = [
  { id: "u_ivory",    name: "Ivory",     type: "user",       isVerified: true },
  { id: "u_mira",     name: "Mira",      type: "sugargirl",  isVerified: true },
  { id: "u_leon",     name: "Leon.",     type: "user",       isVerified: true },
  { id: "u_anon1",    name: "匿名读者",  type: "user" },
  { id: "u_anon2",    name: "匿名读者",  type: "user" },
  { id: "u_saoirse",  name: "Saoirse",   type: "sugargirl" },
  { id: "u_kenji",    name: "Kenji",     type: "sugarboy" },
  { id: "u_aria",     name: "Aria M.",   type: "sugargirl",  isVerified: true },
  { id: "u_wren",     name: "Wren",      type: "user" },
  { id: "u_yuki",     name: "Yuki",      type: "sugargirl" },
  { id: "u_editor",   name: "编辑部",     type: "staff",      isVerified: true },
];

// ══════════════════════════════════════
// Stories · 12 篇 (情感私话)
// ══════════════════════════════════════

const STORIES: Omit<CommunityPost, "contentType" | "status" | "seoIndexable">[] = [
  {
    id: "s01", slug: "first-dinner-in-mayfair-went-quiet-after",
    title: "在 Mayfair 的第一次晚餐很顺,回家后他却安静了一周",
    body: "我们聊了将近一个月,见面前视频确认过两次。晚餐选在 Mount Street 附近一家意大利小馆,他很准时,对话也自然。我以为一切顺利。\n\n第二天上午他发了一条简短的谢谢,之后就没有下文。第五天我发了一条问候,依然没回。\n\n我不确定问题出在哪里 —— 我们的话题有没有让他觉得压力,还是我笑得太多。有过类似经历的姐妹能不能分享一下,你们是怎么消化那种沉默的?",
    excerpt: "我们聊了将近一个月,见面前视频确认过两次。晚餐选在 Mount Street 附近一家意大利小馆,他很准时,对话也自然。",
    authorId: "u_mira", authorName: "Mira", authorType: "sugargirl",
    isAnonymous: false, tags: ["london", "first-date", "communication"],
    reactionCounts: { empathy: 84, hug: 42, insight: 12, "want-more": 68 },
    viewCount: 2340, commentCount: 46, answerCount: 0, followerCount: 0,
    createdAt: ago(20), updatedAt: ago(20),
  },
  {
    id: "s02", slug: "he-asked-me-to-turn-off-video-mid-call",
    title: "视频通话进行到一半,他要我关掉摄像头",
    body: "第一次深聊是视频。前十分钟很顺,他突然说光线太强,让我关摄像头。我照做了,但对话的节奏立刻变了。\n\n后来我才明白 —— 他不是要看我,而是要评估我是不是能听懂他没说出口的那些边界。\n\n视频是很好的过滤器,但真正的过滤是看他怎么处理你的反应。",
    excerpt: "第一次深聊是视频。前十分钟很顺,他突然说光线太强,让我关摄像头。",
    authorId: "u_saoirse", authorName: "Saoirse", authorType: "sugargirl",
    isAnonymous: false, tags: ["video-call", "boundaries", "screening"],
    reactionCounts: { empathy: 56, insight: 128, "want-more": 34 },
    viewCount: 3120, commentCount: 61, answerCount: 0,
    createdAt: ago(48), updatedAt: ago(48),
  },
  {
    id: "s03", slug: "anonymous-my-first-arrangement-lasted-three-weeks",
    title: "我的第一段安排只维持了三周,现在回头看很庆幸",
    body: "我 24 岁,伦敦读研。三周里,他体贴、准时、送我回家会等到门锁上。但每次我要谈未来节奏,他就用玩笑绕开。\n\n第 21 天,我提出结束。他没生气,只说 \"理解\"。\n\n事后想想,那种表面的完美其实是拒绝深入 —— 他不想让我进入他的真实生活。我不后悔尝试,更庆幸的是我早早地读懂了这一点。",
    excerpt: "我 24 岁,伦敦读研。三周里,他体贴、准时、送我回家会等到门锁上。",
    authorId: "u_anon1",
    isAnonymous: true, tags: ["young-sugargirl", "boundaries", "reflection"],
    reactionCounts: { empathy: 210, hug: 89, insight: 66 },
    viewCount: 5480, commentCount: 112, answerCount: 0,
    createdAt: ago(72), updatedAt: ago(72),
  },
  {
    id: "s04", slug: "the-taxi-conversation-was-more-honest",
    title: "回家出租车上的十分钟,比整晚晚餐都真诚",
    body: "晚餐结束我们叫了出租,他一起送我到公寓楼下。那十分钟里,他第一次说到了工作以外的事 —— 他刚离婚,想找一个可以喘息的关系。\n\n那不是套路,是疲惫。\n\n之后我们决定不进入 arrangement,而是变成偶尔见面的朋友。三个月后,他成了我伦敦最信任的人之一。",
    excerpt: "晚餐结束我们叫了出租,他一起送我到公寓楼下。那十分钟里,他第一次说到了工作以外的事。",
    authorId: "u_ivory", authorName: "Ivory", authorType: "user",
    isAnonymous: false, tags: ["friendship", "london", "honest-conversation"],
    reactionCounts: { insight: 240, "want-more": 45, empathy: 66 },
    viewCount: 4210, commentCount: 39, answerCount: 0,
    createdAt: ago(100), updatedAt: ago(100),
  },
  {
    id: "s05", slug: "anonymous-i-said-no-and-he-thanked-me",
    title: "我在第三次约会时说 \"我需要更慢\",他谢谢我",
    body: "很多人告诉我说 no 会失去这段关系。但我第三次见面前,我确实感到不适合再往前。\n\n我发了一段长信息,把感受说清楚。他两小时后回复:\"谢谢你告诉我。我理解,也希望你一切都好。\"\n\n没有戏剧,没有指责。那一刻我意识到,真正成熟的男性,会尊重女性的节奏。",
    excerpt: "很多人告诉我说 no 会失去这段关系。但我第三次见面前,我确实感到不适合再往前。",
    authorId: "u_anon2",
    isAnonymous: true, tags: ["consent", "boundaries", "communication"],
    reactionCounts: { insight: 168, empathy: 92, hug: 34 },
    viewCount: 3890, commentCount: 78, answerCount: 0,
    createdAt: ago(140), updatedAt: ago(140),
  },
  {
    id: "s06", slug: "we-video-called-for-two-months-before-meeting",
    title: "我们视频了两个月才见面,反而更快建立信任",
    body: "他在伦敦金融城工作,我在曼谷。第一个月只是聊天,第二个月开始视频。见面是他去曼谷出差的一天下午。\n\n那两个月不是浪费时间 —— 是我们各自看清楚了对方生活节奏的方式。\n\n真正的匹配是节奏匹配,不是化学反应。",
    excerpt: "他在伦敦金融城工作,我在曼谷。第一个月只是聊天,第二个月开始视频。",
    authorId: "u_yuki", authorName: "Yuki", authorType: "sugargirl",
    isAnonymous: false, tags: ["long-distance", "video-call", "asian"],
    reactionCounts: { insight: 145, empathy: 56, "want-more": 78 },
    viewCount: 2670, commentCount: 42, answerCount: 0,
    createdAt: ago(180), updatedAt: ago(180),
  },
  {
    id: "s07", slug: "when-he-gave-me-a-book-instead-of-a-bag",
    title: "他送了我一本书,而不是一只包",
    body: "第五次见面,他递给我一个小袋。我以为是某个品牌 —— 结果里面是一本我一个月前提过的诗集。\n\n他记得我说过一次,一次而已。\n\n那一刻我才明白,礼物的重量不在标价,在于对方有没有听。",
    excerpt: "第五次见面,他递给我一个小袋。我以为是某个品牌 —— 结果里面是一本我一个月前提过的诗集。",
    authorId: "u_aria", authorName: "Aria M.", authorType: "sugargirl",
    isAnonymous: false, tags: ["thoughtful", "gifts", "attention"],
    reactionCounts: { insight: 320, empathy: 128, "want-more": 44 },
    viewCount: 6120, commentCount: 96, answerCount: 0,
    createdAt: ago(220), updatedAt: ago(220),
  },
  {
    id: "s08", slug: "the-hotel-room-i-almost-agreed-to",
    title: "那个我差点答应的酒店房间号",
    body: "第二次见面结束,他非常礼貌地问我要不要在同一栋酒店继续聊。我几乎答应了。\n\n最后我说\"我更愿意下次见面之前先视频一次\"。他没有任何被拒绝的情绪,只说好。\n\n事后我很庆幸自己那晚说了不。三个月后我们变成了很稳定的关系。太多女孩担心拒绝会毁掉一切 —— 恰恰相反,拒绝是一种筛选,不是伤害。",
    excerpt: "第二次见面结束,他非常礼貌地问我要不要在同一栋酒店继续聊。我几乎答应了。",
    authorId: "u_anon1",
    isAnonymous: true, tags: ["safety", "consent", "boundaries"],
    reactionCounts: { empathy: 178, hug: 66, insight: 89 },
    viewCount: 4870, commentCount: 88, answerCount: 0,
    createdAt: ago(260), updatedAt: ago(260),
  },
  {
    id: "s09", slug: "he-canceled-because-of-work-and-explained",
    title: "他因为工作取消了,却认真解释了每一句",
    body: "约好周六晚,周五下午他打来。不是短信,是电话。他说明天有一个日本客户临时飞来伦敦,他必须去接。之后他补了一句:\"我知道这样很不礼貌,让我下周补上。你想选餐厅吗?\"\n\n很小的事,但让我意识到成熟不是没有意外,而是意外发生时怎么处理。",
    excerpt: "约好周六晚,周五下午他打来。不是短信,是电话。",
    authorId: "u_leon", authorName: "Leon.", authorType: "user",
    isAnonymous: false, tags: ["respect", "communication", "maturity"],
    reactionCounts: { insight: 156, empathy: 34 },
    viewCount: 2130, commentCount: 28, answerCount: 0,
    createdAt: ago(310), updatedAt: ago(310),
  },
  {
    id: "s10", slug: "anonymous-i-am-a-chinese-student-in-london",
    title: "我是伦敦的中国留学生,第一年学会了三件事",
    body: "第一,不要主动加微信,除非你 100% 确定要长期发展。\n第二,永远保留自己的公寓钥匙、自己的名字、自己的银行卡。\n第三,遇到强调 \"我很低调\" 的男性,先视频,先视频,先视频。\n\n这一年我没受伤,不是因为我聪明,是因为身边的姐妹一开始就告诉我这些。",
    excerpt: "第一,不要主动加微信,除非你 100% 确定要长期发展。第二,永远保留自己的公寓钥匙、自己的名字、自己的银行卡。",
    authorId: "u_anon2",
    isAnonymous: true, tags: ["chinese", "london", "safety", "privacy"],
    reactionCounts: { insight: 412, empathy: 89, hug: 34 },
    viewCount: 7830, commentCount: 156, answerCount: 0,
    createdAt: ago(380), updatedAt: ago(380),
  },
  {
    id: "s11", slug: "the-quiet-week-after-the-video-check",
    title: "视频确认之后的那一周,他反而更慢了",
    body: "很多人说视频通过就是绿灯。我经验相反 —— 真正认真的男性,视频后反而更慢,因为他确认了你是真人,开始思考是不是真的适合。\n\n那种沉默不是拒绝,是审慎。别把节奏和兴趣混为一谈。",
    excerpt: "很多人说视频通过就是绿灯。我经验相反 —— 真正认真的男性,视频后反而更慢。",
    authorId: "u_aria", authorName: "Aria M.", authorType: "sugargirl",
    isAnonymous: false, tags: ["video-call", "pacing", "expectation"],
    reactionCounts: { insight: 189, "want-more": 45 },
    viewCount: 2980, commentCount: 33, answerCount: 0,
    createdAt: ago(460), updatedAt: ago(460),
  },
  {
    id: "s12", slug: "why-i-stopped-checking-his-messages-at-2am",
    title: "为什么我不再凌晨两点看他的消息",
    body: "有一天我意识到,我每天最不安的时刻,是深夜等他回信息。\n\n我关掉了那种依赖 —— 不是断联,而是给自己一个规则:晚上 11 点后不再检查。\n\n三周之后,我的整个能量都变了。他反而开始更主动。低价值状态吸引不来高价值关系,这是真的。",
    excerpt: "有一天我意识到,我每天最不安的时刻,是深夜等他回信息。",
    authorId: "u_wren", authorName: "Wren", authorType: "user",
    isAnonymous: false, tags: ["boundaries", "self-worth", "attachment"],
    reactionCounts: { insight: 267, empathy: 134, hug: 45 },
    viewCount: 4560, commentCount: 71, answerCount: 0,
    createdAt: ago(540), updatedAt: ago(540),
  },
];

// ══════════════════════════════════════
// Questions · 8 篇 (问答专区)
// ══════════════════════════════════════

const QUESTIONS: Omit<CommunityPost, "contentType" | "status" | "seoIndexable">[] = [
  {
    id: "q01", slug: "video-verification-before-first-meeting-yes-or-no",
    title: "第一次见面前必须先视频吗?我比较重视隐私",
    body: "对方要求见面前视频一次,说是安全考虑。我理解,但我比较在意画面里能看到多少个人信息(比如背景、家居等)。\n\n有经验的姐妹和 sugarboy 能说说吗:视频到底展示到什么程度合适?有没有既能验证身份又不暴露太多的做法?",
    authorId: "u_anon1",
    isAnonymous: true, tags: ["video-call", "privacy", "first-date"],
    reactionCounts: { helpful: 34 },
    viewCount: 1890, commentCount: 0, answerCount: 12, followerCount: 88,
    createdAt: ago(12), updatedAt: ago(12),
  },
  {
    id: "q02", slug: "how-to-tell-if-a-profile-is-real-in-2026",
    title: "2026 年了,怎么判断一个资料是真人?",
    body: "见过太多美图,也见过资料里全是名牌的。想问下有没有一个简单可靠的判断顺序 —— 从看资料到视频前的整个流程,你们都怎么做的?",
    authorId: "u_leon", authorName: "Leon.", authorType: "user",
    isAnonymous: false, tags: ["safety", "verification", "screening"],
    reactionCounts: { helpful: 56 },
    viewCount: 3120, commentCount: 0, answerCount: 18, followerCount: 145,
    acceptedAnswerId: "a_q02_best",
    createdAt: ago(36), updatedAt: ago(36),
  },
  {
    id: "q03", slug: "should-i-share-my-real-name-early-or-late",
    title: "真名应该早期就说,还是相处一段时间再说?",
    body: "有的姐妹说一开始就说真名会显得坦荡,有的说一定要等三次以上再说。你们的做法是什么?什么时候是合适的\"透露真名\"的时机?",
    authorId: "u_yuki", authorName: "Yuki", authorType: "sugargirl",
    isAnonymous: false, tags: ["privacy", "trust", "pacing"],
    reactionCounts: { helpful: 22 },
    viewCount: 1420, commentCount: 0, answerCount: 9, followerCount: 45,
    createdAt: ago(60), updatedAt: ago(60),
  },
  {
    id: "q04", slug: "sugarboys-thoughts-on-mature-women-approaching-first",
    title: "sugarboy 们,遇到成熟女性主动的时候你们怎么想的?",
    body: "我 42,想尝试 sugarboy 的模式,但不知道对方期待的沟通节奏。想听 sugarboy 说说 —— 你们比较希望女方一开始就明确期望,还是慢慢聊?",
    authorId: "u_anon2",
    isAnonymous: true, tags: ["sugarboy", "mature-women", "communication"],
    reactionCounts: { helpful: 18 },
    viewCount: 890, commentCount: 0, answerCount: 5, followerCount: 33,
    createdAt: ago(96), updatedAt: ago(96),
  },
  {
    id: "q05", slug: "how-to-refuse-hotel-room-invitation-without-losing-connection",
    title: "怎么优雅地拒绝\"上楼继续聊\"却不破坏关系?",
    body: "第二次见面结束后被邀请去他酒店房间。我不打算答应,但我也不想让对方觉得我在假装矜持或否定他。求一个既不冷淡也不暧昧的说法。",
    authorId: "u_anon1",
    isAnonymous: true, tags: ["consent", "boundaries", "communication"],
    reactionCounts: { helpful: 45 },
    viewCount: 2340, commentCount: 0, answerCount: 15, followerCount: 78,
    createdAt: ago(148), updatedAt: ago(148),
  },
  {
    id: "q06", slug: "chinese-community-in-london-really-that-small",
    title: "伦敦华人圈真的像大家说的那么小吗?",
    body: "刚从上海过来读硕士。我妈妈那一辈总说\"伦敦华人圈很小,别乱来\"。我想问下已经在伦敦生活的姐妹 —— 这个圈子真的那么小吗?什么样的行为最容易被识别?",
    authorId: "u_anon2",
    isAnonymous: true, tags: ["chinese", "london", "privacy", "safety"],
    reactionCounts: { helpful: 39 },
    viewCount: 1780, commentCount: 0, answerCount: 11, followerCount: 62,
    createdAt: ago(200), updatedAt: ago(200),
  },
  {
    id: "q07", slug: "premium-membership-worth-it-for-serious-search",
    title: "认真找长期关系,VIP 到底值不值得开?",
    body: "看到 Sugardating 的 VIP / SVIP 权益,想问下已经开了的姐妹和 gentleman:如果目的是筛选长期,而不是数量,VIP 的哪些功能真的有用?",
    authorId: "u_wren", authorName: "Wren", authorType: "user",
    isAnonymous: false, tags: ["membership", "vip", "long-term"],
    reactionCounts: { helpful: 12 },
    viewCount: 720, commentCount: 0, answerCount: 4, followerCount: 18,
    createdAt: ago(280), updatedAt: ago(280),
  },
  {
    id: "q08", slug: "asian-massage-in-london-how-to-find-legit",
    title: "伦敦的按摩服务怎么筛选靠谱的?",
    body: "被朋友推荐 Mayfair 一家,但不敢直接去。想问下 sugargirl 姐妹们:选按摩服务时你们会看哪些信号?什么样的资料是要绕开的?",
    authorId: "u_anon1",
    isAnonymous: true, tags: ["massage", "london", "safety", "screening"],
    reactionCounts: { helpful: 8 },
    viewCount: 1240, commentCount: 0, answerCount: 0, followerCount: 41,
    createdAt: ago(320), updatedAt: ago(320),
  },
];

// ══════════════════════════════════════
// Export as fully-formed CommunityPost[]
// ══════════════════════════════════════

export const seedCommunityPosts: CommunityPost[] = [
  ...STORIES.map((s): CommunityPost => ({
    ...s,
    contentType: "story",
    status: "published",
    seoIndexable: true,
  })),
  ...QUESTIONS.map((q): CommunityPost => ({
    ...q,
    contentType: "question",
    status: "published",
    seoIndexable: true,
  })),
];

// ══════════════════════════════════════
// Tags · 聚合 · 用于 tag chips / SEO
// ══════════════════════════════════════

export function computeTags(posts: CommunityPost[]): CommunityTag[] {
  const map = new Map<string, { story: number; question: number }>();
  for (const p of posts) {
    if (p.status !== "published") continue;
    for (const t of p.tags) {
      const cur = map.get(t) ?? { story: 0, question: 0 };
      if (p.contentType === "story") cur.story++;
      else cur.question++;
      map.set(t, cur);
    }
  }
  const labels: Record<string, string> = {
    "london": "伦敦",
    "first-date": "第一次约会",
    "video-call": "视频通话",
    "boundaries": "边界感",
    "communication": "沟通",
    "safety": "安全",
    "privacy": "隐私",
    "screening": "筛选",
    "consent": "同意与拒绝",
    "chinese": "华人",
    "young-sugargirl": "年轻 sugargirl",
    "reflection": "回顾",
    "friendship": "关系过渡",
    "honest-conversation": "真诚对话",
    "long-distance": "远距离",
    "asian": "亚裔",
    "thoughtful": "用心",
    "gifts": "礼物",
    "attention": "关注",
    "respect": "尊重",
    "maturity": "成熟",
    "pacing": "节奏",
    "expectation": "期望",
    "self-worth": "自我价值",
    "attachment": "依恋",
    "trust": "信任",
    "verification": "身份验证",
    "sugarboy": "Sugarboy",
    "mature-women": "成熟女性",
    "membership": "会员",
    "vip": "VIP",
    "long-term": "长期关系",
    "massage": "按摩",
  };
  return Array.from(map.entries())
    .map(([slug, { story, question }]) => ({
      slug,
      label: labels[slug] ?? slug,
      storyCount: story,
      questionCount: question,
    }))
    .sort((a, b) => (b.storyCount + b.questionCount) - (a.storyCount + a.questionCount));
}
