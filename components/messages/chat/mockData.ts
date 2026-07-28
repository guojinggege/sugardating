// 私信 workspace · 预置 Demo 会话 + 消息 · 全部前端状态
// 时间锚点 = 今天中午 UTC · SSR 与 client 生成同一字符串 · 无 hydration 漂移
import type { DemoConversation, DemoMessage } from "./types";

function anchor(): number {
  const d = new Date();
  d.setUTCHours(12, 0, 0, 0);
  return d.getTime();
}
function iso(hoursAgo: number): string {
  return new Date(anchor() - hoursAgo * 3600_000).toISOString();
}

export const DEMO_CONVERSATIONS: DemoConversation[] = [
  {
    id: "cv_jade",
    peerName: "Jade Chen",
    peerAvatarSeed: "J",
    peerHandle: "jadechen",
    verified: true,
    languages: ["en", "zh"],
    online: true,
    lastActiveMinutesAgo: 3,
    unreadCount: 2,
    lastMessagePreview: "Perfect 😊 Send me the address when you're free.",
    lastMessageAt: iso(0.1),
    lastMessageType: "text",
  },
  {
    id: "cv_mina",
    peerName: "Mina Park",
    peerAvatarSeed: "M",
    peerHandle: "minapark",
    verified: true,
    languages: ["zh", "en"],
    online: true,
    lastActiveMinutesAgo: 12,
    unreadCount: 1,
    lastMessagePreview: "我刚到伦敦,下周有空一起喝咖啡吗?",
    lastMessageAt: iso(1.2),
    lastMessageType: "text",
  },
  {
    id: "cv_chloe",
    peerName: "Chloe",
    peerAvatarSeed: "C",
    peerHandle: "chloe",
    verified: true,
    languages: ["en"],
    online: false,
    lastActiveMinutesAgo: 45,
    unreadCount: 0,
    lastMessagePreview: "I loved the restaurant you recommended 😊",
    lastMessageAt: iso(3),
    lastMessageType: "text",
  },
  {
    id: "cv_linh",
    peerName: "Linh Nguyen",
    peerAvatarSeed: "L",
    peerHandle: "linh",
    verified: false,
    languages: ["zh", "en"],
    online: false,
    lastActiveMinutesAgo: 180,
    unreadCount: 0,
    lastMessagePreview: "今晚可能会晚一点回复。",
    lastMessageAt: iso(6),
    lastMessageType: "text",
  },
  {
    id: "cv_sofia",
    peerName: "Sofia",
    peerAvatarSeed: "S",
    peerHandle: "sofia",
    verified: true,
    languages: ["en"],
    online: true,
    lastActiveMinutesAgo: 5,
    unreadCount: 0,
    lastMessagePreview: "Are you free this weekend?",
    lastMessageAt: iso(22),
    lastMessageType: "voice",
  },
  {
    id: "cv_yuki",
    peerName: "Yuki",
    peerAvatarSeed: "Y",
    peerHandle: "yuki",
    verified: true,
    languages: ["zh", "en"],
    online: false,
    lastActiveMinutesAgo: 720,
    unreadCount: 0,
    lastMessagePreview: "谢谢你的关注,很高兴认识你。",
    lastMessageAt: iso(48),
    lastMessageType: "text",
  },
];

/** 通讯录 · 用于 "新建会话" 弹窗 */
export const DEMO_CONTACTS = [
  { peerName: "Aria M.",     peerAvatarSeed: "A", peerHandle: "ariam"    },
  { peerName: "Nova Wu",     peerAvatarSeed: "N", peerHandle: "novawu"   },
  { peerName: "Ivy Zhang",   peerAvatarSeed: "I", peerHandle: "ivyz"     },
  { peerName: "Kaia",        peerAvatarSeed: "K", peerHandle: "kaia"     },
  { peerName: "Selena Lim",  peerAvatarSeed: "S", peerHandle: "selenali" },
  { peerName: "Emi Tanaka",  peerAvatarSeed: "E", peerHandle: "emit"     },
];

