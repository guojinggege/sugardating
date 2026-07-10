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

  const app = cmsRepo.getApplication(ctx.params.id);
  if (!app) return NextResponse.json({ ok: false, message: "申请不存在" }, { status: 404 });

  const updated = cmsRepo.updateApplication(ctx.params.id, { status: "approved" });
  recordAudit({
    actorId: admin.userId, actorEmail: admin.email,
    action: "approve", targetType: "application", targetId: ctx.params.id,
    summary: `通过入驻申请:${app.applicantName} (${app.type})`,
  });
  return NextResponse.json({ ok: true, application: updated });
}
