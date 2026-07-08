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
