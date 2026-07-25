// 支付系统 · 全套 TypeScript 类型
// P0 · Mock provider 默认 · 生产接入真实 provider 前不展示

export type PaymentMethodStatus =
  | "enabled"                // 生产可用
  | "approval_required"      // 等待支付商审核 · 仅 CMS 可见
  | "disabled";              // 完全不展示

export type PaymentMethodType =
  | "card"
  | "google_pay"
  | "apple_pay"
  | "paypal"
  | "open_banking"
  | "bank_transfer"
  | "usdc"
  | "usdt"
  | "prepaid_voucher";

export type CryptoNetwork = "ethereum" | "polygon" | "arbitrum" | "base" | "solana" | "tron" | "bsc";

export interface PaymentMethodConfig {
  id: string;
  type: PaymentMethodType;
  displayName: string;
  description: string;
  status: PaymentMethodStatus;
  provider?: string;                       // 关联的 provider adapter id (未配置时不显示)
  supportedCountries: string[];            // ISO codes · ["GB"] · [] = 全球
  supportedCurrencies: string[];           // ["GBP"]
  supportsOneOff: boolean;
  supportsRecurring: boolean;
  requiresKyc?: boolean;
  requiresRedirect?: boolean;
  networks?: CryptoNetwork[];              // crypto only
  sortOrder: number;
  icon?: string;                           // path or emoji
  adminNote?: string;
  // 展示 badge
  badges?: Array<"recommended" | "instant" | "no-auto-renew" | "requires-bank-app" | "crypto">;
}

// ══════════════════════════════════════
// Orders
// ══════════════════════════════════════

export type CheckoutOrderStatus =
  | "created"
  | "awaiting_payment"
  | "processing"
  | "paid"
  | "failed"
  | "expired"
  | "cancelled"
  | "refunded"
  | "chargeback";

export interface CheckoutCryptoDetails {
  asset: "USDC" | "USDT";
  network: CryptoNetwork;
  amount: string;                          // 已换算后的加密货币金额 (字符串保精度)
  address?: string;                        // 由 provider 返回 · 不硬编码
  qrCode?: string;                         // data-url 或公开 QR image URL
  exchangeRate?: string;                   // 1 GBP = X USDC
  expiresAt?: string;                      // ISO
  confirmationsRequired?: number;
  confirmationsReceived?: number;
}

export interface CheckoutOrder {
  id: string;
  reference: string;                       // SD-CHK-2026-000001 · 用户可分享
  userId: string;
  type: "membership" | "credits";

  productId: string;                       // planId 或 packageId · 由 server 从 config 查价
  productName: string;                     // 快照 · 例:付费会员 · 3 个月
  amount: number;                          // pence · 单位 pence · 保精度
  currency: "GBP";
  displayAmount: number;                   // £ · UI 显示用 · = amount / 100

  status: CheckoutOrderStatus;

  paymentMethodId?: string;                // config.id
  provider?: string;
  providerOrderId?: string;                // provider 返回的 order/session id
  providerTransactionId?: string;          // 最终成交 tx · 幂等 key
  handledEvents?: string[];                // 已处理的 webhook event ids · 幂等

  autoRenew: boolean;
  billingDescriptor?: string;              // 由 provider capability 返回 · 不硬编码

  crypto?: CheckoutCryptoDetails;

  // membership 专用快照
  membership?: {
    planId: string;
    periodDays: number;
    isIntro: boolean;
  };
  // credits 专用快照
  credits?: {
    packageId: string;
    creditAmount: number;
  };

  createdAt: string;
  updatedAt: string;
  paidAt?: string;
  expiresAt?: string;                      // 订单本身过期 (未支付) · 与 crypto.expiresAt 不同
}

// ══════════════════════════════════════
// Provider Adapter API surface
// ══════════════════════════════════════

export interface PaymentProviderCapabilities {
  id: string;
  displayName: string;
  supportedMethods: PaymentMethodType[];
  billingDescriptor?: string;              // 由 provider 返回真实商户描述
  supportedCurrencies: string[];
  supportedNetworks?: CryptoNetwork[];
  isMock: boolean;                         // demo mode 时 true
}

export interface CreatePaymentResult {
  ok: boolean;
  providerOrderId?: string;
  redirectUrl?: string;                    // 需要跳转的 provider hosted page
  crypto?: CheckoutCryptoDetails;
  bankTransfer?: {
    accountName: string;
    accountNumber: string;
    sortCode: string;
    reference: string;
    estimatedMinutes: string;              // 例:"1-3 hours" · 由 provider 决定
  };
  message?: string;
}

export interface ProviderPaymentStatus {
  ok: boolean;
  status: CheckoutOrderStatus;
  providerTransactionId?: string;
  paidAt?: string;
}

export interface VerifiedWebhookEvent {
  ok: boolean;
  eventId: string;                         // 用于幂等
  providerOrderId?: string;
  providerTransactionId?: string;
  amount?: number;                         // pence
  currency?: string;
  status?: CheckoutOrderStatus;
  message?: string;
}

export interface PaymentProviderAdapter {
  id: string;
  getCapabilities(): Promise<PaymentProviderCapabilities>;
  createPayment(order: CheckoutOrder, method: PaymentMethodConfig): Promise<CreatePaymentResult>;
  getPaymentStatus(providerOrderId: string): Promise<ProviderPaymentStatus>;
  verifyWebhook(req: Request): Promise<VerifiedWebhookEvent>;
}

// ══════════════════════════════════════
// Share payload (used across share module)
// ══════════════════════════════════════

// (share types 独立在 lib/share)
