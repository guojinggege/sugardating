// POST /api/admin/applications/[id]/approve
import { NextResponse } from "next/server";
import { requireAdminOrErr } from "@/lib/admin/auth";
import { cmsRepo } from "@/lib/cms/repository";
import { recordAudit } from "@/lib/cms/audit";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(_req: Request, ctx: { params: { id: string } }) {
  const { admin, code, message } = requireAdminOrErr();
  if (!admin) return NextResponse.json({ ok: false, message }, { status: code || 403 });

  const app = await cmsRepo.getApplication(ctx.params.id);
  if (!app) return NextResponse.json({ ok: false, message: "申请不存在" }, { status: 404 });

  const updated = await cmsRepo.updateApplication(ctx.params.id, { status: "approved" }, admin.userId);
  recordAudit({
    actorId: admin.userId, actorEmail: admin.email,
    action: "approve", targetType: "application", targetId: ctx.params.id,
    summary: `通过入驻意向:${app.applicantName}`,
  });
  return NextResponse.json({ ok: true, application: updated });
}
