// Chat — in-memory conversation + messages store
// 未来接后端:替换本 module 内 helper impl,保持 API surface
import { randomBytes } from "node:crypto";
import type { SupportedLocale } from "./translation";

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;         // userId or `creator:${creatorSlug}` for auto-reply
  senderType: "user" | "creator" | "system";
  text: string;
  originalLanguage?: SupportedLocale;
  translatedText?: string;
  translatedTo?: SupportedLocale;
  status: "sending" | "sent" | "delivered" | "read" | "failed";
  createdAt: string;
}

export interface Conversation {
  id: string;
  userId: string;
  creatorSlug: string;
  creatorName: string;
  creatorAvatar?: string;
  creatorLanguages: SupportedLocale[];
  lastMessage?: string;
  lastMessageAt?: string;
  unreadCount: number;
  createdAt: string;
  updatedAt: string;
}

declare global {
  // eslint-disable-next-line no-var
  var __sgConvos: Map<string, Conversation> | undefined;
  // eslint-disable-next-line no-var
  var __sgConvoByUserCreator: Map<string, string> | undefined;   // `${userId}:${creatorSlug}` → convoId
  // eslint-disable-next-line no-var
  var __sgMessages: Map<string, ChatMessage[]> | undefined;      // convoId → messages
}
const convos     = globalThis.__sgConvos ?? new Map<string, Conversation>();
const convoIndex = globalThis.__sgConvoByUserCreator ?? new Map<string, string>();
const messages   = globalThis.__sgMessages ?? new Map<string, ChatMessage[]>();
globalThis.__sgConvos = convos;
globalThis.__sgConvoByUserCreator = convoIndex;
globalThis.__sgMessages = messages;

const idxKey = (uid: string, slug: string) => `${uid}:${slug}`;

