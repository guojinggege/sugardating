// POST /api/custom-services/request
// 未登录用户也可提交,登录后绑定 userId
import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { createRequest } from "@/lib/custom-request-store";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const ALLOWED_EVENTS = ["yacht", "cocktail", "photoshoot", "business", "members-club"];

export async function POST(req: Request) {
  let body: any;
  try { body = await req.json(); } catch { return NextResponse.json({ ok: false, code: "INVALID_JSON" }, { status: 400 }); }

  // Validation
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const eventTypes = Array.isArray(body.eventTypes)
    ? body.eventTypes.filter((e: unknown) => typeof e === "string" && ALLOWED_EVENTS.includes(e))
    : [];
  const confirmAdult = body.confirmAdult === true;
  const acceptPlatformRules = body.acceptPlatformRules === true;

  if (!name || name.length > 80) {
    return NextResponse.json({ ok: false, code: "INVALID_NAME", message: "请填写称呼" }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ ok: false, code: "INVALID_EMAIL", message: "邮箱格式无效" }, { status: 400 });
  }
  if (eventTypes.length === 0) {
    return NextResponse.json({ ok: false, code: "NO_EVENT_TYPE", message: "请至少选择一种活动类型" }, { status: 400 });
  }
  if (!confirmAdult) {
    return NextResponse.json({ ok: false, code: "MUST_CONFIRM_ADULT", message: "请确认已满 18 岁" }, { status: 400 });
  }
  if (!acceptPlatformRules) {
    return NextResponse.json({ ok: false, code: "MUST_ACCEPT_RULES", message: "请同意平台使用规则" }, { status: 400 });
  }

  const session = getSession();

  const rec = createRequest({
    userId: session?.userId,
    name,
    email,
    phone: typeof body.phone === "string" ? body.phone.trim() : undefined,
    eventTypes,
    country: typeof body.country === "string" ? body.country.trim() : undefined,
    city: typeof body.city === "string" ? body.city.trim() : undefined,
    area: typeof body.area === "string" ? body.area.trim() : undefined,
    venue: typeof body.venue === "string" ? body.venue.trim() : undefined,
    date: typeof body.date === "string" ? body.date : undefined,
    startTime: typeof body.startTime === "string" ? body.startTime : undefined,
    duration: typeof body.duration === "string" ? body.duration : undefined,
    languages: Array.isArray(body.languages) ? body.languages.filter((x: unknown) => typeof x === "string") : undefined,
    stylePreferences: Array.isArray(body.stylePreferences) ? body.stylePreferences.filter((x: unknown) => typeof x === "string") : undefined,
    guestCount: Number.isFinite(Number(body.guestCount)) && Number(body.guestCount) > 0 ? Number(body.guestCount) : undefined,
    dressCode: typeof body.dressCode === "string" ? body.dressCode.trim() : undefined,
    needsPhotoVideo: !!body.needsPhotoVideo,
    needsVideoConfirmation: !!body.needsVideoConfirmation,
    requiresVerified: !!body.requiresVerified,
    wantsRecommendations: !!body.wantsRecommendations,
    budgetRange: typeof body.budgetRange === "string" ? body.budgetRange : undefined,
    notes: typeof body.notes === "string" ? body.notes.slice(0, 2000) : undefined,
    confirmAdult,
    acceptPlatformRules,
  });

  return NextResponse.json({ ok: true, requestId: rec.id, status: rec.status });
}
