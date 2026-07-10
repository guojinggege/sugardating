// POST /api/admin/applications/[id]/reject
import { NextResponse } from "next/server";
import { requireAdminOrErr } from "@/lib/admin/auth";
import { cmsRepo } from "@/lib/cms/repository";
import { recordAudit } from "@/lib/cms/audit";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: Request, ctx: { params: { id: string } }) {
  const { admin, code, message } = requireAdminOrErr();
  if (!admin) return NextResponse.json({ ok: false, message }, { status: code || 403 });

  let notes: string | undefined;
  try { const b = await req.json(); notes = typeof b?.notes === "string" ? b.notes.slice(0, 500) : undefined; } catch {}

  const app = cmsRepo.getApplication(ctx.params.id);
  if (!app) return NextResponse.json({ ok: false, message: "申请不存在" }, { status: 404 });

  const updated = cmsRepo.updateApplication(ctx.params.id, { status: "rejected", reviewNotes: notes });
  recordAudit({
    actorId: admin.userId, actorEmail: admin.email,
    action: "reject", targetType: "application", targetId: ctx.params.id,
    summary: `拒绝入驻申请:${app.applicantName} (${app.type})${notes ? ` · ${notes}` : ""}`,
  });
  return NextResponse.json({ ok: true, application: updated });
}
