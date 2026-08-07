// Sugargirl 入驻意向 · Prisma 持久化 · 内存兜底
// 主写走 Prisma (Neon) · 若表未 migrate 或 DB 短暂不可用 · fallback 到 globalThis Map
// (fallback 只在冷启动前保住数据 · 用户跑 db:deploy 后即完全走 DB)
//
// 敏感字段 (telephone / email / mobile) 永远不写日志 / URL / analytics
import { prisma } from "@/lib/db";
import { randomBytes, createHash } from "node:crypto";

export type InterestStatus = "student" | "employed" | "freelancer";
export type ReviewStatus = "submitted" | "reviewing" | "needs_changes" | "approved" | "rejected";

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
  reviewStatus: ReviewStatus;
  reviewNotes?: string | null;
  reviewedAt?: Date | null;
  reviewedBy?: string | null;
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
    if (process.env.NODE_ENV !== "production") {
      console.warn("[creator-interest] Prisma create failed, using in-memory:", e?.code || e?.name || "unknown");
    }
    const rec: CreatorInterestRecord = {
      id: `mem_${randomBytes(6).toString("hex")}`,
      ...input,
      createdAt: new Date(),
      reviewStatus: "submitted",
      reviewNotes: null,
      reviewedAt: null,
      reviewedBy: null,
    };
    memStore.push(rec);
    return rec;
  }
}

// ══════════════════════════════════════
// Admin · 读 / 更新 · 全部走 Prisma · 表未 migrate 时 fallback 到内存
// ══════════════════════════════════════

export async function listInterests(filter?: { reviewStatus?: ReviewStatus }): Promise<CreatorInterestRecord[]> {
  try {
    const rows = await (prisma as any).creatorInterest.findMany({
      where: filter?.reviewStatus ? { reviewStatus: filter.reviewStatus } : undefined,
      orderBy: { createdAt: "desc" },
    });
    return rows as CreatorInterestRecord[];
  } catch (e: any) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[creator-interest] Prisma list failed, using in-memory:", e?.code || e?.name || "unknown");
    }
    const rows = filter?.reviewStatus
      ? memStore.filter((r) => r.reviewStatus === filter.reviewStatus)
      : memStore.slice();
    return rows.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
}

export async function getInterest(id: string): Promise<CreatorInterestRecord | null> {
  try {
    const row = await (prisma as any).creatorInterest.findUnique({ where: { id } });
    return (row as CreatorInterestRecord) ?? null;
  } catch {
    return memStore.find((r) => r.id === id) ?? null;
  }
}

export async function updateInterestReview(
  id: string,
  patch: { reviewStatus?: ReviewStatus; reviewNotes?: string | null },
  actorId?: string,
): Promise<CreatorInterestRecord | null> {
  const now = new Date();
  const data: any = { ...patch, reviewedAt: now };
  if (actorId) data.reviewedBy = actorId;
  try {
    const row = await (prisma as any).creatorInterest.update({ where: { id }, data });
    return row as CreatorInterestRecord;
  } catch (e: any) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[creator-interest] Prisma update failed, using in-memory:", e?.code || e?.name || "unknown");
    }
    const idx = memStore.findIndex((r) => r.id === id);
    if (idx === -1) return null;
    memStore[idx] = { ...memStore[idx], ...patch, reviewedAt: now, reviewedBy: actorId ?? memStore[idx].reviewedBy ?? null };
    return memStore[idx];
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
