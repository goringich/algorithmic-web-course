import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null) as null | { contact?: unknown; goal?: unknown; source?: unknown };
  const contact = typeof body?.contact === "string" ? body.contact.trim().slice(0, 160) : "";
  const goal = typeof body?.goal === "string" ? body.goal.trim().slice(0, 400) : "";
  const source = typeof body?.source === "string" ? body.source.trim().slice(0, 80) : "unknown";
  if (contact.length < 3) return NextResponse.json({ error: "invalid_contact" }, { status: 400 });

  const webhook = process.env.LEAD_WEBHOOK_URL;
  if (!webhook) {
    console.warn("algohar_lead_channel_unconfigured", JSON.stringify({ source, occurredAt: new Date().toISOString() }));
    return NextResponse.json({ ok: true, configured: false }, { status: 202 });
  }

  const headers: Record<string, string> = { "content-type": "application/json" };
  if (process.env.LEAD_WEBHOOK_TOKEN) headers.authorization = `Bearer ${process.env.LEAD_WEBHOOK_TOKEN}`;
  const response = await fetch(webhook, {
    method: "POST",
    headers,
    body: JSON.stringify({ contact, goal, source, occurredAt: new Date().toISOString() }),
    signal: AbortSignal.timeout(5000),
  }).catch(() => undefined);
  if (!response?.ok) return NextResponse.json({ error: "lead_delivery_failed" }, { status: 502 });
  return NextResponse.json({ ok: true, configured: true });
}
