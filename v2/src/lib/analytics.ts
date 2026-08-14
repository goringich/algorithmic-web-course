export type AnalyticsEvent =
  | "landing_view"
  | "algorithm_open"
  | "second_lesson_open"
  | "visualization_complete"
  | "pricing_view"
  | "checkout_click"
  | "lead_submit";

export function track(event: AnalyticsEvent, properties: Record<string, string | number | boolean> = {}) {
  if (typeof window === "undefined") return;
  const payload = {
    event,
    properties,
    path: window.location.pathname,
    referrer: document.referrer || undefined,
    occurredAt: new Date().toISOString(),
  };
  void fetch("/api/events", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
    keepalive: true,
  }).catch(() => undefined);
}
