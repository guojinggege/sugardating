// POST /api/trial/cancel · 用户在体验期内取消 · 不会扣款
import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { cancel, getTrial } from "@/lib/trial-offer/repository";
import { createNotification } from "@/lib/notifications";
import { recordAudit } from "@/lib/cms/audit";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST() {
  const s = getSession();
  if (!s) return NextResponse.json({ ok: false, code: "NOT_AUTHENTICATED" }, { status: 401 });
  const cur = getTrial(s.userId);
  if (!cur || (cur.status !== "active" && cur.status !== "consent_pending")) {
    return NextResponse.json({ ok: false, message: "当前没有正在进行的体验" }, { status: 409 });
  }
  const next = cancel(s.userId);
  createNotification({
    userId: s.userId,
    kind: "membership",
    title: "24h 体验已取消 · 不会扣款",
    body: "体验剩余时长中的付费权益立即失效 · 你已恢复到基础会员。",
    href: "/me?section=membership",
  });
  recordAudit({
    actorId: s.userId, actorEmail: s.email,
    action: "update", targetType: "trial-offer", targetId: s.userId,
    summary: "24h £0 体验已取消",
  });
  return NextResponse.json({ ok: true, trial: next });
}
