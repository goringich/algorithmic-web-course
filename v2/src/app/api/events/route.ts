import { randomUUID } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";

const allowed = new Set([
  "landing_view",
  "algorithm_open",
  "second_lesson_open",
  "visualization_complete",
  "practice_attempt",
  "practice_correct",
  "pricing_view",
  "checkout_click",
  "lead_submit",
]);

const MAX_PROPERTIES_BYTES = 8_192;

type AnalyticsPayload = {
  event?: string;
  properties?: unknown;
  path?: string;
  occurredAt?: string;
};

function normalizeOccurredAt(value: unknown) {
  if (typeof value !== "string") return new Date().toISOString();
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString();
}

function normalizeProperties(value: unknown) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  try {
    const serialized = JSON.stringify(value);
    if (Buffer.byteLength(serialized, "utf8") > MAX_PROPERTIES_BYTES) return null;
    return value;
  } catch {
    return null;
  }
}

export async function POST(request: NextRequest) {
  const payload = await request.json().catch(() => null) as AnalyticsPayload | null;
  if (!payload?.event || !allowed.has(payload.event)) {
    return NextResponse.json({ error: "invalid_event" }, { status: 400 });
  }

  const occurredAt = normalizeOccurredAt(payload.occurredAt);
  if (!occurredAt) return NextResponse.json({ error: "invalid_occurred_at" }, { status: 400 });

  const properties = normalizeProperties(payload.properties);
  if (!properties) return NextResponse.json({ error: "invalid_properties" }, { status: 400 });

  const event = {
    id: randomUUID(),
    event: payload.event,
    properties,
    path: typeof payload.path === "string" ? payload.path.slice(0, 240) : undefined,
    occurredAt,
    receivedAt: new Date().toISOString(),
    schemaVersion: 1,
  };

  const webhook = process.env.ANALYTICS_WEBHOOK_URL;
  if (!webhook) {
    console.info("algohar_event", JSON.stringify(event));
    return NextResponse.json({ ok: true, forwarded: false, eventId: event.id });
  }

  const headers: Record<string, string> = { "content-type": "application/json" };
  if (process.env.ANALYTICS_WEBHOOK_TOKEN) {
    headers.authorization = `Bearer ${process.env.ANALYTICS_WEBHOOK_TOKEN}`;
  }

  try {
    const response = await fetch(webhook, {
      method: "POST",
      headers,
      body: JSON.stringify(event),
      signal: AbortSignal.timeout(3_000),
    });
    if (!response.ok) {
      console.error("algohar_event_delivery_failed", event.id, response.status);
      return NextResponse.json(
        { error: "analytics_delivery_failed", eventId: event.id },
        { status: 503 },
      );
    }
  } catch (error) {
    console.error("algohar_event_delivery_failed", event.id, error instanceof Error ? error.message : "unknown");
    return NextResponse.json(
      { error: "analytics_delivery_failed", eventId: event.id },
      { status: 503 },
    );
  }

  return NextResponse.json({ ok: true, forwarded: true, eventId: event.id });
}
