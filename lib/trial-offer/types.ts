// 高意向用户 24h £0 付费会员体验
export type TrialStatus =
  | "ineligible"
  | "eligible"                  // 已达到解锁条件
  | "consent_pending"           // 已进入 offer modal · 尚未同意订阅授权
  | "payment_mandate_required"  // Production 无真实周期扣款授权 · 卡在此状态 · 不激活权益
  | "active"                    // 24h 体验中 (dev / preview 才可能)
  | "converted"                 // 体验结束 · 已转 £29.99/月
  | "cancelled"                 // 用户在体验期内取消
  | "expired";                  // 体验到期 · 未绑定卡 · 恢复 basic

export interface TrialRecord {
  userId: string;
  status: TrialStatus;
  createdAt: string;
  startedAt?: string;              // active 开始
  endsAt?: string;                 // active 结束 · startedAt + 24h
  cancelledAt?: string;
  convertedAt?: string;
  scheduledPlanId: "paid_monthly"; // 转正必为 £29.99/月
  // Demo · 保留 payment consent 元数据 · 生产接真实 provider 时替换为 provider_customer_id
  consent?: {
    at: string;
    paymentMethodDescriptor: string;   // "Demo 卡 · 4242" 等
  };
}

export interface EligibilitySnapshot {
  // 静态用户信息
  emailVerified: boolean;
  // 已消费过 7 天 £9.99 首充 · 与本次 24h 体验互斥
  hasUsedIntro7d: boolean;
  // 之前是否已经领取过 24h £0 (每个账号一次)
  hasUsedTrial24h: boolean;
  // 当前是否已付费会员 (已付费的不需要体验)
  isCurrentlyPaid: boolean;
  // 进度
  engagementSeconds: number;
  requiredSeconds: number;
  followCount: number;
  requiredFollows: number;
  eligible: boolean;
}
