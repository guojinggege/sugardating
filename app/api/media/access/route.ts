// GET /api/media/access?creatorSlug=X&mediaIds=id1,id2
// 批量查当前用户对某 creator 一组 media 的解锁状态
import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { isMediaUnlocked } from "@/lib/media-access";
import { resolveCreatorMediaSrc } from "@/lib/creatorProfileMock";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(req: Request) {
  const s = getSession();
  const url = new URL(req.url);
  const creatorSlug = url.searchParams.get("creatorSlug") || "";
  const mediaIdsRaw = url.searchParams.get("mediaIds") || "";
  const mediaIds = mediaIdsRaw.split(",").map((s) => s.trim()).filter(Boolean);

  if (!creatorSlug || mediaIds.length === 0) {
    return NextResponse.json({ ok: true, access: {}, sources: {} });
  }
  if (!s) {
    return NextResponse.json({
      ok: true,
      access: Object.fromEntries(mediaIds.map((id) => [id, false])),
      sources: {},
    });
  }

  const access: Record<string, boolean> = {};
  const sources: Record<string, string> = {};
  for (const id of mediaIds) {
    const ok = isMediaUnlocked(s.userId, creatorSlug, id);
    access[id] = ok;
    if (ok) {
      const src = resolveCreatorMediaSrc(creatorSlug, id);
      if (src) sources[id] = src;
    }
  }
  return NextResponse.json({ ok: true, access, sources });
}
