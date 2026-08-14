import { NextRequest, NextResponse } from "next/server";
import { activateEntitlement } from "@/lib/entitlement";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null) as { token?: unknown } | null;
  const token = typeof body?.token === "string" ? body.token : "";
  if (!token) return NextResponse.json({ error: "missing_token" }, { status: 400 });
  const activated = await activateEntitlement(token);
  if (!activated) return NextResponse.json({ error: "invalid_or_expired_token" }, { status: 401 });
  return NextResponse.json({ ok: true });
}