// ══════════════════════════════════════
// Seed · 让消息中心冷启动即可展示 · 归属 demo 用户 u_demo
// ══════════════════════════════════════
function seedIfEmpty() {
  if (convos.size > 0) return;
  const now = Date.now();
  const ago = (h: number) => new Date(now - h * 3600_000).toISOString();
  const seedConvo = (id: string, uid: string, slug: string, name: string, langs: SupportedLocale[], unread: number, lastText: string, lastAgo: number) => {
    const conv: Conversation = {
      id, userId: uid, creatorSlug: slug, creatorName: name,
      creatorLanguages: langs,
      lastMessage: lastText, lastMessageAt: ago(lastAgo),
      unreadCount: unread,
      createdAt: ago(lastAgo + 24), updatedAt: ago(lastAgo),
    };
    convos.set(id, conv);
    convoIndex.set(`${uid}:${slug}`, id);
  };
  seedConvo("cv_seed_aria",   "u_demo", "aria",    "Aria M.",  ["zh", "en"],       3, "如果方便,我们视频再聊一下细节 :)", 0.4);
  seedConvo("cv_seed_yuki",   "u_demo", "yuki",    "Yuki",     ["zh", "en", "th"], 1, "刚看到你的消息 · 稍后回复", 2);
  seedConvo("cv_seed_saoirse","u_demo", "saoirse", "Saoirse",  ["en"],             2, "See you tomorrow at 8pm 🌹", 4);
  seedConvo("cv_seed_leon",   "u_demo", "leon",    "Leon.",    ["zh"],             0, "谢谢分享的 Mayfair 那家餐厅推荐", 26);
  seedConvo("cv_seed_yumeko", "u_demo", "yumeko",  "Yumeko",   ["ja", "en", "zh"] as any, 0, "See you next week!", 96);
  seedConvo("cv_seed_mira",   "u_demo", "mira-mayfair", "Mira · Mayfair", ["en"],  1, "本周日下午的按摩预约已确认", 8);
  seedConvo("cv_seed_kenji",  "u_demo", "kenji",   "Kenji",    ["ja", "en"] as any,0, "很高兴认识你 · 有空一起看画展", 168);
  seedConvo("cv_seed_amelia", "u_demo", "amelia-kensington", "Amelia · Kensington", ["en"], 0, "Thanks for the tip 💐", 320);

  messages.set("cv_seed_aria", [
    { id: "m_a1", conversationId: "cv_seed_aria", senderId: "u_demo",       senderType: "user",    text: "Hi Aria,下周一在 Mayfair 有个 dinner event · 有兴趣一起吗?", status: "read", createdAt: ago(3) },
    { id: "m_a2", conversationId: "cv_seed_aria", senderId: "creator:aria", senderType: "creator", text: "听起来不错 · 是几点开始?", originalLanguage: "zh", status: "read", createdAt: ago(2.5) },
    { id: "m_a3", conversationId: "cv_seed_aria", senderId: "u_demo",       senderType: "user",    text: "晚上 7 点半 · 建议提前 30 分钟到,先在 bar 聊一下。", status: "read", createdAt: ago(1) },
    { id: "m_a4", conversationId: "cv_seed_aria", senderId: "creator:aria", senderType: "creator", text: "好的 · 我下午会到附近先看一下 · 见面前把这周的照片发给你参考。", originalLanguage: "zh", status: "delivered", createdAt: ago(0.6) },
    { id: "m_a5", conversationId: "cv_seed_aria", senderId: "creator:aria", senderType: "creator", text: "如果方便,我们视频再聊一下细节 :)", originalLanguage: "zh", status: "delivered", createdAt: ago(0.4) },
  ]);

  messages.set("cv_seed_yuki", [
    { id: "m_y1", conversationId: "cv_seed_yuki", senderId: "u_demo",       senderType: "user",    text: "Yuki,上次的视频通话很开心 😊", status: "read", createdAt: ago(5) },
    { id: "m_y2", conversationId: "cv_seed_yuki", senderId: "creator:yuki", senderType: "creator", text: "我也是 · 下次可以约在东京 shibuya 附近吗", originalLanguage: "zh", status: "read", createdAt: ago(4) },
    { id: "m_y3", conversationId: "cv_seed_yuki", senderId: "u_demo",       senderType: "user",    text: "好啊 · 我 8 月会去", status: "read", createdAt: ago(3) },
    { id: "m_y4", conversationId: "cv_seed_yuki", senderId: "creator:yuki", senderType: "creator", text: "刚看到你的消息 · 稍后回复", originalLanguage: "zh", status: "delivered", createdAt: ago(2) },
  ]);

  messages.set("cv_seed_saoirse", [
    { id: "m_s1", conversationId: "cv_seed_saoirse", senderId: "creator:saoirse", senderType: "creator", text: "Hey · thanks for reaching out ✨", originalLanguage: "en", status: "read", createdAt: ago(8) },
    { id: "m_s2", conversationId: "cv_seed_saoirse", senderId: "u_demo",           senderType: "user",    text: "Would you be free for coffee tomorrow?", status: "read", createdAt: ago(7) },
    { id: "m_s3", conversationId: "cv_seed_saoirse", senderId: "creator:saoirse", senderType: "creator", text: "Yes · afternoon works best for me", originalLanguage: "en", status: "delivered", createdAt: ago(5) },
    { id: "m_s4", conversationId: "cv_seed_saoirse", senderId: "creator:saoirse", senderType: "creator", text: "See you tomorrow at 8pm 🌹", originalLanguage: "en", status: "delivered", createdAt: ago(4) },
  ]);

  messages.set("cv_seed_leon", [
    { id: "m_l1", conversationId: "cv_seed_leon", senderId: "u_demo",       senderType: "user",    text: "推荐你一家 Mount Street 的私厨 · sitting 只接受预约", status: "read", createdAt: ago(30) },
    { id: "m_l2", conversationId: "cv_seed_leon", senderId: "creator:leon", senderType: "creator", text: "谢谢分享的 Mayfair 那家餐厅推荐", originalLanguage: "zh", status: "read", createdAt: ago(26) },
  ]);

  messages.set("cv_seed_yumeko", [
    { id: "m_ym1", conversationId: "cv_seed_yumeko", senderId: "u_demo",         senderType: "user",    text: "Have a lovely trip · let me know when you're back in London", status: "read", createdAt: ago(120) },
    { id: "m_ym2", conversationId: "cv_seed_yumeko", senderId: "creator:yumeko", senderType: "creator", text: "See you next week!", originalLanguage: "en", status: "read", createdAt: ago(96) },
  ]);

  messages.set("cv_seed_mira", [
    { id: "m_m1", conversationId: "cv_seed_mira", senderId: "u_demo",              senderType: "user",    text: "想预约本周日下午的深度放松 · 90 分钟可以吗", status: "read", createdAt: ago(12) },
    { id: "m_m2", conversationId: "cv_seed_mira", senderId: "creator:mira-mayfair", senderType: "creator", text: "本周日下午的按摩预约已确认", originalLanguage: "zh", status: "delivered", createdAt: ago(8) },
  ]);

  messages.set("cv_seed_kenji", [
    { id: "m_k1", conversationId: "cv_seed_kenji", senderId: "creator:kenji", senderType: "creator", text: "很高兴认识你 · 有空一起看画展", originalLanguage: "zh", status: "read", createdAt: ago(168) },
  ]);

  messages.set("cv_seed_amelia", [
    { id: "m_am1", conversationId: "cv_seed_amelia", senderId: "u_demo",                    senderType: "user",    text: "Kensington 那家 tea house 试过吗?下次带你去", status: "read", createdAt: ago(340) },
    { id: "m_am2", conversationId: "cv_seed_amelia", senderId: "creator:amelia-kensington", senderType: "creator", text: "Thanks for the tip 💐", originalLanguage: "en", status: "read", createdAt: ago(320) },
  ]);
}
seedIfEmpty();

