// POST /api/admin/users/[id]/notes   — 添加备注
// DELETE /api/admin/users/[id]/notes?noteId=xxx — 删除备注
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
  const text = typeof body?.text === "string" ? body.text.trim().slice(0, 500) : "";
  if (!text) return NextResponse.json({ ok: false, message: "备注内容不能为空" }, { status: 400 });

  const u = await cmsRepo.getUser(ctx.params.id);
  if (!u) return NextResponse.json({ ok: false, message: "用户不存在" }, { status: 404 });

  const note = cmsRepo.addUserNote(ctx.params.id, text, admin.email);
  recordAudit({
    actorId: admin.userId, actorEmail: admin.email,
    action: "create", targetType: "user-note", targetId: ctx.params.id,
    summary: `新增备注 · 用户 ${u.email}`,
  });
  return NextResponse.json({ ok: true, note });
}

export async function DELETE(req: Request, ctx: { params: { id: string } }) {
  const { admin, code, message } = requireAdminOrErr();
  if (!admin) return NextResponse.json({ ok: false, message }, { status: code || 403 });

  const url = new URL(req.url);
  const noteId = url.searchParams.get("noteId") || "";
  if (!noteId) return NextResponse.json({ ok: false, message: "缺少 noteId" }, { status: 400 });

  const ok = cmsRepo.removeUserNote(ctx.params.id, noteId);
  if (!ok) return NextResponse.json({ ok: false, message: "备注不存在" }, { status: 404 });

  recordAudit({
    actorId: admin.userId, actorEmail: admin.email,
    action: "delete", targetType: "user-note", targetId: ctx.params.id,
    summary: `删除备注 · ${noteId}`,
  });
  return NextResponse.json({ ok: true });
}