/** 12 条 Jade 会话消息 · 包含中英文/我方/对方/语音/通话记录/日期跨天 */
function jadeMessages(): DemoMessage[] {
  const cid = "cv_jade";
  return [
    { id: "j1",  conversationId: cid, senderSide: "them", type: "text",
      originalText: "Hi! Are you still going to the rooftop event on Friday?",
      originalLanguage: "en",
      translations: { zh: "嗨!你周五还去屋顶那个活动吗?" },
      status: "read", createdAt: iso(30) },
    { id: "j2",  conversationId: cid, senderSide: "me",   type: "text",
      originalText: "Yes, I'm planning to go around 8. Are you going too?",
      originalLanguage: "en",
      translations: { zh: "会啊,我准备 8 点左右到,你也去吗?" },
      status: "read", createdAt: iso(29.8) },
    { id: "j3",  conversationId: cid, senderSide: "them", type: "text",
      originalText: "应该会去,我和朋友可能会先去附近吃晚餐。",
      originalLanguage: "zh",
      translations: { en: "I think so. My friend and I might grab dinner nearby first." },
      status: "read", createdAt: iso(29.5) },
    { id: "j4",  conversationId: cid, senderSide: "me",   type: "text",
      originalText: "That sounds good. I can recommend a nice place nearby.",
      originalLanguage: "en",
      translations: { zh: "听起来不错。我可以推荐附近一家不错的餐厅。" },
      status: "read", createdAt: iso(29) },
    { id: "j5",  conversationId: cid, senderSide: "them", type: "text",
      originalText: "Perfect 😊 Send me the address when you're free.",
      originalLanguage: "en",
      translations: { zh: "太好了 😊 你有空的时候把地址发给我吧。" },
      status: "read", createdAt: iso(28.8) },
    // ---- 跨天分隔 · 以下今天 ----
    { id: "j6",  conversationId: cid, senderSide: "them", type: "call",
      callType: "voice", callDuration: 132, callResult: "ended",
      createdAt: iso(6) },
    { id: "j7",  conversationId: cid, senderSide: "them", type: "voice",
      voiceDuration: 14, createdAt: iso(5) },
    { id: "j8",  conversationId: cid, senderSide: "me",   type: "text",
      originalText: "Just listened to your note, sounds great!",
      originalLanguage: "en",
      translations: { zh: "刚听了你的语音,听起来很棒!" },
      status: "read", createdAt: iso(4.8) },
    { id: "j9",  conversationId: cid, senderSide: "them", type: "text",
      originalText: "今天下午我在 Notting Hill 逛街,拍了几张照片。",
      originalLanguage: "zh",
      translations: { en: "I was in Notting Hill this afternoon, took a few photos." },
      status: "read", createdAt: iso(3) },
    { id: "j10", conversationId: cid, senderSide: "me",   type: "text",
      originalText: "Nice! Which street were you on?",
      originalLanguage: "en",
      translations: { zh: "不错!你在哪条街?" },
      status: "read", createdAt: iso(2.8) },
    { id: "j11", conversationId: cid, senderSide: "them", type: "text",
      originalText: "Portobello Road · 那家花店旁边的咖啡馆很可爱。",
      originalLanguage: "zh",
      translations: { en: "Portobello Road · the little cafe next to the florist is really lovely." },
      status: "delivered", createdAt: iso(0.4) },
    { id: "j12", conversationId: cid, senderSide: "them", type: "text",
      originalText: "Perfect 😊 Send me the address when you're free.",
      originalLanguage: "en",
      translations: { zh: "太好了 😊 你有空的时候把地址发给我吧。" },
      status: "delivered", createdAt: iso(0.1) },
  ];
}