export function getOrCreateConversation(
  userId: string,
  creatorSlug: string,
  meta: { creatorName: string; creatorAvatar?: string; creatorLanguages?: SupportedLocale[] },
): Conversation {
  const key = idxKey(userId, creatorSlug);
  const existingId = convoIndex.get(key);
  if (existingId) {
    const conv = convos.get(existingId);
    if (conv) return conv;
  }
  const id = `c_${randomBytes(5).toString("hex")}`;
  const now = new Date().toISOString();
  const conv: Conversation = {
    id, userId, creatorSlug,
    creatorName: meta.creatorName,
    creatorAvatar: meta.creatorAvatar,
    creatorLanguages: meta.creatorLanguages ?? ["zh", "en"],
    unreadCount: 0,
    createdAt: now,
    updatedAt: now,
  };
  convos.set(id, conv);
  convoIndex.set(key, id);
  messages.set(id, []);
  return conv;
}

export function listConversations(userId: string): Conversation[] {
  return Array.from(convos.values())
    .filter((c) => c.userId === userId)
    .sort((a, b) => (b.lastMessageAt ?? b.createdAt).localeCompare(a.lastMessageAt ?? a.createdAt));
}

export function getConversation(userId: string, convoId: string): Conversation | null {
  const c = convos.get(convoId);
  if (!c || c.userId !== userId) return null;
  return c;
}

export function listMessages(userId: string, convoId: string): ChatMessage[] {
  const c = convos.get(convoId);
  if (!c || c.userId !== userId) return [];
  return messages.get(convoId) ?? [];
}

export function appendMessage(convoId: string, msg: Omit<ChatMessage, "id" | "conversationId" | "createdAt">): ChatMessage {
  const full: ChatMessage = {
    ...msg,
    id: `m_${randomBytes(5).toString("hex")}`,
    conversationId: convoId,
    createdAt: new Date().toISOString(),
  };
  const arr = messages.get(convoId) ?? [];
  arr.push(full);
  messages.set(convoId, arr);
  const c = convos.get(convoId);
  if (c) {
    c.lastMessage = full.text.slice(0, 100);
    c.lastMessageAt = full.createdAt;
    c.updatedAt = full.createdAt;
    convos.set(convoId, c);
  }
  return full;
}

export function markConversationRead(userId: string, convoId: string): Conversation | null {
  const c = convos.get(convoId);
  if (!c || c.userId !== userId) return null;
  c.unreadCount = 0;
  convos.set(convoId, c);
  const arr = messages.get(convoId) ?? [];
  for (const m of arr) {
    if (m.senderType === "creator" && m.status !== "read") m.status = "read";
  }
  return c;
}

export function countTotalUnread(userId: string): number {
  return Array.from(convos.values())
    .filter((c) => c.userId === userId)
    .reduce((s, c) => s + (c.unreadCount ?? 0), 0);
}

// Mock creator auto-reply (delay simulation caller-side)
export function creatorAutoReply(convoId: string, creatorLang: SupportedLocale = "zh"): ChatMessage | null {
  const c = convos.get(convoId);
  if (!c) return null;
  const replies: Record<SupportedLocale, string[]> = {
    zh: ["嗨~ 谢谢关注 👋", "在的,你今天怎么样?", "可以先看看我的主页,有兴趣的服务可以直接问我。", "我通常晚上比较活跃"],
    en: ["Hi! Thanks for reaching out 👋", "I'm here — how's your day?", "Feel free to browse my profile, ask me anything.", "I'm usually more active in the evenings"],
    th: ["สวัสดีค่ะ 👋", "อยู่ค่ะ วันนี้เป็นยังไงบ้าง?", "ดูโปรไฟล์ก่อนได้เลยนะคะ", "โดยปกติจะออนไลน์ตอนเย็น"],
    vi: ["Chào bạn 👋", "Mình đây, hôm nay bạn thế nào?", "Xem qua profile của mình trước nha.", "Mình thường online vào buổi tối"],
    fil: ["Kumusta! 👋", "Nandito ako — ok ang araw mo?", "Tingnan mo muna ang profile ko.", "Mas madalas akong online sa gabi"],
  };
  const pool = replies[creatorLang] || replies.zh;
  const text = pool[Math.floor(Math.random() * pool.length)];
  return appendMessage(convoId, {
    senderId: `creator:${c.creatorSlug}`,
    senderType: "creator",
    text,
    originalLanguage: creatorLang,
    status: "delivered",
  });
}
