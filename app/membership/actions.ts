"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";

export interface ActionResult {
  ok: boolean;
  error?: string;
  membershipId?: string;
}

// 不接真实支付,只在 DB 落一条 Membership 记录
// userId 暂为空(待 auth 接入后回填); endsAt 由套餐 period 计算
export async function subscribeMembership(planId: string): Promise<ActionResult> {
  const plan = await prisma.membershipPlan.findUnique({ where: { id: planId } });
  if (!plan) return { ok: false, error: "套餐不存在" };

  const now = new Date();
  const ends = new Date(now);
  switch (plan.period) {
    case "week":    ends.setDate(ends.getDate() + 7); break;
    case "month":   ends.setMonth(ends.getMonth() + 1); break;
    case "quarter": ends.setMonth(ends.getMonth() + 3); break;
    case "year":    ends.setFullYear(ends.getFullYear() + 1); break;
    default:        return { ok: false, error: "未知周期" };
  }

  const m = await prisma.membership.create({
    data: {
      planId: plan.id,
      userId: null,        // 等 auth
      startsAt: now,
      endsAt: ends,
      status: "active",
    },
  });
  revalidatePath("/membership");
  return { ok: true, membershipId: m.id };
}
