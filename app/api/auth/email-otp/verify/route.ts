// POST /api/auth/email-otp/verify · body { email, code, purpose }
import { NextResponse } from "next/server";
import { verifyOtp } from "@/lib/auth/email-otp";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: Request) {
  let body: any;
  try { body = await req.json(); } catch { return NextResponse.json({ ok: false, message: "INVALID_JSON" }, { status: 400 }); }
  const email = typeof body?.email === "string" ? body.email : "";
  const code = typeof body?.code === "string" ? body.code : "";
  const purpose = ["register", "link_provider", "generic"].includes(body?.purpose) ? body.purpose : "generic";
  const result = verifyOtp(email, code, purpose);
  if (!result.ok) return NextResponse.json({ ok: false, message: result.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
