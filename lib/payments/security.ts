// Webhook 安全 · 签名验证 · secret 从环境变量读取
// 生产接入 provider 时:每个 provider 有自己的 signature 计算方式
// P0 · mock provider 用简单 HMAC-SHA256(shared_secret, body)
import { createHmac, timingSafeEqual } from "node:crypto";

export function computeMockSignature(secret: string, body: string): string {
  return createHmac("sha256", secret).update(body).digest("hex");
}

export function verifyMockSignature(secret: string, body: string, provided: string): boolean {
  if (!provided) return false;
  const expected = computeMockSignature(secret, body);
  const a = Buffer.from(expected, "hex");
  const b = Buffer.from(provided, "hex");
  if (a.length !== b.length) return false;
  try { return timingSafeEqual(a, b); } catch { return false; }
}

export function getMockWebhookSecret(): string {
  return process.env.PAYMENTS_MOCK_WEBHOOK_SECRET || "sd-mock-webhook-secret-change-me";
}
