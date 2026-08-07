// Sugargirl 全球招募 · /apply 意向 · Prisma 持久化
// 生产:严格 Prisma · 失败即抛错(不显示假成功)· dev/preview 允许内存 fallback
// 敏感字段 (contact 类) 永远不进日志 / URL / analytics
import { prisma } from "@/lib/db";
import { randomBytes, createHash } from "node:crypto";

export type InterestStatus = "student" | "employed" | "freelancer";
export type ReviewStatus = "submitted" | "reviewing" | "needs_changes" | "approved" | "rejected";

const IS_PROD = process.env.NODE_ENV === "production";

function isSchemaMissing(e: any): boolean {
  const code = e?.code;
  return code === "P2021" || code === "P2022" ||
    /does not exist in the current database/i.test(String(e?.message || ""));
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

/** 表单原始输入 · 未经服务端 trim / 白名单 · API route 传入前必须已 sanitize */
export interface CreatorInterestInput {
  nickname: string;
  city: string;
  status: InterestStatus;
  whatsapp?: string | null;
  instagram?: string | null;
  xHandle?: string | null;
  otherContact?: string | null;
  ageConfirmed: boolean;
  contactConsent: boolean;
  locale?: "zh" | "en" | null;
  source?: string | null;
  pagePath?: string | null;
  referrer?: string | null;
  utmSource?: string | null;
  utmMedium?: string | null;
  utmCampaign?: string | null;
  utmContent?: string | null;
  ipHash?: string | null;
  userAgent?: string | null;
}

export interface CreatorInterestRecord extends CreatorInterestInput {
  id: string;
  // 旧字段仅历史记录用 · 新提交不写
  telephone?: string | null;
  email?: string | null;
  mobile?: string | null;
  createdAt: Date;
  updatedAt: Date;
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
    if (IS_PROD) {
      console.error("[creator-interest] persist FAILED in prod:", e?.code || e?.name || "unknown");
      throw new InterestPersistError(
        schemaGone ? "TABLE_MISSING" : "DB_ERROR",
        schemaGone
          ? "CreatorInterest 表 / 列尚未在生产 DB 就绪 · 需在 Neon 执行 prisma migrate deploy"
          : "写入生产数据库失败",
        e,
      );
    }
    console.warn("[creator-interest] Prisma create failed, using in-memory (dev only):", e?.code || e?.name || "unknown");
    const now = new Date();
    const rec: CreatorInterestRecord = {
      id: `mem_${randomBytes(6).toString("hex")}`,
      ...input,
      telephone: null, email: null, mobile: null,
      createdAt: now,
      updatedAt: now,
      reviewStatus: "submitted",
      reviewNotes: null,
      reviewedAt: null,
      reviewedBy: null,
    };
    memStore.push(rec);
    return rec;
  }
}

export async function listInterests(): Promise<CreatorInterestRecord[]> {
  try {
    const rows = await (prisma as any).creatorInterest.findMany({
      orderBy: { createdAt: "desc" },
    });
    return rows as CreatorInterestRecord[];
  } catch (e: any) {
    if (IS_PROD) {
      throw new InterestPersistError(
        isSchemaMissing(e) ? "TABLE_MISSING" : "DB_ERROR",
        "读取 CreatorInterest 失败",
        e,
      );
    }
    console.warn("[creator-interest] Prisma list failed, using in-memory (dev only):", e?.code || e?.name || "unknown");
    return memStore.slice().sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
}

/** IP → 稳定短哈希 · 反滥用去重 · 不能反向推 IP */
export function hashIp(ip: string | null | undefined): string | null {
  if (!ip) return null;
  const salt = process.env.INTEREST_HASH_SALT || "sugardating-interest-v1";
  return createHash("sha256").update(salt + ip).digest("hex").slice(0, 12);
}

/** 24h 内同一 IP 提交次数 · 限流 */
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
