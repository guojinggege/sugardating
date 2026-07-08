// Media Access — 解锁记录 + 锁定规则
// 前几个免费,后续按 index/hash 派生 locked + price
import { randomBytes } from "node:crypto";

export type MediaUnlockType = "coins" | "vip" | "gift" | "membership";

export interface UnlockRecord {
  id: string;
  userId: string;
  creatorSlug: string;
  mediaId: string;
  price: number;
  currency: "coins";
  unlockedAt: string;
}

declare global {
  // eslint-disable-next-line no-var
  var __sgUnlocks: Map<string, Set<string>> | undefined;   // userId → Set(`${creatorSlug}:${mediaId}`)
  // eslint-disable-next-line no-var
  var __sgUnlockLog: Map<string, UnlockRecord[]> | undefined;
}
const unlocks   = globalThis.__sgUnlocks    ?? new Map<string, Set<string>>();
const unlockLog = globalThis.__sgUnlockLog  ?? new Map<string, UnlockRecord[]>();
globalThis.__sgUnlocks = unlocks;
globalThis.__sgUnlockLog = unlockLog;

const key = (creatorSlug: string, mediaId: string) => `${creatorSlug}:${mediaId}`;

export function isMediaUnlocked(userId: string, creatorSlug: string, mediaId: string): boolean {
  return unlocks.get(userId)?.has(key(creatorSlug, mediaId)) ?? false;
}

export function unlockMedia(userId: string, creatorSlug: string, mediaId: string, price: number): UnlockRecord {
  let set = unlocks.get(userId);
  if (!set) { set = new Set(); unlocks.set(userId, set); }
  set.add(key(creatorSlug, mediaId));

  const rec: UnlockRecord = {
    id: `u_${randomBytes(4).toString("hex")}`,
    userId, creatorSlug, mediaId,
    price, currency: "coins",
    unlockedAt: new Date().toISOString(),
  };
  const log = unlockLog.get(userId) ?? [];
  log.push(rec);
  unlockLog.set(userId, log);
  return rec;
}

export function listUserUnlocks(userId: string): UnlockRecord[] {
  return unlockLog.get(userId) ?? [];
}

// 派生 lock 规则:同一 creator 内前 2 个 index 免费,后续 30-40% 锁
// 价格根据 index hash 定 (8/12/16/20 coins)
export interface DerivedLock {
  isLocked: boolean;
  price?: number;
  unlockType?: MediaUnlockType;
}

const PRICE_TIERS = [8, 12, 16, 20];

export function deriveLockRule(creatorSlug: string, index: number): DerivedLock {
  if (index < 2) return { isLocked: false };
  // Every 3rd item locked (index 2, 5, 8, 11...) — ~33% lock rate
  if ((index - 2) % 3 !== 0) return { isLocked: false };
  const priceIndex = (hashStr(creatorSlug) + index) % PRICE_TIERS.length;
  return { isLocked: true, price: PRICE_TIERS[priceIndex], unlockType: "coins" };
}

function hashStr(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}
