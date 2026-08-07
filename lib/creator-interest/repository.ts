// Sugargirl 入驻意向 · Prisma 持久化
// 生产环境:严格走 Prisma · 失败即抛错(不能让用户看到假成功)
// 开发/preview:失败允许 fallback 到内存 · 便于本地 DX
//
// 敏感字段 (telephone / email / mobile) 永远不写日志 / URL / analytics
import { prisma } from "@/lib/db";
import { randomBytes, createHash } from "node:crypto";

const IS_PROD = process.env.NODE_ENV === "production";

/** Prisma table-missing / client-not-generated 判定 */
function isSchemaMissing(e: any): boolean {
  const code = e?.code;
  // P2021 · The table does not exist
  // P2022 · Column does not exist
  return code === "P2021" || code === "P2022" || /does not exist in the current database/i.test(String(e?.message || ""));
}

export class InterestPersistError extends Error {
  code: string;
  cause?: unknown;
  constructor(code: string, message: string, cause?: unknown) {
    super(message);
    this.code = code;
    this.cause = cause;
  }
}

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
    const schemaGone = isSchemaMissing(e);
    // 生产:一律抛错 · 用户不能看到假成功
    if (IS_PROD) {
      console.error("[creator-interest] persist FAILED in prod:", e?.code || e?.name || "unknown");
      throw new InterestPersistError(
        schemaGone ? "TABLE_MISSING" : "DB_ERROR",
        schemaGone
          ? "CreatorInterest 表尚未在生产 DB 创建 · 需在 Neon 执行 prisma migrate deploy"
          : "写入生产数据库失败",
        e,
      );
    }
    // 开发 / preview:允许内存兜底 · 便于本地开发
    console.warn("[creator-interest] Prisma create failed, using in-memory (dev only):", e?.code || e?.name || "unknown");
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
    const schemaGone = isSchemaMissing(e);
    if (IS_PROD) {
      // 生产 · 读失败也抛 · 后台 UI 可以捕获并显示可操作提示
      throw new InterestPersistError(
        schemaGone ? "TABLE_MISSING" : "DB_ERROR",
        "读取 CreatorInterest 失败",
        e,
      );
    }
    console.warn("[creator-interest] Prisma list failed, using in-memory (dev only):", e?.code || e?.name || "unknown");
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
  } catch (e: any) {
    if (IS_PROD) {
      throw new InterestPersistError(isSchemaMissing(e) ? "TABLE_MISSING" : "DB_ERROR", "读取详情失败", e);
    }
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
    if (IS_PROD) {
      throw new InterestPersistError(isSchemaMissing(e) ? "TABLE_MISSING" : "DB_ERROR", "更新审核字段失败", e);
    }
    console.warn("[creator-interest] Prisma update failed, using in-memory (dev only):", e?.code || e?.name || "unknown");
    const idx = memStore.findIndex((r) => r.id === id);
    if (idx === -1) return null;
    memStore[idx] = { ...memStore[idx], ...patch, reviewedAt: now, reviewedBy: actorId ?? memStore[idx].reviewedBy ?? null };
    return memStore[idx];
  }
}

/** 健康检查 · admin 页面用 · 探测 Prisma + CreatorInterest 表是否可用 */
export async function healthCheck(): Promise<{ ok: boolean; code?: string; message?: string }> {
  try {
    await (prisma as any).creatorInterest.count();
    return { ok: true };
  } catch (e: any) {
    return {
      ok: false,
      code: isSchemaMissing(e) ? "TABLE_MISSING" : "DB_ERROR",
      message: isSchemaMissing(e)
        ? "CreatorInterest 表未创建 · 在 Neon 上执行 npm run db:deploy"
        : "数据库读取失败",
    };
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
