// POST /api/admin/users/[id]/role
import { NextResponse } from "next/server";
import { requireAdminOrErr } from "@/lib/admin/auth";
import { cmsRepo } from "@/lib/cms/repository";
import { recordAudit } from "@/lib/cms/audit";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const ALLOWED_ROLES = ["user", "creator", "admin", "editor", "operator", "reviewer", "support", "finance"];

export async function POST(req: Request, ctx: { params: { id: string } }) {
  const { admin, code, message } = requireAdminOrErr();
  if (!admin) return NextResponse.json({ ok: false, message }, { status: code || 403 });

  let body: any;
  try { body = await req.json(); } catch { return NextResponse.json({ ok: false, message: "INVALID_JSON" }, { status: 400 }); }
  const role = typeof body?.role === "string" ? body.role : "";
  if (!ALLOWED_ROLES.includes(role)) {
    return NextResponse.json({ ok: false, message: "无效角色" }, { status: 400 });
  }

  const u = await cmsRepo.getUser(ctx.params.id);
  if (!u) return NextResponse.json({ ok: false, message: "用户不存在" }, { status: 404 });

  try {
    await cmsRepo.setUserRole(ctx.params.id, role);
    recordAudit({
      actorId: admin.userId, actorEmail: admin.email,
      action: "update", targetType: "user", targetId: ctx.params.id,
      summary: `修改角色:${u.email} · ${u.role} → ${role}`,
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("role update failed:", e);
    return NextResponse.json({ ok: false, message: "更新失败" }, { status: 500 });
  }
}
