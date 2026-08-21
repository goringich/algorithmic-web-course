export type PaymentTruthSource = "provider_webhook" | "provider_reconciliation";
export type PaymentStatus = "succeeded" | "refunded" | "canceled";

export type AuthoritativePaymentEvent = {
  source: PaymentTruthSource;
  provider: string;
  eventId: string;
  paymentId: string;
  orderId: string;
  subject: string;
  sku: string;
  status: PaymentStatus;
  occurredAt: string;
};

export type PaymentOrderState = {
  provider: string;
  paymentId: string;
  orderId: string;
  subject: string;
  sku: string;
  status: PaymentStatus;
  lastOccurredAt: string;
  entitlementGranted: boolean;
};

export type PaymentEntitlementState = {
  processedEventIds: string[];
  orders: Record<string, PaymentOrderState>;
};

export type EntitlementCommand =
  | { type: "grant"; subject: string; sku: string; orderId: string; paymentId: string }
  | { type: "revoke"; subject: string; sku: string; orderId: string; paymentId: string }
  | { type: "none"; reason: "duplicate_event" | "duplicate_state" | "stale_event" | "terminal_payment" };

export type PaymentTransition = {
  state: PaymentEntitlementState;
  command: EntitlementCommand;
};

const TERMINAL = new Set<PaymentStatus>(["refunded", "canceled"]);

export function emptyPaymentEntitlementState(): PaymentEntitlementState {
  return { processedEventIds: [], orders: {} };
}

function normalized(value: string, field: string) {
  const result = value.trim();
  if (!result) throw new Error(`${field} is required`);
  if (result.length > 160) throw new Error(`${field} is too long`);
  return result;
}

function eventTime(value: string) {
  const timestamp = Date.parse(value);
  if (!Number.isFinite(timestamp)) throw new Error("occurredAt must be a valid timestamp");
  return timestamp;
}

function keyFor(provider: string, paymentId: string) {
  return `${provider}:${paymentId}`;
}

function cloneState(state: PaymentEntitlementState): PaymentEntitlementState {
  return {
    processedEventIds: [...state.processedEventIds],
    orders: Object.fromEntries(
      Object.entries(state.orders).map(([key, order]) => [key, { ...order }]),
    ),
  };
}

export function applyAuthoritativePaymentEvent(
  current: PaymentEntitlementState,
  input: AuthoritativePaymentEvent,
): PaymentTransition {
  const event: AuthoritativePaymentEvent = {
    source: input.source,
    provider: normalized(input.provider, "provider"),
    eventId: normalized(input.eventId, "eventId"),
    paymentId: normalized(input.paymentId, "paymentId"),
    orderId: normalized(input.orderId, "orderId"),
    subject: normalized(input.subject, "subject"),
    sku: normalized(input.sku, "sku"),
    status: input.status,
    occurredAt: input.occurredAt,
  };
  const occurredAt = eventTime(event.occurredAt);

  if (current.processedEventIds.includes(event.eventId)) {
    return { state: current, command: { type: "none", reason: "duplicate_event" } };
  }

  const next = cloneState(current);
  next.processedEventIds.push(event.eventId);
  const orderKey = keyFor(event.provider, event.paymentId);
  const previous = next.orders[orderKey];

  if (previous) {
    if (
      previous.orderId !== event.orderId ||
      previous.subject !== event.subject ||
      previous.sku !== event.sku
    ) {
      throw new Error("payment identity does not match the existing authoritative record");
    }

    if (occurredAt < eventTime(previous.lastOccurredAt)) {
      return { state: next, command: { type: "none", reason: "stale_event" } };
    }

    if (TERMINAL.has(previous.status) && event.status === "succeeded") {
      return { state: next, command: { type: "none", reason: "terminal_payment" } };
    }
  }

  const entitlementWasGranted = previous?.entitlementGranted ?? false;
  const entitlementGranted = event.status === "succeeded"
    ? true
    : false;

  next.orders[orderKey] = {
    provider: event.provider,
    paymentId: event.paymentId,
    orderId: event.orderId,
    subject: event.subject,
    sku: event.sku,
    status: event.status,
    lastOccurredAt: event.occurredAt,
    entitlementGranted,
  };

  if (event.status === "succeeded" && !entitlementWasGranted) {
    return {
      state: next,
      command: {
        type: "grant",
        subject: event.subject,
        sku: event.sku,
        orderId: event.orderId,
        paymentId: event.paymentId,
      },
    };
  }

  if (TERMINAL.has(event.status) && entitlementWasGranted) {
    return {
      state: next,
      command: {
        type: "revoke",
        subject: event.subject,
        sku: event.sku,
        orderId: event.orderId,
        paymentId: event.paymentId,
      },
    };
  }

  return { state: next, command: { type: "none", reason: "duplicate_state" } };
}
