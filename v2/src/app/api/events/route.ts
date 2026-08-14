import { NextRequest, NextResponse } from "next/server";

const allowed = new Set([
  "landing_view",
  "algorithm_open",
  "second_lesson_open",
  "visualization_complete",
  "pricing_view",
  "checkout_click",
  "lead_submit",
]);

export async function POST(request: NextRequest) {
  const payload = await request.json().catch(() => null) as null | { event?: string; properties?: unknown; path?: string; occurredAt?: string };
  if (!payload?.event || !allowed.has(payload.event)) return NextResponse.json({ error: "invalid_event" }, { status: 400 });
  const event = {
    event: payload.event,
    properties: payload.properties && typeof payload.properties === "object" ? payload.properties : {},
    path: typeof payload.path === "string" ? payload.path.slice(0, 240) : undefined,
    occurredAt: typeof payload.occurredAt === "string" ? payload.occurredAt : new Date().toISOString(),
  };
  const webhook = process.env.ANALYTICS_WEBHOOK_URL;
  if (webhook) {
    const headers: Record<string, string> = { "content-type": "application/json" };
    if (process.env.ANALYTICS_WEBHOOK_TOKEN) headers.authorization = `Bearer ${process.env.ANALYTICS_WEBHOOK_TOKEN}`;
    await fetch(webhook, { method: "POST", headers, body: JSON.stringify(event), signal: AbortSignal.timeout(3000) }).catch(() => undefined);
  } else console.info("algohar_event", JSON.stringify(event));
  return NextResponse.json({ ok: true, forwarded: Boolean(webhook) });
}
