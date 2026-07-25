// POST /api/trial/testing · Dev / Preview 专用 · 直接推进 engagement seconds 或重置 trial
// 生产 (未开 PAYMENTS_ALLOW_MOCK) 关闭
import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { setTotalSeconds } from "@/lib/engagement/tracker";
import { resetForTesting } from "@/lib/trial-offer/repository";
import { addFollowing } from "@/lib/mock-db";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function testingAllowed(): boolean {
  if (process.env.NODE_ENV !== "production") return true;
  return process.env.PAYMENTS_ALLOW_MOCK === "true";
}

export async function POST(req: Request) {
  if (!testingAllowed()) return NextResponse.json({ ok: false, message: "生产环境已禁用" }, { status: 403 });
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
  if (action === "add_demo_follows") {
    const count = Math.min(10, Math.max(1, Number(body?.count) || 5));
    const seeds = ["aria", "yuki", "leon", "yumeko", "chen", "kenji", "mira", "saoirse", "wren", "muyu"];
    for (let i = 0; i < count; i++) {
      const slug = seeds[i % seeds.length] + (i >= seeds.length ? `-${Math.floor(i / seeds.length)}` : "");
      addFollowing(s.userId, slug);
    }
    return NextResponse.json({ ok: true });
  }
  if (action === "reset_trial") {
    resetForTesting(s.userId);
    return NextResponse.json({ ok: true });
  }
  return NextResponse.json({ ok: false, message: "unknown action" }, { status: 400 });
}
