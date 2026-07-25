// POST /api/auth/email-otp/send · body { email, purpose }
// Demo mode: 返回 code (仅 dev / EMAIL_OTP_DEMO_MODE=true)
import { NextResponse } from "next/server";
import { issueOtp } from "@/lib/auth/email-otp";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const OK_PURPOSES = new Set(["register", "link_provider", "generic"]);

export async function POST(req: Request) {
  let body: any;
  try { body = await req.json(); } catch { return NextResponse.json({ ok: false, message: "INVALID_JSON" }, { status: 400 }); }
  const email = typeof body?.email === "string" ? body.email : "";
  const purpose = OK_PURPOSES.has(body?.purpose) ? body.purpose : "generic";
  const result = issueOtp(email, purpose);
  if (!result.ok) return NextResponse.json({ ok: false, message: result.message }, { status: 400 });
  return NextResponse.json({
    ok: true,
    demoMode: result.demoMode,
    demoCode: result.demoMode ? result.code : undefined,
  });
}
