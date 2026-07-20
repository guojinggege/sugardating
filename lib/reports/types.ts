// 举报中心 · 数据类型 (P0 mock · in-memory globalThis)

export type ReportScene = "online" | "offline";

// 线上问题分类
export type OnlineCategory =
  | "scam"                    // 诈骗 / 骗钱
  | "harassment"              // 骚扰 / 语言侵犯
  | "fake_profile"            // 资料不实 / 假照片
  | "underage"                // 未成年相关
  | "privacy_leak"            // 隐私泄露 / 未经授权传播
  | "off_platform_payment"    // 站外付款诱导
  | "hate_speech"             // 仇恨言论
  | "impersonation"           // 冒充他人 / 平台工作人员
  | "spam"                    // 垃圾信息 / 广告
  | "other_online";

// 线下问题分类
export type OfflineCategory =
  | "no_show"                 // 爽约
  | "safety_incident"         // 见面时不安全感
  | "coerced"                 // 被强迫或胁迫
  | "physical_harm"           // 人身伤害
  | "theft"                   // 财物被拿走
  | "misrepresentation"       // 与线上完全不符
  | "off_platform_solicitation" // 见面时被要求走站外
  | "other_offline";

export type ReportCategory = OnlineCategory | OfflineCategory;

export type ReportTargetType =
  | "creator"        // 目标创作者 profile
  | "user"           // 普通用户 (通过用户 ID)
  | "chat"           // 聊天会话
  | "booking"        // 预约记录
  | "custom_service" // 定制服务需求
  | "media"          // 媒体资源 (图片/视频)
  | "community_post" // 私语广场帖子
  | "self_general";  // 无具体对象 (泛安全反馈)

export interface ReportTarget {
  type: ReportTargetType;
  id?: string;                // 若能定位到具体记录
  label?: string;             // 展示用 · 例:"Aria M. · sugargirl"
}

export type ReportStatus =
  | "submitted"          // 已提交 · 等待安全团队初审
  | "reviewing"          // 审核中
  | "awaiting_evidence"  // 等待用户补充材料
  | "resolved"           // 已完成 · 已采取行动
  | "dismissed"          // 已驳回 · 无违规
  | "escalated";         // 已上报 · 转交合规团队

export type ReportSeverity = "low" | "medium" | "high" | "critical";

export interface ReportEvidence {
  id: string;
  filename: string;
  mimeType: string;
  sizeBytes: number;
  description?: string;
  addedBy: "user" | "staff";
  addedAt: string;             // ISO
  // P0 决定:仅元数据 · 不存内容 · 后续接 Blob 只加 url 字段
  url?: string;
}

export type ReportActionKind =
  | "acknowledge"        // 已收到 · 排队处理
  | "request_evidence"   // 要求补充材料
  | "internal_note"      // 内部备注 · 用户不可见
  | "reply"              // 公开回复给举报人
  | "resolve"            // 关闭 · 已处理
  | "dismiss"            // 驳回
  | "escalate";          // 上报

export interface ReportAction {
  id: string;
  reportId: string;
  kind: ReportActionKind;
  message?: string;
  actorId: string;            // 举报人 / 管理员 ID
  actorRole: "user" | "staff";
  actorName?: string;
  createdAt: string;
  visibleToUser: boolean;     // false = internal note
  statusAfter?: ReportStatus; // 触发此 action 后的状态
}

export interface Report {
  id: string;                 // 例: rpt_2xk4a8
  publicRef: string;          // 用户可分享的编号 · 例: SD-2026-000042
  reporterId: string;
  reporterEmail?: string;     // 快照 · 便于 admin 联系
  scene: ReportScene;
  category: ReportCategory;
  target: ReportTarget;

  title: string;              // 用户输入 · 例: "对方一直索要转账"
  description: string;        // 详细经过
  occurredAt?: string;        // 事件发生时间 · 用户可填
  location?: string;          // 线下时可填 · 城市/区域 · 不强制精确
  contactPreference: "email" | "in_app" | "no_contact";
  agreedToTerms: boolean;

  status: ReportStatus;
  severity: ReportSeverity;
  evidence: ReportEvidence[];
  actions: ReportAction[];    // timeline

  createdAt: string;
  updatedAt: string;

  // Admin 专用
  assignedTo?: string;        // admin email
  internalTags?: string[];
}

// 创建时 payload
export interface ReportCreateInput {
  scene: ReportScene;
  category: ReportCategory;
  target: ReportTarget;
  title: string;
  description: string;
  occurredAt?: string;
  location?: string;
  contactPreference: "email" | "in_app" | "no_contact";
  agreedToTerms: boolean;
  evidence?: Omit<ReportEvidence, "id" | "addedBy" | "addedAt">[];
}

// Wizard step state · 客户端使用
export interface WizardState {
  step: number;                              // 0-5
  scene?: ReportScene;
  category?: ReportCategory;
  target?: ReportTarget;
  title: string;
  description: string;
  occurredAt: string;
  location: string;
  contactPreference: "email" | "in_app" | "no_contact";
  evidence: Omit<ReportEvidence, "id" | "addedBy" | "addedAt">[];
  agreedToTerms: boolean;
}
