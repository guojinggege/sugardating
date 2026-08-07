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

  const app = await cmsRepo.getApplication(ctx.params.id);
  if (!app) return NextResponse.json({ ok: false, message: "申请不存在" }, { status: 404 });

  const updated = await cmsRepo.updateApplication(ctx.params.id, { status: "rejected", reviewNotes: notes }, admin.userId);
  recordAudit({
    actorId: admin.userId, actorEmail: admin.email,
    action: "reject", targetType: "application", targetId: ctx.params.id,
    summary: `拒绝入驻意向:${app.applicantName}${notes ? ` · ${notes}` : ""}`,
  });
  return NextResponse.json({ ok: true, application: updated });
}
