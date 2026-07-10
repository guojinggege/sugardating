// POST /api/admin/users/[id]/suspend
import { NextResponse } from "next/server";
import { requireAdminOrErr } from "@/lib/admin/auth";
import { cmsRepo } from "@/lib/cms/repository";
import { recordAudit } from "@/lib/cms/audit";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: Request, ctx: { params: { id: string } }) {
  const { admin, code, message } = requireAdminOrErr();
  if (!admin) return NextResponse.json({ ok: false, message }, { status: code || 403 });

  let reason: string | undefined;
  try { const b = await req.json(); reason = typeof b?.reason === "string" ? b.reason.slice(0, 500) : undefined; } catch {}

  const u = await cmsRepo.getUser(ctx.params.id);
  if (!u) return NextResponse.json({ ok: false, message: "用户不存在" }, { status: 404 });

  cmsRepo.setUserStatus(ctx.params.id, "suspended", reason);
  recordAudit({
    actorId: admin.userId, actorEmail: admin.email,
    action: "suspend", targetType: "user", targetId: ctx.params.id,
    summary: `禁用用户:${u.email}${reason ? ` · ${reason}` : ""}`,
  });
  return NextResponse.json({ ok: true });
}
