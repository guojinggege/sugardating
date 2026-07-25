// Provider dispatcher · 未来接真实 provider 时在此注册
import type { PaymentProviderAdapter } from "../types";
import { MockProvider } from "./mock";

const REGISTRY: Record<string, PaymentProviderAdapter> = {
  mock: MockProvider,
  // stripe:    StripeProvider,     // 生产接入时启用
  // adyen:     AdyenProvider,
  // truelayer: TrueLayerProvider,
  // coinbase:  CoinbaseCommerceProvider,
};

export function getProvider(id?: string): PaymentProviderAdapter | undefined {
  if (!id) return undefined;
  return REGISTRY[id];
}
