import { NextRequest, NextResponse } from "next/server";

const MAX_BODY_BYTES = 4_096;

type LeadPayload = {
  contact?: unknown;
  goal?: unknown;
  source?: unknown;
};

function sameOrigin(request: NextRequest) {
  const origin = request.headers.get("origin");
  return !origin || origin === request.nextUrl.origin;
}

async function boundedJson(request: NextRequest) {
  const contentLength = Number(request.headers.get("content-length") ?? "0");
  if (Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES) return { error: "payload_too_large" as const };
  const raw = await request.text();
  if (Buffer.byteLength(raw, "utf8") > MAX_BODY_BYTES) return { error: "payload_too_large" as const };
  try {
    return { value: JSON.parse(raw) as LeadPayload };
  } catch {
    return { error: "invalid_json" as const };
  }
}

export async function POST(request: NextRequest) {
  if (!sameOrigin(request)) {
    return NextResponse.json({ error: "cross_origin_request" }, { status: 403 });
  }

  const parsed = await boundedJson(request);
  if ("error" in parsed) {
    return NextResponse.json(
      { error: parsed.error },
      { status: parsed.error === "payload_too_large" ? 413 : 400 },
    );
  }

  const body = parsed.value;
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
    signal: AbortSignal.timeout(5_000),
  }).catch(() => undefined);
  if (!response?.ok) return NextResponse.json({ error: "lead_delivery_failed" }, { status: 502 });
  return NextResponse.json({ ok: true, configured: true });
}
