// 支付方式注册表 · 服务端唯一权威 · 前端只显示 status=enabled 且 provider 已配置的方式
// 生产接入前:仅 mock 提供者可用 (前提是环境变量 PAYMENTS_ALLOW_MOCK=true 或 dev 环境)
import type { PaymentMethodConfig, PaymentMethodType } from "./types";

/**
 * 一切支付方式的默认 registry · 保守配置:
 * - Card / Google Pay / Apple Pay / PayPal / USDT / voucher = 默认 disabled 或 approval_required
 * - Open Banking / Bank Transfer / USDC = enabled 但 provider = "mock" (Demo)
 * - 生产接入真实 provider 后 · 在 CMS 或环境变量层面切换 provider · 才会真正上架
 */
export const DEFAULT_PAYMENT_METHODS: PaymentMethodConfig[] = [
  {
    id:                  "pm_card_default",
    type:                "card",
    displayName:         "信用卡或借记卡",
    description:         "Visa · Mastercard · 支持 3D Secure",
    status:              "approval_required",   // 默认未接通 · 后台审核 + provider 环境变量后启用
    provider:            undefined,
    supportedCountries:  ["GB"],
    supportedCurrencies: ["GBP"],
    supportsOneOff:      true,
    supportsRecurring:   true,
    requiresRedirect:    false,
    sortOrder:           10,
    icon:                "card",
    adminNote:           "生产启用需要接通经过审核的收单机构 · 设置环境变量 PAYMENTS_CARD_PROVIDER",
    badges:              ["instant"],
  },
  {
    id:                  "pm_google_pay",
    type:                "google_pay",
    displayName:         "Google Pay",
    description:         "使用 Google Pay 快速结账",
    status:              "approval_required",
    supportedCountries:  ["GB"],
    supportedCurrencies: ["GBP"],
    supportsOneOff:      true,
    supportsRecurring:   false,
    requiresRedirect:    false,
    sortOrder:           20,
    icon:                "gpay",
    adminNote:           "需底层收单机构支持 · 需 Google Pay Business Console 审核",
  },
  {
    id:                  "pm_apple_pay",
    type:                "apple_pay",
    displayName:         "Apple Pay",
    description:         "使用 Apple Pay 快速结账",
    status:              "disabled",           // 明确默认 disabled
    supportedCountries:  ["GB"],
    supportedCurrencies: ["GBP"],
    supportsOneOff:      true,
    supportsRecurring:   false,
    requiresRedirect:    false,
    sortOrder:           30,
    icon:                "apay",
    adminNote:           "需业务类别、支付商、Apple 使用规则、商户审核均明确允许",
  },
  {
    id:                  "pm_paypal",
    type:                "paypal",
    displayName:         "PayPal",
    description:         "使用 PayPal 账户结账",
    status:              "approval_required",
    supportedCountries:  ["GB"],
    supportedCurrencies: ["GBP"],
    supportsOneOff:      true,
    supportsRecurring:   true,
    requiresRedirect:    true,
    sortOrder:           40,
    icon:                "paypal",
    adminNote:           "需 PayPal 账户获得业务类别审核批准",
  },
  {
    id:                  "pm_open_banking",
    type:                "open_banking",
    displayName:         "Pay by Bank",
    description:         "打开英国银行 App · Faster Payments 即时确认",
    status:              "enabled",
    provider:            "mock",
    supportedCountries:  ["GB"],
    supportedCurrencies: ["GBP"],
    supportsOneOff:      true,
    supportsRecurring:   false,
    requiresRedirect:    true,
    sortOrder:           50,
    icon:                "bank-app",
    badges:              ["instant", "requires-bank-app", "no-auto-renew"],
    adminNote:           "需签约受监管 PISP · 例:TrueLayer / Yapily / Tink",
  },
  {
    id:                  "pm_bank_transfer",
    type:                "bank_transfer",
    displayName:         "银行转账",
    description:         "手动转账到 Sugardating 收款账户 · 1-3 小时人工确认",
    status:              "enabled",
    provider:            "mock",
    supportedCountries:  ["GB"],
    supportedCurrencies: ["GBP"],
    supportsOneOff:      true,
    supportsRecurring:   false,
    requiresRedirect:    false,
    sortOrder:           60,
    icon:                "transfer",
    badges:              ["no-auto-renew"],
    adminNote:           "生产环境:收款账户信息由 server-side config 提供 (不 hardcode)",
  },
  {
    id:                  "pm_usdc",
    type:                "usdc",
    displayName:         "USDC",
    description:         "使用 USDC 支付 · 网络与地址由支付网关返回",
    status:              "enabled",
    provider:            "mock",
    supportedCountries:  [],                    // 无地区限制
    supportedCurrencies: ["GBP"],
    supportsOneOff:      true,
    supportsRecurring:   false,
    requiresRedirect:    false,
    networks:            ["ethereum", "polygon", "base", "arbitrum"],
    sortOrder:           70,
    icon:                "usdc",
    badges:              ["crypto", "no-auto-renew"],
    adminNote:           "需合规 Crypto Payment Gateway · 例:Coinbase Commerce / BitPay",
  },
  {
    id:                  "pm_usdt",
    type:                "usdt",
    displayName:         "USDT",
    description:         "使用 USDT 支付",
    status:              "disabled",           // 默认严格 disabled
    supportedCountries:  [],
    supportedCurrencies: ["GBP"],
    supportsOneOff:      true,
    supportsRecurring:   false,
    requiresRedirect:    false,
    networks:            ["ethereum", "tron"],
    sortOrder:           80,
    icon:                "usdt",
    badges:              ["crypto", "no-auto-renew"],
    adminNote:           "需支付网关明确支持:英国商户 + 业务类别 + Merchant Acceptance + 网络 + 结算方式",
  },
  {
    id:                  "pm_prepaid_voucher",
    type:                "prepaid_voucher",
    displayName:         "预付券",
    description:         "使用预付券支付",
    status:              "disabled",
    supportedCountries:  ["GB"],
    supportedCurrencies: ["GBP"],
    supportsOneOff:      true,
    supportsRecurring:   false,
    requiresRedirect:    true,
    sortOrder:           90,
    icon:                "voucher",
    adminNote:           "需真实签约 Neosurf / paysafecard 后启用",
  },
];

