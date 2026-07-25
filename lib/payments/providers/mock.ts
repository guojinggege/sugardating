// Demo Mock Payment Provider
// - 仅在 dev 或 PAYMENTS_ALLOW_MOCK=true 时激活
// - 用于本地测试整个 checkout / webhook 链路
// - 生产未接入真实 provider 时:方法在前台不可点
import { randomBytes } from "node:crypto";
import type {
  PaymentProviderAdapter, PaymentProviderCapabilities, CreatePaymentResult,
  ProviderPaymentStatus, VerifiedWebhookEvent, CheckoutOrder, PaymentMethodConfig,
} from "../types";
import { verifyMockSignature, getMockWebhookSecret } from "../security";

const MOCK_BILLING_DESCRIPTOR = "SUGARDATING (Demo)";

export const MockProvider: PaymentProviderAdapter = {
  id: "mock",

  async getCapabilities(): Promise<PaymentProviderCapabilities> {
    return {
      id: "mock",
      displayName: "Sugardating Demo Provider",
      supportedMethods: ["card", "open_banking", "bank_transfer", "usdc"],
      billingDescriptor: MOCK_BILLING_DESCRIPTOR,
      supportedCurrencies: ["GBP"],
      supportedNetworks: ["ethereum", "polygon", "base", "arbitrum"],
      isMock: true,
    };
  },

  async createPayment(order: CheckoutOrder, method: PaymentMethodConfig): Promise<CreatePaymentResult> {
    const providerOrderId = `mock_${randomBytes(6).toString("hex")}`;

    if (method.type === "usdc") {
      // Mock crypto details
      const rate = 1.27;   // 1 GBP → 1.27 USDC (mock)
      const amount = ((order.amount / 100) * rate).toFixed(2);
      return {
        ok: true,
        providerOrderId,
        crypto: {
          asset: "USDC",
          network: method.networks?.[0] ?? "polygon",
          amount,
          address: `0x${randomBytes(20).toString("hex")}`,
          qrCode: undefined,   // 前端根据 address+amount 生成
          exchangeRate: `1 GBP ≈ ${rate.toFixed(4)} USDC`,
          expiresAt: new Date(Date.now() + 20 * 60_000).toISOString(),
          confirmationsRequired: 2,
          confirmationsReceived: 0,
        },
      };
    }

    if (method.type === "bank_transfer") {
      return {
        ok: true,
        providerOrderId,
        bankTransfer: {
          accountName:   "Sugardating Ltd (Demo)",
          accountNumber: "•••• 4823",
          sortCode:      "•• •• 34",
          reference:     order.reference,
          estimatedMinutes: "1-3 hours",
        },
      };
    }

    if (method.type === "open_banking") {
      // 真实 provider 会返回 bank selector URL · demo 用本页 simulate 接口
      return {
        ok: true,
        providerOrderId,
        redirectUrl: `/checkout/${order.id}?method=open_banking&sim=1`,
      };
    }

    // card / default · 前端会打开一个 demo panel
    return { ok: true, providerOrderId };
  },

  async getPaymentStatus(providerOrderId: string): Promise<ProviderPaymentStatus> {
    // Demo · 不主动查询 · 状态由 simulate 端点或 webhook 推动
    return { ok: true, status: "processing", providerTransactionId: providerOrderId };
  },

  async verifyWebhook(req: Request): Promise<VerifiedWebhookEvent> {
    const raw = await req.text();
    const sig = req.headers.get("x-sd-mock-signature") ?? "";
    if (!verifyMockSignature(getMockWebhookSecret(), raw, sig)) {
      return { ok: false, eventId: "", message: "invalid signature" };
    }
    try {
      const body = JSON.parse(raw);
      return {
        ok: true,
        eventId:               String(body?.eventId ?? randomBytes(4).toString("hex")),
        providerOrderId:       body?.providerOrderId,
        providerTransactionId: body?.providerTransactionId,
        amount:                Number(body?.amount) || undefined,
        currency:              body?.currency,
        status:                body?.status,
      };
    } catch {
      return { ok: false, eventId: "", message: "invalid payload" };
    }
  },
};
