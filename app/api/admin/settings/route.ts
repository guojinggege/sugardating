// GET/PATCH /api/admin/settings
import { NextResponse } from "next/server";
import { requireAdminOrErr } from "@/lib/admin/auth";
import { cmsRepo } from "@/lib/cms/repository";
import { recordAudit } from "@/lib/cms/audit";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  const { admin, code, message } = requireAdminOrErr();
  if (!admin) return NextResponse.json({ ok: false, message }, { status: code || 403 });
  return NextResponse.json({ ok: true, settings: cmsRepo.getSettings() });
}

export async function PATCH(req: Request) {
  const { admin, code, message } = requireAdminOrErr();
  if (!admin) return NextResponse.json({ ok: false, message }, { status: code || 403 });

  let body: any;
  try { body = await req.json(); } catch { return NextResponse.json({ ok: false, message: "INVALID_JSON" }, { status: 400 }); }

  const patch: any = {};
  if (typeof body.siteName === "string") patch.siteName = body.siteName.trim().slice(0, 60);
  if (typeof body.defaultLocale === "string") patch.defaultLocale = body.defaultLocale;
  if (typeof body.maintenanceMode === "boolean") patch.maintenanceMode = body.maintenanceMode;
  if (body.flags && typeof body.flags === "object") {
    const allowed = [
      "registrationEnabled", "creatorApplicationEnabled", "chatEnabled",
      "lockedMediaEnabled", "creditsEnabled", "massageChannelEnabled",
      "sugarboyChannelEnabled", "journalEnabled", "customServicesEnabled",
    ];
    const flags: any = {};
    for (const k of allowed) if (typeof body.flags[k] === "boolean") flags[k] = body.flags[k];
    patch.flags = flags;
  }

  const updated = cmsRepo.updateSettings(patch);
  recordAudit({
    actorId: admin.userId, actorEmail: admin.email,
    action: "settings.update", targetType: "settings", targetId: "site",
    summary: `更新站点设置 · ${Object.keys(patch).join(", ")}`,
  });
  return NextResponse.json({ ok: true, settings: updated });
}
