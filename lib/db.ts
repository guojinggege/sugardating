import { PrismaClient } from "@prisma/client";

// Prisma 单例 — 防止 dev 热更新时反复 new 实例
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
