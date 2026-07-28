// 私信 workspace · 前端类型 · 不接后端 · 全部 Demo 状态
export type ChatLang = "zh" | "en";

export type MessageType = "text" | "image" | "voice" | "call" | "system";
export type CallType = "voice" | "video";
export type SenderSide = "me" | "them" | "system";
export type MessageStatus = "sending" | "sent" | "delivered" | "read";

export interface DemoMessage {
  id: string;
  conversationId: string;
  senderSide: SenderSide;
  type: MessageType;
  createdAt: string;               // ISO
  status?: MessageStatus;
  // text / voice / image 通用字段
  originalText?: string;
  originalLanguage?: ChatLang;
  translations?: Partial<Record<ChatLang, string>>;
  // image
  imageUrl?: string;
  imageAlt?: string;
  // voice
  voiceDuration?: number;          // seconds
  // call
  callType?: CallType;
  callDuration?: number;           // seconds · 通话时长
  callResult?: "ended" | "missed" | "declined";
}

export interface DemoConversation {
  id: string;
  peerName: string;
  peerAvatarSeed: string;          // 头像首字母 / 色调种子
  peerHandle: string;              // @handle · 无 @
  verified: boolean;
  languages: ChatLang[];
  online: boolean;
  lastActiveMinutesAgo?: number;   // 用于渲染 "在线" / "20 分钟前在线"
  unreadCount: number;
  lastMessagePreview: string;
  lastMessageAt: string;           // ISO
  lastMessageType?: MessageType;   // 用于左侧 "语音/图片" 图标
}
