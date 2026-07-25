// 关注 · 唯一 source of truth · Prisma + Neon 持久化
// 所有关注读写必须走此文件 · 不允许再直接用 lib/mock-db globalThis 版本
import { prisma } from "@/lib/db";
import { Prisma } from "@prisma/client";

export type CreatorType = "sugargirl" | "sugarboy" | "massage";

// ══════════════════════════════════════
// Read
// ══════════════════════════════════════

export async function getFollowingIds(userId: string): Promise<string[]> {
  const rows = await prisma.follow.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    select: { creatorSlug: true },
  });
  return rows.map((r) => r.creatorSlug);
}

export async function getFollowingRows(userId: string): Promise<Array<{ creatorSlug: string; creatorType: string; createdAt: Date }>> {
  return prisma.follow.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    select: { creatorSlug: true, creatorType: true, createdAt: true },
  });
}

export async function isFollowing(userId: string, creatorSlug: string): Promise<boolean> {
  const r = await prisma.follow.findUnique({
    where: { userId_creatorSlug: { userId, creatorSlug } },
    select: { id: true },
  });
  return !!r;
}

export async function countEligibleFollowing(userId: string): Promise<number> {
  // MVP:所有已关注均计入 · 后续接 Creator status=active 过滤时在此加 join
  return prisma.follow.count({ where: { userId } });
}

// ══════════════════════════════════════
// Write · idempotent
// ══════════════════════════════════════

export async function follow(userId: string, creatorSlug: string, creatorType: CreatorType = "sugargirl"): Promise<boolean> {
  try {
    await prisma.follow.create({
      data: { userId, creatorSlug, creatorType },
    });
    return true;
  } catch (e) {
    // P2002 unique constraint · 已关注 · 幂等返回 false
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      return false;
    }
    throw e;
  }
}

export async function unfollow(userId: string, creatorSlug: string): Promise<boolean> {
  try {
    await prisma.follow.delete({
      where: { userId_creatorSlug: { userId, creatorSlug } },
    });
    return true;
  } catch (e) {
    // P2025 record not found · 幂等
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2025") {
      return false;
    }
    throw e;
  }
}

export async function toggleFollow(userId: string, creatorSlug: string, creatorType: CreatorType = "sugargirl"): Promise<{ following: boolean }> {
  const exists = await isFollowing(userId, creatorSlug);
  if (exists) {
    await unfollow(userId, creatorSlug);
    return { following: false };
  }
  await follow(userId, creatorSlug, creatorType);
  return { following: true };
}
