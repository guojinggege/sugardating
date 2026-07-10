// POST /api/admin/users/[id]/wallet-adjust
import { NextResponse } from "next/server";
import { requireAdminOrErr } from "@/lib/admin/auth";
import { cmsRepo } from "@/lib/cms/repository";
import { recordAudit } from "@/lib/cms/audit";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: Request, ctx: { params: { id: string } }) {
  const { admin, code, message } = requireAdminOrErr();
  if (!admin) return NextResponse.json({ ok: false, message }, { status: code || 403 });

  let body: any;
  try { body = await req.json(); } catch { return NextResponse.json({ ok: false, message: "INVALID_JSON" }, { status: 400 }); }
  const delta = Number(body?.delta);
  const memo = typeof body?.memo === "string" ? body.memo.slice(0, 200) : undefined;
  if (!Number.isFinite(delta) || delta === 0) {
    return NextResponse.json({ ok: false, message: "调整金额无效" }, { status: 400 });
  }

  const u = await cmsRepo.getUser(ctx.params.id);
  if (!u) return NextResponse.json({ ok: false, message: "用户不存在" }, { status: 404 });

  try {
    const wallet = cmsRepo.adjustUserWallet(ctx.params.id, delta, memo);
    recordAudit({
      actorId: admin.userId, actorEmail: admin.email,
      action: "update", targetType: "user", targetId: ctx.params.id,
      summary: `调整钱包:${u.email} · ${delta > 0 ? "+" : ""}${delta} credits${memo ? " · " + memo : ""}`,
    });
    return NextResponse.json({ ok: true, wallet });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "";
    if (msg === "INSUFFICIENT_BALANCE") {
      return NextResponse.json({ ok: false, message: "余额不足,无法扣减" }, { status: 400 });
    }
    return NextResponse.json({ ok: false, message: "调整失败" }, { status: 500 });
  }
}