// ══════════════════════════════════════
// 运行时可用性判断 · 生产环境规则
// ══════════════════════════════════════

/**
 * Provider 是否有可用配置 (env 变量或 mock 启用)
 * mock provider 只在 dev 或 PAYMENTS_ALLOW_MOCK=true 时可用
 */
function providerAvailable(providerId?: string): boolean {
  if (!providerId) return false;
  if (providerId === "mock") {
    if (process.env.NODE_ENV !== "production") return true;
    return process.env.PAYMENTS_ALLOW_MOCK === "true";
  }
  // 真实 provider · 检查各自的 env 变量
  if (providerId === "stripe")     return !!process.env.STRIPE_SECRET_KEY;
  if (providerId === "adyen")      return !!process.env.ADYEN_API_KEY;
  if (providerId === "truelayer")  return !!process.env.TRUELAYER_CLIENT_SECRET;
  if (providerId === "coinbase")   return !!process.env.COINBASE_COMMERCE_KEY;
  return false;
}

/** 前台可显示的支付方式 · 通过所有闸门 */
export function listAvailableMethods(opts: {
  country?: string;
  currency?: string;
  orderType?: "one_off" | "recurring";
}): PaymentMethodConfig[] {
  const country = opts.country ?? "GB";
  const currency = opts.currency ?? "GBP";
  return DEFAULT_PAYMENT_METHODS
    .filter((m) => m.status === "enabled")
    .filter((m) => providerAvailable(m.provider))
    .filter((m) => m.supportedCountries.length === 0 || m.supportedCountries.includes(country))
    .filter((m) => m.supportedCurrencies.length === 0 || m.supportedCurrencies.includes(currency))
    .filter((m) => opts.orderType === "recurring" ? m.supportsRecurring : m.supportsOneOff)
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

export function getMethodById(id: string): PaymentMethodConfig | undefined {
  return DEFAULT_PAYMENT_METHODS.find((m) => m.id === id);
}

/** Admin 完整列表 · 包含 approval_required 与 disabled · 附环境状态 */
export function listAllMethodsAdmin(): Array<PaymentMethodConfig & { providerConfigured: boolean }> {
  return DEFAULT_PAYMENT_METHODS.map((m) => ({
    ...m,
    providerConfigured: providerAvailable(m.provider),
  }));
}