function minaMessages(): DemoMessage[] {
  const cid = "cv_mina";
  return [
    { id: "mi1", conversationId: cid, senderSide: "them", type: "text",
      originalText: "好久没见,最近怎么样?", originalLanguage: "zh",
      translations: { en: "Long time no see, how have you been?" },
      status: "read", createdAt: iso(30) },
    { id: "mi2", conversationId: cid, senderSide: "me", type: "text",
      originalText: "都挺好的,你呢?", originalLanguage: "zh",
      translations: { en: "Doing well, and you?" },
      status: "read", createdAt: iso(29.5) },
    { id: "mi3", conversationId: cid, senderSide: "them", type: "text",
      originalText: "我刚到伦敦,下周有空一起喝咖啡吗?",
      originalLanguage: "zh",
      translations: { en: "I just landed in London — free for coffee next week?" },
      status: "delivered", createdAt: iso(1.2) },
  ];
}

function chloeMessages(): DemoMessage[] {
  const cid = "cv_chloe";
  return [
    { id: "ch1", conversationId: cid, senderSide: "me", type: "text",
      originalText: "Try Bocca di Lupo if you like Italian.",
      originalLanguage: "en",
      translations: { zh: "如果你喜欢意大利菜,可以试试 Bocca di Lupo。" },
      status: "read", createdAt: iso(10) },
    { id: "ch2", conversationId: cid, senderSide: "them", type: "text",
      originalText: "I loved the restaurant you recommended 😊",
      originalLanguage: "en",
      translations: { zh: "你推荐的那家餐厅我特别喜欢 😊" },
      status: "read", createdAt: iso(3) },
  ];
}

function linhMessages(): DemoMessage[] {
  const cid = "cv_linh";
  return [
    { id: "li1", conversationId: cid, senderSide: "them", type: "text",
      originalText: "今晚可能会晚一点回复。", originalLanguage: "zh",
      translations: { en: "I may reply a bit late tonight." },
      status: "read", createdAt: iso(6) },
  ];
}

function sofiaMessages(): DemoMessage[] {
  const cid = "cv_sofia";
  return [
    { id: "so1", conversationId: cid, senderSide: "them", type: "voice",
      voiceDuration: 8, createdAt: iso(22) },
    { id: "so2", conversationId: cid, senderSide: "me", type: "text",
      originalText: "Yes! Saturday afternoon works.",
      originalLanguage: "en",
      translations: { zh: "可以!周六下午方便。" },
      status: "read", createdAt: iso(21.5) },
  ];
}

function yukiMessages(): DemoMessage[] {
  const cid = "cv_yuki";
  return [
    { id: "yu1", conversationId: cid, senderSide: "them", type: "text",
      originalText: "谢谢你的关注,很高兴认识你。",
      originalLanguage: "zh",
      translations: { en: "Thanks for following, nice to meet you." },
      status: "read", createdAt: iso(48) },
  ];
}

export const DEMO_MESSAGES: Record<string, DemoMessage[]> = {
  cv_jade:  jadeMessages(),
  cv_mina:  minaMessages(),
  cv_chloe: chloeMessages(),
  cv_linh:  linhMessages(),
  cv_sofia: sofiaMessages(),
  cv_yuki:  yukiMessages(),
};

/** 常用表情 · 24 个 · 供 EmojiPicker 使用 */
export const EMOJI_LIST = [
  "😊","😂","🥰","😉","😍","🤔","😌","🙃",
  "👍","🙏","👏","🙌","💪","✨","💫","🎉",
  "❤️","🧡","💛","💚","💙","💜","🌹","☕",
];

/** 对方的自动回复文案 · 用于发送后 Demo 反馈 */
export function pickAutoReply(peerName: string, locale: "zh" | "en"): string {
  const arr = locale === "zh"
    ? [`收到 · 待会儿再聊`, `听起来不错`, `好的 😊`, `我看一下再回你`]
    : [`Got it · talk soon`, `Sounds good`, `Ok 😊`, `Let me check and get back`];
  const idx = (peerName.charCodeAt(0) + Date.now()) % arr.length;
  return arr[idx];
}
