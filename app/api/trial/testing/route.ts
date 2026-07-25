// POST /api/trial/testing · 仅 Dev / Preview 且 TRIAL_DEMO_MODE=true
// 生产环境无论 TRIAL_DEMO_MODE 如何设置 · 都强制返回 404
// 已废弃:add_demo_follows (spec §10 · 不允许写入真实 Follow · 强制使用真实关注)
import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { setTotalSeconds } from "@/lib/engagement/tracker";
import { resetForTesting } from "@/lib/trial-offer/repository";
import { isTrialDemoEnabled } from "@/lib/trial-offer/demo-mode";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/** 生产环境返回 404 (伪装 route 不存在) · 让接口在生产不可探测 */
function notFound() {
  return NextResponse.json({ ok: false, message: "Not Found" }, { status: 404 });
}

export async function POST(req: Request) {
  if (!isTrialDemoEnabled()) return notFound();

  const s = getSession();
  if (!s) return NextResponse.json({ ok: false, code: "NOT_AUTHENTICATED" }, { status: 401 });

  let body: any;
  try { body = await req.json(); } catch { body = {}; }
  const action = body?.action;

  if (action === "set_engagement") {
    const seconds = Number(body?.seconds) || 0;
    const rec = setTotalSeconds(s.userId, seconds);
    return NextResponse.json({ ok: true, engagement: rec });
  }
  if (action === "reset_trial") {
    resetForTesting(s.userId);
    return NextResponse.json({ ok: true });
  }
  if (action === "add_demo_follows") {
    return NextResponse.json({
      ok: false,
      code: "REMOVED",
      message: "add_demo_follows 已下线 · 请在创作者主页进行真实关注 · 见 spec §10",
    }, { status: 410 });
  }
  return NextResponse.json({ ok: false, message: "unknown action" }, { status: 400 });
}

export async function GET() { return notFound(); }
