export type AnalyticsEvent =
  | "landing_view"
  | "algorithm_open"
  | "second_lesson_open"
  | "visualization_complete"
  | "practice_attempt"
  | "practice_correct"
  | "practice_set_passed"
  | "lesson_mastered"
  | "review_completed"
  | "pricing_view"
  | "checkout_click"
  | "lead_submit";

const ATTRIBUTION_KEY = "algohar-v2-attribution";
const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"] as const;

type Attribution = {
  landingPath: string;
  referrerHost?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
};

function bounded(value: string | null | undefined, max = 160) {
  return value ? value.trim().slice(0, max) : undefined;
}

function currentAttribution(): Attribution {
  try {
    const existing = window.sessionStorage.getItem(ATTRIBUTION_KEY);
    if (existing) {
      const parsed = JSON.parse(existing) as Partial<Attribution>;
      if (typeof parsed.landingPath === "string") return parsed as Attribution;
    }
  } catch {
    // Storage can be unavailable in hardened/private browser modes. Attribution
    // is supporting context, never a reason to block the learning experience.
  }

  const params = new URLSearchParams(window.location.search);
  const result: Attribution = { landingPath: window.location.pathname.slice(0, 240) };
  for (const key of UTM_KEYS) {
    const value = bounded(params.get(key));
    if (value) result[key] = value;
  }
  if (document.referrer) {
    try {
      result.referrerHost = bounded(new URL(document.referrer).hostname, 200);
    } catch {
      // Ignore malformed referrers rather than forwarding arbitrary text.
    }
  }
  try {
    window.sessionStorage.setItem(ATTRIBUTION_KEY, JSON.stringify(result));
  } catch {
    // See the note above: metrics must not break the product.
  }
  return result;
}

export function track(event: AnalyticsEvent, properties: Record<string, string | number | boolean> = {}) {
  if (typeof window === "undefined") return;
  const attribution = currentAttribution();
  const payload = {
    event,
    properties: {
      ...properties,
      landingPath: attribution.landingPath,
      ...(attribution.referrerHost ? { referrerHost: attribution.referrerHost } : {}),
      ...Object.fromEntries(
        UTM_KEYS.flatMap((key) => attribution[key] ? [[key, attribution[key]!]] : []),
      ),
    },
    path: window.location.pathname,
    occurredAt: new Date().toISOString(),
  };
  void fetch("/api/events", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
    keepalive: true,
  }).catch(() => undefined);
}
