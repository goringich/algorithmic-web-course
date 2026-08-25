import { randomUUID } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";

const allowed = new Set([
  "landing_view",
  "algorithm_open",
  "second_lesson_open",
  "visualization_complete",
  "practice_attempt",
  "practice_correct",
  "practice_set_passed",
  "lesson_mastered",
  "review_completed",
  "pricing_view",
  "checkout_click",
  "lead_submit",
]);

const MAX_BODY_BYTES = 12_288;
const MAX_PROPERTIES_BYTES = 8_192;
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

type AnalyticsPayload = {
  eventId?: string;
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

function normalizeEventId(value: unknown) {
  if (value === undefined) return randomUUID();
  if (typeof value !== "string" || !UUID_PATTERN.test(value)) return null;
  return value.toLowerCase();
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
    return { value: JSON.parse(raw) as AnalyticsPayload };
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
  const payload = parsed.value;
  if (!payload?.event || !allowed.has(payload.event)) {
    return NextResponse.json({ error: "invalid_event" }, { status: 400 });
  }

  const eventId = normalizeEventId(payload.eventId);
  if (!eventId) return NextResponse.json({ error: "invalid_event_id" }, { status: 400 });

  const occurredAt = normalizeOccurredAt(payload.occurredAt);
  if (!occurredAt) return NextResponse.json({ error: "invalid_occurred_at" }, { status: 400 });

  const properties = normalizeProperties(payload.properties);
  if (!properties) return NextResponse.json({ error: "invalid_properties" }, { status: 400 });

  const event = {
    id: eventId,
    event: payload.event,
    properties,
    path: typeof payload.path === "string" ? payload.path.slice(0, 240) : undefined,
    occurredAt,
    receivedAt: new Date().toISOString(),
    schemaVersion: 2,
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
