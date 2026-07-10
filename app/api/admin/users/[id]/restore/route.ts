// POST /api/admin/users/[id]/restore
import { NextResponse } from "next/server";
import { requireAdminOrErr } from "@/lib/admin/auth";
import { cmsRepo } from "@/lib/cms/repository";
import { recordAudit } from "@/lib/cms/audit";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(_req: Request, ctx: { params: { id: string } }) {
  const { admin, code, message } = requireAdminOrErr();
  if (!admin) return NextResponse.json({ ok: false, message }, { status: code || 403 });

  const u = await cmsRepo.getUser(ctx.params.id);
  if (!u) return NextResponse.json({ ok: false, message: "用户不存在" }, { status: 404 });

  cmsRepo.setUserStatus(ctx.params.id, "active");
  recordAudit({
    actorId: admin.userId, actorEmail: admin.email,
    action: "restore", targetType: "user", targetId: ctx.params.id,
    summary: `恢复用户:${u.email}`,
  });
  return NextResponse.json({ ok: true });
}
