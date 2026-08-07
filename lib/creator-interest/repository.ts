// Sugargirl 入驻意向 · Prisma 持久化 · 内存兜底
// 主写走 Prisma (Neon) · 若表未 migrate 或 DB 短暂不可用 · fallback 到 globalThis Map
// (fallback 只在冷启动前保住数据 · 用户跑 db:deploy 后即完全走 DB)
//
// 敏感字段 (telephone / email / mobile) 永远不写日志 / URL / analytics
import { prisma } from "@/lib/db";
import { randomBytes, createHash } from "node:crypto";

export type InterestStatus = "student" | "employed" | "freelancer";

export interface CreatorInterestInput {
  nickname: string;
  city: string;
  status: InterestStatus;
  telephone?: string | null;
  email?: string | null;
  mobile?: string | null;
  locale?: "zh" | "en" | null;
  source?: string | null;
  ipHash?: string | null;
  userAgent?: string | null;
}

export interface CreatorInterestRecord extends CreatorInterestInput {
  id: string;
  createdAt: Date;
}

declare global {
  // eslint-disable-next-line no-var
  var __sgCreatorInterests: CreatorInterestRecord[] | undefined;
}
const memStore: CreatorInterestRecord[] = globalThis.__sgCreatorInterests ?? [];
globalThis.__sgCreatorInterests = memStore;

export async function createInterest(input: CreatorInterestInput): Promise<CreatorInterestRecord> {
  try {
    const row = await (prisma as any).creatorInterest.create({ data: input });
    return row as CreatorInterestRecord;
  } catch (e: any) {
    // 表不存在 (P2021) / 客户端未生成 · 走内存兜底
    // 生产建议:npm run db:deploy 后重启
    if (process.env.NODE_ENV !== "production") {
      // 开发期可能 schema 未 push · 只打印元信息 · 不打印 input (含敏感字段)
      console.warn("[creator-interest] Prisma failed, using in-memory:", e?.code || e?.name || "unknown");
    }
    const rec: CreatorInterestRecord = {
      id: `mem_${randomBytes(6).toString("hex")}`,
      ...input,
      createdAt: new Date(),
    };
    memStore.push(rec);
    return rec;
  }
}

/** IP → 稳定短哈希 · 反滥用去重 · 不能反向推 IP */
export function hashIp(ip: string | null | undefined): string | null {
  if (!ip) return null;
  const salt = process.env.INTEREST_HASH_SALT || "sugardating-interest-v1";
  return createHash("sha256").update(salt + ip).digest("hex").slice(0, 12);
}

/** 24h 内同一 IP 提交次数 · 用于限流 · 内存 fallback 也算 */
export async function recentSubmitCountByIpHash(ipHash: string): Promise<number> {
  const since = new Date(Date.now() - 24 * 3600 * 1000);
  try {
    const n = await (prisma as any).creatorInterest.count({
      where: { ipHash, createdAt: { gte: since } },
    });
    return n;
  } catch {
    return memStore.filter((r) => r.ipHash === ipHash && r.createdAt >= since).length;
  }
}
