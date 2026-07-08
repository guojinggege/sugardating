// POST /api/media/unlock — 花 coins 解锁指定媒体
import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { spend, getWallet } from "@/lib/wallet";
import { isMediaUnlocked, unlockMedia } from "@/lib/media-access";
import { resolveCreatorMediaSrc } from "@/lib/creatorProfileMock";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: Request) {
  const s = getSession();
  if (!s) return NextResponse.json({ ok: false, code: "NOT_AUTHENTICATED", message: "请先登录" }, { status: 401 });

  let body: unknown;
  try { body = await req.json(); } catch { return NextResponse.json({ ok: false, code: "INVALID_JSON" }, { status: 400 }); }
  const b = (body ?? {}) as Record<string, unknown>;

  const creatorSlug = typeof b.creatorSlug === "string" ? b.creatorSlug.trim() : "";
  const mediaId     = typeof b.mediaId === "string" ? b.mediaId.trim() : "";
  const price       = Number(b.price);
  if (!creatorSlug || !mediaId || !Number.isFinite(price) || price <= 0) {
    return NextResponse.json({ ok: false, code: "INVALID_INPUT" }, { status: 400 });
  }

  // 已解锁则直接返回成功 (幂等)
  if (isMediaUnlocked(s.userId, creatorSlug, mediaId)) {
    return NextResponse.json({
      ok: true, alreadyUnlocked: true,
      wallet: getWallet(s.userId),
      src: resolveCreatorMediaSrc(creatorSlug, mediaId),
    });
  }

  try {
    const wallet = spend(s.userId, price, `unlock ${creatorSlug}:${mediaId}`);
    const record = unlockMedia(s.userId, creatorSlug, mediaId, price);
    const src = resolveCreatorMediaSrc(creatorSlug, mediaId);
    return NextResponse.json({ ok: true, wallet, unlock: record, src });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "";
    if (msg === "INSUFFICIENT_BALANCE") {
      return NextResponse.json({ ok: false, code: "INSUFFICIENT_BALANCE", message: "余额不足,请先充值 coins", wallet: getWallet(s.userId) }, { status: 402 });
    }
    return NextResponse.json({ ok: false, code: "SERVER_ERROR", message: "解锁失败,请稍后重试" }, { status: 500 });
  }
}
