// 支付方式 · 纯展示 · 无 provider · 无 API 调用
// 与 lib/payments/config.ts 分开维护 · 后者是未来接真实 provider 的注册表
// 本文件仅用于购买按钮弹窗展示 9 种英国常见支付方式

export interface DisplayPaymentMethod {
  id: string;
  title: string;
  subtitle: string;
  /** 简短标识 · icon 由组件端 map 到 SVG/emoji */
  iconKey: "card" | "apple-pay" | "google-pay" | "paypal" | "pay-by-bank" | "bank-transfer" | "direct-debit" | "usdc" | "usdt";
}

export const DISPLAY_PAYMENT_METHODS: DisplayPaymentMethod[] = [
  { id: "card",          iconKey: "card",          title: "Visa / Mastercard / American Express", subtitle: "信用卡或借记卡" },
  { id: "apple_pay",     iconKey: "apple-pay",     title: "Apple Pay",     subtitle: "使用 Apple Wallet 快速付款" },
  { id: "google_pay",    iconKey: "google-pay",    title: "Google Pay",    subtitle: "使用 Google Wallet 快速付款" },
  { id: "paypal",        iconKey: "paypal",        title: "PayPal",        subtitle: "使用 PayPal 账户付款" },
  { id: "pay_by_bank",   iconKey: "pay-by-bank",   title: "Pay by Bank",   subtitle: "通过英国银行 App 确认付款" },
  { id: "bank_transfer", iconKey: "bank-transfer", title: "Bank Transfer", subtitle: "使用英国银行账户完成转账" },
  { id: "direct_debit",  iconKey: "direct-debit",  title: "Direct Debit",  subtitle: "适用于周期性会员付款" },
  { id: "usdc",          iconKey: "usdc",          title: "USDC",          subtitle: "使用 USDC 稳定币付款" },
  { id: "usdt",          iconKey: "usdt",          title: "USDT",          subtitle: "使用 USDT 稳定币付款" },
];
